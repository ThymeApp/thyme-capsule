// @flow

import stripe from 'stripe';

export default stripe(process.env.STRIPE_KEY);
