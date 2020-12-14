import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
// import { RequestValidationError } from '../errors/request-validation-error';
// import { DatabaseConnectionError } from '../errors/database-connection-error';
import { User } from '../models/user'
// import {BadRequestError} from '../errors/bad-request-error'
import jwt from 'jsonwebtoken'

import { validateRequest, BadRequstError } from '@grider-ms-tickets/common';
// ../../node_modules /@apheon-terra / apheontickets
const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email')
            .isEmail().
            withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters'),
    ],validateRequest,
    async (req: Request, res: Response) => {
        // const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     throw new RequestValidationError(errors.array());
        //     // return res.status(400).send(error.array());

        //     //javascript alt

        //     // const error = new Error('invlaid email or paswsdd');
        //     // error.reasons = error.array();
        //     //throw error
        // }

        const { email, password } = req.body;


        //primitive validation

        // if (!email || typeof email == 'string') {
        //     res.status(400).send('provide a valid email');
        // }

        //new User({email, password});




        // throw new DatabaseConnectionError();

        // console.log('Crateing a user...');

        // return res.send({});


        const existingUser = await User.findOne({ email });
        //if user exists return an error
        if (existingUser) {
            throw new BadRequstError('Email in use');//general
            
            // console.log('email in use ');
            // return res.send({});
        }
        

        //hash the pwd

        //create new user
        const user = User.build({
            email,
            password,
        });
        //save to db
        await user.save();


        //send them a cookie for aknowledge
        // chapter 9
        //generate jwt
        //sync returns jwt as string

        //async the callback is calletd with err or jwt

        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },/*'sdasd' */
            process.env.JWT_KEY!// this exist inside the pod declared in skaffold
        );

        //store it on session object
        //if req,session.jwt typescritp types isssue
        
        req.session = { jwt: userJwt };

        // or send back some positive
        res.status(201).send(user);

    }
);

export { router as signupRouter };
