import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    //here lies __v in mongoose document
    //manually add version
    version: number;
    orderId?: string;//first created this wont be any id associated with it , string or undefined
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
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
        },
        userId: {
            type: String,
            required: true,
        },
        orderID: {
            type: String,
            //no required because when ticket is first created is not going to be any order associated with it 
        }
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

 //track the version of these different documents using the version feature, and rename it to a better alias tham default implementation __v
ticketSchema.set('versionKey', 'version');


ticketSchema.plugin(updateIfCurrentPlugin);


ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
