import express from 'express';
import mongoose from 'mongoose';
import title from 'process';
import Products from '../models/productModel.js';
const Router = express.Router();
import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';
// import upload from '../utils/multer.js';

// insert a product
// Router.post(
//   '/addProducts',
//   upload.array('image'),
//   async (req, res) => {
//     console.log(req.body, 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
//     try {
//       // Upload image to cloudinary
//       const { productName, SKU, qty, description } = req.body;
//       const productImages = [];
//       const result = await cloudinary.uploader.upload(req.body.productImages);
//       console.log(result, 'nnnnnnnnnnnnnnn');
//       let newProducts = new Products({
//         productName: req.body.productName,
//         SKU: req.body.SKU,
//         qty: req.body.qty,
//         description: req.body.description,
//         productImages: result.secure_url,
//         cloudinary_id: result.public_id,
//       });
//       console.log(newProducts, 'insert details');
//       await newProducts.save();
//       res.send('Products uploaded suceesfully.');
//     } catch (error) {
//       res.status(400).send('Error while uploading details. Try again later.');
//     }
//   },
//   (error, req, res, next) => {
//     if (error) {
//       res.status(500).send(error.message);
//     }
//   }
// );

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + Date().now);
  },
});

// Set up Multer
const upload = multer({ storage });

Router.post('/addProducts', upload.array('productImages', 5), (req, res) => {
  const { productName, SKU, qty, description, productImages } = req.body;
  const productImagesArray = [];
  console.log(productName, SKU, qty, description, productImages);
  console.log(req.body.productImages, 'filesssssssss');

  // Upload each image to Cloudinary and store the URLs
  req.body.productImages.forEach((file) => {
    cloudinary.uploader.upload(file.path, (error, result) => {
      if (error) {
        console.log('Error uploading image to Cloudinary:', error);
      } else {
        productImagesArray.push(result.secure_url);
        if (productImagesArray.length === file.length) {
          // All images uploaded, save the product details in MongoDB
          const product = new Products({
            productName,
            SKU,
            qty,
            description,
            productImagesArray,
          });

          product.save((err, savedProduct) => {
            if (err) {
              console.log('Error saving product:', err);
              res.status(500).json({ error: 'Failed to save product' });
            } else {
              res.status(201).json({ message: 'Product saved successfully' });
            }
          });
        }
      }
    });
  });
});

//get all the blogs in the db
// export const getAllBlogs = async (req, res) => {
//   try {
//     const AllBlogs = await Products.find();
//     res.status(200).json(AllBlogs);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

//get one blog by blog id
// export const getBlogsById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const blogs = await Products.findById(id);
//     res.status(200).json(blogs);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

//get all blogs by blog myProp
// export const getBlogsByUser = async (req, res) => {
//   const { myProp } = req.params;

//   try {
//     const blogs = await Products.find({ email: myProp });
//     res.status(200).json(blogs);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

//delete blogs by id
// export const removeBlogById = async (req, res) => {
//   const { blogId } = req.params;

//   let data = await Products.findByIdAndRemove(blogId);

//   res.json({ data: data, msg: 'delete success' });
// };

//update blog data by id
// export const updateBlogsById = async (req, res) => {
//   const { id } = req.params;
//   const { title, subDescription, description, url } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id))
//     return res.status(404).send(`No accept with id: ${id}`);

//   const updatedTopic = {
//     title: title,
//     subDescription: subDescription,
//     description: description,
//     url: url,
//     _id: id,
//   };

//   await Products.findByIdAndUpdate(id, updatedTopic, { new: true });

//   res.json(updatedTopic);
// };
export default Router;
