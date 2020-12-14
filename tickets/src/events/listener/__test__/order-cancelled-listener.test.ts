import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEventInterface } from '@grider-ms-tickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    //uniq order id
    const orderId = mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'asdf',
        // orderId//error, no code change for the fix better workaround bellow
    });

    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEventInterface['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        },
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };
    
    //v1
    return { msg, data, ticket, orderId, listener };
    // return { listener, ticket, data, msg, orderId };
};

it('updates the ticket, publishes an event and acks the message', async () => {
    
    const { msg, data, ticket, orderId, listener } = await setup();
    // const { listener, ticket, data, msg, orderId } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
