import { SubjectsEnum } from './subjects';

export interface PaymentCreatedEventInteface {
    subject: SubjectsEnum.PaymentCreated;
    data: {
        id: string;
        orderId: string;
        stripeId: string;
    };
}
