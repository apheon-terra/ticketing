// import { BadRequestError } from './errors/bad-request-error';

// interface Color {
//     red: number;
//     blue: number;
//     green:number
// }

// const color: Color = {
//     red: 20,
//     blue: 10,
//     green: 10
// };

// console.log(color);

// export default color;

// two options to import 
//bad
// import { BadRequestError } from '@apheontickets/common/errors/bad-request-error'

//better
// import { BadRequestError } from '@apheontickets/common'
//
//for solution 2
export * from './errors/bad-request-error';
export * from './errors/custom-error';
export * from './errors/database-connection-error';
export * from './errors/not-authorized-error';
export * from './errors/not-found-error';
export * from './errors/request-validation-error';

export * from './middlewares/current-user';
export * from './middlewares/error-handler';
export * from './middlewares/require-auth';
export * from './middlewares/validate-request';

export * from './events/base-listener';
export * from './events/base-publisher';
export * from './events/subjects';
export * from './events/ticket-created-event';
export * from './events/ticket-updated-event';
export * from './events/types/order-status';

export * from './events/order-cancelled-event-interface';
export * from './events/order-created-event-interface';

export * from './events/expiration-complet-event-interface';

export * from './events/payment-created-event-interface';
