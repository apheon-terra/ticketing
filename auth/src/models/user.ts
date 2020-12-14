import mongoose from 'mongoose'
import { Password } from '../services/password'

// mongoose user model reporesents the collection of user
// mongoose user document reppresents one single user

//an interface that describes the propperties that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
        email: {
            type: String,//monogoose specific attribute not impactfull to typescript, String is an actual constructor not a type string for typescript
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    
    {
        toJSON: {
                    //source dest
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._i;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
 );



//we are responsible for calling done once we complete the work
//when we put together a middleware function we get access to the document that is being saved, so the actual user we're trying to persist as this. inside of this function(){} . If we used an arrow function ()=>{} then the value of this would be overriden and equal to the context of the entire file as oposed to our user document , not what we want. this is the reason why we use regular function instead of arrow function 
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    const err = new Error('something went wrong');
    // throw new Error('something went wrong');
     done(err);
    //instead of await some response
    //we do the await and then done()
});


//v1
// const User = mongoose.model('User', userSchema);


//v1 example 
// new User({
//     email: 'sdas@test.com',
//     pas: 'asdas',
//     another: 'sdad'
// })

//v2 correct way of builiding because has some validoation logic
// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs);
// }

//the effect

// buildUser({
//     email:'sda',
//     password: 'qwer'
//     another:134//thanks typescript
// })

//v3 
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};
// User.build({})//a no go


//v4
//an interface that describes the properties that a user model has

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

//issue no 1 fixed checking the typeof the model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

const user =User.build({
    email: 'test@test.com',
    password: 'password',
    // adss:sd
})


// issue 2 is propreties that we pass to the user ctor dont match up with the propr available on a user

//an interface that describes the properties that a user document has
//this is the place to add new properties

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

//and now we can access the properties as 
user.email
user.password
//user.updatedat //does not exist in userDoc

export { User, /*buildUser */ };



