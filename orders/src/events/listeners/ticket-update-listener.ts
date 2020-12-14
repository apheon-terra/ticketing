import { Message } from 'node-nats-streaming';
import {
    SubjectsEnum,
    ListenerAbstract,
    TicketUpdatedEventInterface,
} from '@grider-ms-tickets/common';
import { queueGroupName } from './queue-group-name';

import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends ListenerAbstract<
    TicketUpdatedEventInterface
    > {
    subject: SubjectsEnum.TicketUpdated = SubjectsEnum.TicketUpdated;
    queueGroupName = queueGroupName;//extract this param

    async onMessage(data: TicketUpdatedEventInterface['data'], msg: Message) {
        //v1
        // const ticket = await Ticket.findById(data.id);

                //concurency control
        //v2
        // const ticket = await Ticket.findOne({
        //     _id: data.id,//filter criteria inside db 
        //     version: data.version -1
        // });  // => moved to Ticket model
        
        //v3
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price } = data;

        ticket.set({
            title,
            price,
        });

        //a way of updating the version withut using the mongoose plugin
        // step 1 updating version number on records ebfore they are saved
        //step 2 customize find and update operation to look for crrect version => mongoose => model.prototype.$where()
        // const { title, price ,version} = data;

        // ticket.set({
        //     title,
        //     price,
        //     version
        // });
        
        
        await ticket.save();

        msg.ack();
    }
}


//the mongoose-connect-if is only reponsible for updating the version inside the db, the filtering is done by us in the function injected in the model

//we cannot rely on using the exact same versioning semantics as this mongo mongoose update if current module, some events might not be computed from same db source, different schema, diff version or timestamp versioning

//lets try by library agnostic rather lib oriented on the version updating in the db stuff