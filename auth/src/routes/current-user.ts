import express from 'express';

// import { currentUser } from '../middlewares/current-user';


//with package installer
import { currentUser } from '@grider-ms-tickets/common';
//'@apheon-terra/apheontickets';

import jwt from 'jsonwebtoken'//create validate and extract info from it

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    return res.send({ currentUser: req.currentUser });
});

//v1 first implementation without current User

router.get('/api/users/currentuser', currentUser, (req, res) => {

    //v1 ts is upset due to undefined type of jwt
    // if (!req.session.jwt) {
    //     return res.send({ currentUser: null });
    // }
    
    // v2 the fix
    // if (!req.session||!req.session.jwt) {
    //     return res.send({ currentUser: null });
    // }

    // v3 the fix

    // does this user have a jwt set ?
    // if (!req.session?.jwt) {
    //     //if not or jwt invalid return early
    //     return res.send({ currentUser: null });
    // }
    //source of potential middleware for extracting payload 
    // try {
    //     // if yes and valid send back the info stored inside jwt
    //     const payload = jwt.verify(
    //         req.session.jwt,
    //         process.env.JWT_KEY!);    //it tells the ts not worry about it as a further reminder
    //     res.send({ currentUser: payload });
    // }
    // catch (err)
    // {    //if yes but invalid spring an error
    //     res.send({ currentUser: null }); 
    // }



    return res.send({ currentUser: req.currentUser||null });//null for the case of user is not logged in

});





export { router as currentUserRouter };
