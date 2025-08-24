const express = require('express');
// const { auth } = require('express-oauth2-jwt-bearer');
const controller = require('../controllers/_testController');
// const authController = require('../controllers/authController');

// const jwtCheck = auth({
//   audience: 'https://express-temp.beingmomen.com',
//   issuerBaseURL: 'https://dev-qqjtuc1jz3ej3f1z.us.auth0.com/',
//   tokenSigningAlg: 'RS256'
// });

// console.log('jwtCheck :>> ', jwtCheck);

// enforce on all endpoints
// app.use(jwtCheck);

const router = express.Router();

router.route('/').get(controller.getAll).post(controller.createOne);
module.exports = router;
