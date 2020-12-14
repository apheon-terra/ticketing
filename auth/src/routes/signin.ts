// import { RequestValidationError } from '../errors/request-validation-error';
import express, { Request ,Response } from 'express';
import { body , validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';
import { User } from '../models/user';

// import { validateRequest } from '../middlewares/validate-request';

// import { BadRequestError } from '../errors/bad-request-error';

import { validateRequest, BadRequstError } from '@grider-ms-tickets/common';

const router = express.Router();

// router.post('/api/users/signin', (req, res) => {
//     res.send('Hi there!');
// });


router.post(
    '/api/users/signin',
    [
        body('email')
            .isEmail().
            withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password'),
    ],
    validateRequest,//middleware custom
    async (req: Request, res: Response) => {
        
        // const errors = validationResult(req);//body specific
        
        // if (!errors.isEmpty()) {
        //     throw new RequestValidationError(errors.array());
        // }


        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new BadRequstError('Invalid credentials');
        }

        const passwordsMatch = await Password.compare(
            existingUser.password,
            password
        );

        if (!passwordsMatch) {
            throw new BadRequstError('Invalid credentials');
        }

        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
            },
            process.env.JWT_KEY!//it tells the ts not worry about it as a further reminder
        );

        req.session = { jwt: userJwt };

        return res.status(200).send(existingUser);
    }
);

export { router as signinRouter };
