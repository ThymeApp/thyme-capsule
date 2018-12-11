// @flow

import type { $Response } from 'express';

import stripe from './stripe';

import { Customer } from './database';

import type { ThymeRequest } from './types';

export const buySubscription = async ({
  user,
  body,
}: ThymeRequest): Promise<boolean> => {
  if (!user) {
    throw new Error('Missing user auth object');
  }

  const { token, values } = body;

  const results = await Customer.findOrCreate({
    where: {
      UserId: user.id,
    },
    defaults: Object.assign(
      {},
      { UserId: user.id },
      values,
    ),
  });
  const customer = results[0];

  if (!customer.stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      source: token,
    });

    customer.stripeCustomerId = stripeCustomer.id;
    await customer.save();
  }

  const plan = values.payIn === 'EUR' ? process.env.STRIPE_PLAN_EUR : process.env.STRIPE_PLAN_USD;

  await stripe.subscriptions.create({
    customer: customer.stripeCustomerId,
    items: [{ plan }],
  });

  const userObject = await customer.getUser();
  await userObject.update({ premium: true });

  return true;
};

export const stripeWebhook = async ({ body }: ThymeRequest, res: $Response) => {
  const { type } = body;

  switch (type) {
    case 'invoice.payment_succeeded':
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed': {
      const customerId = body.data.object.customer;

      try {
        const customer = await Customer.findOne({ where: { stripeCustomerId: customerId } });
        const user = await customer.getUser();

        if (type === 'invoice.payment_succeeded') {
          user.update({ premium: true });
        }

        if (type === 'invoice.payment_failed' || type === 'customer.subscription.deleted') {
          user.update({ premium: false });
        }
      } catch (e) {
        console.error(e);
      }

      return res.end(JSON.stringify(true));
    }
    default:
      return res.end(JSON.stringify(true));
  }
};
