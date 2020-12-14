import { SubjectsEnum } from './subjects';

export interface TicketCreatedEventInterface {
    subject: SubjectsEnum.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number;
        userId?: string;
    };
}
