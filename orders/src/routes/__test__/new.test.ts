import mongoose from 'mongoose';//to generate valid obj ID
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatusEnum } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId:ticketId,
        })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {

    //create the ticket 
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    //save it to db
    await ticket.save();
    //create an order 
    const order = Order.build({
        ticket:ticket,
        userId: 'dfsdfsdfee',
        status: OrderStatusEnum.Created,
        expiresAt: new Date(),
    });
    // save to db
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),

        title: 'concert',
        price: 20,
    });

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

// it.todo('emits an order created event');

it('emits an order created event', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    // expect(natsWrapper.client.publish).not.toHaveBeenCalled(); to check fail

});