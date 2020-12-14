import { SubjectsEnum } from './subjects';
import { OrderStatusEnum } from './types/order-status';

export interface OrderCreatedEventInterface {
    subject: SubjectsEnum.OrderCreated;
    data: {
        id: string;
        version: number;
        status: OrderStatusEnum;
        userId: string;
        expiresAt: string;
        ticket: {
            id: string;
            price: number;
        };
    };
}
