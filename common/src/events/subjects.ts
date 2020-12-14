export enum SubjectsEnum {
    TicketCreated = 'ticket:created',
    TicketUpdated = 'ticket:updated',

    //chapter 18 order publisher updated

    OrderCreated = 'order:created',
    OrderCancelled = 'order:cancelled',


    // chapter 20 v12

    ExpirationComplete='expiration:complete',

    //chapter 21
    PaymentCreated = 'payment:created',

}


// const printSubject = (subject:SubjectsEnum) => {
    
// }

// printSubject('adasd')//nope


// printSubject(SubjectsEnum.TicketCreated);//yep