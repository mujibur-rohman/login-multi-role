import express from 'express';
import { Login, logOut, Me } from '../controllers/AuthController.js';

const AuthRoute = express.Router();

AuthRoute.post('/login', Login);
AuthRoute.delete('/logout', logOut);
AuthRoute.get('/auth', Me);

export default AuthRoute;
