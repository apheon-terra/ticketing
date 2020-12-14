import { PublisherAbstract } from './base-publisher'

import { TicketCreatedEventInterface } from './ticket-created-event'
import { SubjectsEnum } from './subjects'

export class TicketCreatePublisher extends PublisherAbstract<TicketCreatedEventInterface>{

    subject: SubjectsEnum.TicketCreated = SubjectsEnum.TicketCreated;
}