import {
    PublisherAbstract,
    OrderCancelledEventInterface,
    SubjectsEnum,
} from '@grider-ms-tickets/common';

export class OrderCancelledPublisher extends PublisherAbstract<
    OrderCancelledEventInterface
    > {//type annotation         value asignation
    subject: SubjectsEnum.OrderCancelled = SubjectsEnum.OrderCancelled;
}
