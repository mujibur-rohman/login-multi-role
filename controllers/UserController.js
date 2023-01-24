import Users from '../models/UserModel.js';
import argon2 from 'argon2';

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ['uuid', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      where: {
        uuid: req.params.id,
      },
      attributes: ['uuid', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
    });
    if (!response) return res.status(404).json({ msg: 'User Not Found' });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashPassword = await argon2.hash(password);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: 'User Create Successfuly' });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const updateUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: 'User not Found' });
  const { name, email, password, role } = req.body;

  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: password ? await argon2.hash(password) : user.password,
        role: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: 'User Updated' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
export const deleteUser = async (req, res) => {
  const user = await Users.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: 'User bot Found' });
  try {
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: 'User Deleted' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
