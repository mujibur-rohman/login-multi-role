import Products from '../models/ProductModel.js';
import Users from '../models/UserModel.js';
import path from 'path';
import { Op } from 'sequelize';
import fs from 'fs';

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === 'admin') {
      response = await Products.findAll({
        attributes: ['uuid', 'name', 'price', 'url'],
        include: [
          {
            model: Users,
            attributes: ['name', 'email'],
          },
        ],
      });
    } else {
      response = await Products.findAll({
        attributes: ['uuid', 'name', 'price', 'url'],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ['name', 'email'],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    let response;
    if (req.role === 'admin') {
      response = await Products.findOne({
        attributes: ['uuid', 'name', 'price', 'url'],
        where: {
          id: product.id,
        },
        include: [
          {
            model: Users,
            attributes: ['name', 'email'],
          },
        ],
      });
    } else {
      response = await Products.findAll({
        attributes: ['uuid', 'name', 'price'],
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        include: [
          {
            model: Users,
            attributes: ['name', 'email'],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createProduct = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: 'No File Uploaded' });
  const name = req.body.name;
  const file = req.files.file;
  const price = req.body.price;
  console.log(price);

  const fileSize = file?.data.length;
  const ext = path.extname(file?.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: 'Invalid Images' });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: 'Image must be less than 5 MB' });

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Products.create({
        name: name,
        image: fileName,
        url: url,
        price: price,
        userId: req.userId,
      });
      res.status(201).json({ msg: 'Product Created Successfuly' });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};
export const updateProduct = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    let fileName = '';
    // Jika user hanya update title
    if (req.files === null) {
      fileName = product.image;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: 'Invalid Images' });
      if (fileSize > 5000000)
        return res.status(422).json({ msg: 'Image must be less than 5 MB' });

      const filepath = `./public/images/${product.image}`;
      fs.unlinkSync(filepath);

      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) return res.status(500).json({ msg: err.message });
      });
    }
    const name = req.body.name;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;

    if (req.role === 'admin') {
      await Products.update(
        { name: name, image: fileName, url: url },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (product.userId !== req.userId)
        return res.status(403).json({ msg: 'Access Forbidden' });
      await Products.update(
        { name: name, image: fileName, url: url },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: 'Procuct Updated!' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const deleteProduct = (req, res) => {};
