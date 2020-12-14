export enum OrderStatusEnum {
    //when the order has  been created but the ticket it is tying to order has not been resrved
    Created = 'created',

    //the ticket the order is tying to reserve has already been reserved or when the user has cancelled the order
    //the order expirres before payment
    Cancelled = 'cancelled',

    // the order has successfully reserved the ticket 
    AwaitingPayment = 'awaiting:payment',

    //the order has reserved the client and the user has provided payment successfully
    Complete = 'complete',
}
