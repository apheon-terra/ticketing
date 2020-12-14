import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { OrderStatusEnum } from '@grider-ms-tickets/common';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';//will replace wth the mock

// jest.mock('../../stripe');//redirect and interject

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdfkfj',
            orderId: mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that does not belogns to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatusEnum.Created,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdfkfj',
            orderId: order.id,
        })
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatusEnum.Cancelled,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'asdlkfj',
        })
        .expect(400);
});

it('returns a 201 with valid inputs', async () => {

    const userId = mongoose.Types.ObjectId().toHexString();
    
    //random price
    const price = Math.floor(Math.random() * 1000000);
    
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatusEnum.Created,
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',//stripe test account token
            orderId: order.id,
        })
        .expect(201);

    //v1 
    //look at all the times it was called[0] and then look at the first argument also 
    //needs mocks stripe ts

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    
    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(20 * 100);
    // expect(chargeOptions.currency).toEqual('usd');



    //v2
    //talk with the real api
    //we remove the jest.mock('../../stripe.ts) from above
    //need to ahave acess to stripe secret key
    //we set the secret key in the setup.ts

    // the idea is to take the details of the info returned by stripe api via the route hadler without cutomizing the route to redirect the info to the testcase
    //our route does not do that nor we want to modify it to do just that
    //a diff solution needed
    //retrieve a charge, but we cannot comunicate any info about charge itself from the route hadler to the test file 
    //retrieve charge endpoint is not helpfull
    //list all charges endpoint => good options
    //so we makee the route hadler to send just a success : true to our test file
    //after that we have the test itself reach out to the api
    //request a list of 10 most recent charges created
    //response apropriately
    //filter among thos for the charge with the correct set of properties
    //remember token and currency are always gonna be the same for evey test run, so data might be stale
    //so need to make sure there is some unique prop that identify that charge inside this list of most 10 recent charges inside our test file
    //solution is we used currency as unique information to reflect that data is not stale
    //when it comes time to filtering all we need to seek is the charge with unique amount
    
    //list all charge , number limit of queue is 50, nested inside data when retrieve
    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find((charge) => {
        return charge.amount === price * 100;//price in cents
    });
    
    expect(stripeCharge).toBeDefined();//stripeCharge can be stripe.Charge | undefined
    //check currency
    expect(stripeCharge!.currency).toEqual('usd');
    //look in the collection with the coorect charge id , a given order id
    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id,
    });//possible retrieves PaymentDoc  | null
    //

    // expect(payment).toBeDefined();//allways success because null and undefined are 2 diff things, because payment and null are going to pass toBeDefined

    //we need a dif filter criteria hence notToBeNull
    expect(payment).not.toBeNull();
});


