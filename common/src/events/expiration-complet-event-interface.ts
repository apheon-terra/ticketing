import { SubjectsEnum } from './subjects';

export interface ExpirationCompleteEventInterface {
    subject: SubjectsEnum.ExpirationComplete;
    data: {
        orderId: string;
    };
}
