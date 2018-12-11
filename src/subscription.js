// @flow

import stripe from './stripe';

import { User, Customer } from './database';

import type { ThymeRequest } from './types';

export const buySubscription = async ({
  user,
  body,
}: ThymeRequest): Promise<boolean> => {
  if (!user) {
    throw new Error('Missing user auth object');
  }

  const { token, values } = body;

  const customer = await Customer.findOrCreate({
    where: {
      UserId: user.id,
    },
    defaults: Object.assign(
      {},
      { UserId: user.id },
      values,
    ),
  });

  if (!customer.stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      source: token,
    });

    customer.stripeCustomerId = stripeCustomer.id;
    await customer.save();

    const plan = values.payIn === 'EUR' ? process.env.STRIPE_PLAN_EUR : process.env.STRIPE_PLAN_USD;

    await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ plan }],
    });
  }

  return true;
};
