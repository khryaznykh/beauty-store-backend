const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./auth/userRouter');
const productRoutes = require('./products/routes');
const reviewsRoutes = require('./reviews/routes')

mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 8000; 

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Beauty Store API is running"
    });
});

app.use(authRoutes)
app.use(productRoutes)
app.use(reviewsRoutes)

mongoose
    .connect(process.env.MONGODB_LINK)
    .then(()=>console.log('We were connected to Mongo'))
    .catch(err => console.log(err))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});