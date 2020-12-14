import { Listener } from './base-listener'
import {Message} from 'node-nats-streaming'

import { TicketCreatedEventInterface } from './ticket-created-event'

import { SubjectsEnum}  from './subjects'
export class TicketCreatedListener extends
    Listener    <TicketCreatedEventInterface>  {
    // subject = 'ticket:created';//refactor subject and propr of the event acompanied

    //v2 refactor
    readonly subject: SubjectsEnum.TicketCreated = SubjectsEnum.TicketCreated;

    queueGroupName = 'payments-service';//=> refactor these
    onMessage(data: /*any*/ TicketCreatedEventInterface['data'], msg: Message) {//refactor any type
        console.log('Event  data !', data);
        // future logic

        //type checking on the propr of the data 
        // console.log(data.name);
        // console.log(data.cost);
        msg.ack();
    }
}
//In the last video, I said that Typescript doesn't have a final keyword that can make sure that a given property does not get changed.

// That was a mistake on my part.

// Typescript does have a keyword of readonly.It prevents a property of a class from being changed.You can read more about readonly here: https://www.typescriptlang.org/docs/handbook/classes.html#readonly-modifier



// With this in mind, we can update the TicketCreatedListener class to the following:

// export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
//     readonly subject = Subjects.TicketCreated;

//     // ...everything else
// }
// This change can be made in all other listeners that we create in this course.

