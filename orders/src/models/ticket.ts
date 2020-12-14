import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
// import { OrderStatusEnum } from '@grider-ms-tickets/common';
//the above import is re-exported from Order for cohesive reasons


import { Order, OrderStatusEnum } from './order';

//custom to the need , cannot be externelized int o a lib
interface TicketAttrs {
    //maintain consisten id between services
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    
    build(attrs: TicketAttrs): TicketDoc;
    
    //allows filtering from onmessage() to Ticketmodel
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;

}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

ticketSchema.set('versionKey', 'version');

ticketSchema.plugin(updateIfCurrentPlugin);


//step 2 of lib agnostic setup
//with this function theoretically we don;t need mongoose update-if concurency control plugin
// ticketSchema.pre('save', function (done) {
    
//     //@ts-ignore
//     this.$where = {
//         version: this.get('version') - 1,//or -100 or wathever
//     };
//     //@ts-ignore
//     done();
// })
//get into the order-mongo depl pod
//then get into shell
// kubectl exec -it order-mongo-depl mongo

//show dbs;
//use orders //db
//db.tickets.find({price: 200}) // version 2
//db.tickets.find({price: 201}) // version 3


//inject our implementation for filering on the statics namespace
ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    })
};


ticketSchema.statics.build = (attrs: TicketAttrs) => {
    // return new Ticket(attrs); // to facilitate transition into db from id to _id mongo specific we do v2

    //v2
    return new Ticket({
        _id: attrs.id,
        title: attrs.price,
        price: attrs.price,
    })

};

//to the document using methods. funct expression due to mongo
ticketSchema.methods.isReserved = async function () {
    //this == the ticket document we jsut called isReserved on
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatusEnum.Created,
                OrderStatusEnum.AwaitingPayment,
                OrderStatusEnum.Complete,
            ],
        },
    });
        //if null or object present
    return !!existingOrder;//flip from  null to true then to false
    // flip from something /object present /found to false then to true
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };



//@ts-nocheck
// to associate an existing order and ticket together 

// const ticket = await Ticket.findOne({});
// const order = await Order.findOne({});
// order.ticket = ticket;
// await order.save();


//to associate an existing Ticket with a *new* Order
// const ticket = await Ticket.findOne({});

// const order = Order.build({
//     ticket: ticket,
//     userID: '...',
//     status:OrderStatusEnum.Created,
//     expiresAt:tomorrow
// })
// await order.save();

//to fetch an existing order from the database
//with its associated Ticket
// const order = await Order.findById('...').populate('ticket');
// order.ticket.price;
// order.ticket.title;





