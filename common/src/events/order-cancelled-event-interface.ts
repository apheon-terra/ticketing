import { SubjectsEnum } from './subjects';

export interface OrderCancelledEventInterface {
    subject: SubjectsEnum.OrderCancelled;
    data: {
        id: string;
        //add version for conc control

        version: number;
        ticket: {
            id: string;
        };
    };
}
