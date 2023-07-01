import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import cloudinary from './utils/cloudinary.js';
import blogsRouter from './routes/productsRouter.js';
import ProductRoute from "./controllers/productController.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || '5000';
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//routes
app.use("/Products", ProductRoute);
app.get('/', (req, res) => {
  res.send('Health check passed!');
});

// Set up Multer
//const upload = multer({ dest: 'uploads/' });

// const storage = multer.diskStorage({
//   destination: function (req, res, cb) {
//       cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//       cb(null, new Date().getTime().toString() + "_" + file.originalname);
//   }
// })

// const fileFiler = (req, file, cb) => {
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       // accept
//       cb(null, true)
//   } else {
//       // reject
//       cb(new Error('message : file not acceptable'), false)
//   }
// }
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 },
//   fileFilter: fileFiler
// });

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.listen(PORT, () =>
  console.log(`Server is up and running on https://localhost:${PORT}`)
);
