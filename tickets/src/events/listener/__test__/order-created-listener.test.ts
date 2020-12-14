import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
  OrderCreatedEventInterface,
  OrderStatusEnum,
} from '@grider-ms-tickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    //create an instance of listener
                                        //its a jest mock
  const listener = new OrderCreatedListener(natsWrapper.client);
//create and save the ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });

  await ticket.save();
    //create fake data event
  const data: OrderCreatedEventInterface['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatusEnum.Created,
    userId: 'adfadsfa',
    expiresAt: 'adfadsf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // @ts-ignore
 console.log(natsWrapper.client.publish.mock.calls[0][1]);//json
    
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );//tell that is a mock function to tell ts 

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
