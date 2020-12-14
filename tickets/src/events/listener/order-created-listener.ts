import { Message } from 'node-nats-streaming';
import {
    ListenerAbstract,
    OrderCreatedEventInterface,
    SubjectsEnum,
} from '@grider-ms-tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';
import { natsWrapper} from '../../nats-wrapper'
export class OrderCreatedListener extends ListenerAbstract<
    OrderCreatedEventInterface
    > {
    subject: SubjectsEnum.OrderCreated = SubjectsEnum.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEventInterface['data'], msg: Message) {
        //find ticket that the order is reserving                
        const ticket = await Ticket.findById(data.ticket.id);
        //if no ticket throw error
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        //mark the ticket as being reserved by setting its orderId property

        ticket.set({ orderId: data.id });
        //save the ticket

        await ticket.save();
        
        //v1 too much linking and make testing heavy
        // await new TicketUpdatedPublisher(natsWrapper.client)
        
        
        //v2 parametirize the nats client video 39 cptr 19
        //now we have access to client because its protected
        //basic formula
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,//the presence of orderId to see whether or not ticket is reserved ,null or something , if something then prevent edits
            version: ticket.version,
        });//await just in case we trhrow an error

        //ack the message

        msg.ack();
    }
}


