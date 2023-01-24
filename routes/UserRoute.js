import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/UserController.js';

const UserRoute = express.Router();

UserRoute.get('/users', getUsers);
UserRoute.get('/users/:id', getUserById);
UserRoute.post('/users', createUser);
UserRoute.patch('/users/:id', updateUser);
UserRoute.delete('/users/:id', deleteUser);

export default UserRoute;
