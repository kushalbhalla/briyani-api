//importing modules
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

//importing routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const offerRoutes = require("./routes/offer");
const paymentRoutes = require("./routes/payments");

const app = express();
const port = process.env.PORT || 3000;
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

//middleware
app.use(express.json());
app.use(cors());


//routes
app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/products/", productRoutes);
app.use("/api/carts/", cartRoutes);
app.use("/api/orders/", orderRoutes);
app.use("/api/offers/", offerRoutes);
app.use("/api/payments/", paymentRoutes);

// error handlig
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(
      'mongodb+srv://kushal:kushal@cluster0.cn3d6.mongodb.net/briyani?retryWrites=true&w=majority'
    )
    .then(result => {
        app.listen(port, () => {
            console.log("sever running");
        });
    })
    .catch( err => {
        console.log(err);
    });
