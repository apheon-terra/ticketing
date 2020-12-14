import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: '2020-08-27',
    //'2020-03-02', so at the right time 
});
