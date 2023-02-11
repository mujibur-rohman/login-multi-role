import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/UserController.js';
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';

const UserRoute = express.Router();

UserRoute.get('/users', verifyUser, adminOnly, getUsers);
UserRoute.get('/users/:id', verifyUser, adminOnly, getUserById);
UserRoute.post('/users', verifyUser, adminOnly, createUser);
UserRoute.patch('/users/:id', verifyUser, adminOnly, updateUser);
UserRoute.delete('/users/:id', verifyUser, adminOnly, deleteUser);

export default UserRoute;
