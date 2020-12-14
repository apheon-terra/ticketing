import { Message } from 'node-nats-streaming';
import {
    SubjectsEnum,
    ListenerAbstract,
    TicketCreatedEventInterface,
} from '@grider-ms-tickets/common';
import { queueGroupName } from './queue-group-name';

import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends ListenerAbstract<
    TicketCreatedEventInterface
    > {
    subject: SubjectsEnum.TicketCreated = SubjectsEnum.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEventInterface['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,//need to make sure we use consisten Id between ticket service and order service when we hydrate them, here the id is different that the one pulled from ticket service chptr 19 video 6. we need to adjust the build function// build fct initially does not have id

            //we need to have a codec for id 
            //takes _id from mongo in ticket= > id in json= > order id=> then IF NOT processed we will store order service db with id , content and _id random
            // to prevent this we need to convert id => _id
            title,
            price,
        });

        await ticket.save();

        msg.ack();//success processed
    }
}


