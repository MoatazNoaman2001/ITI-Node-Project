import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { transporter, mailSchema } from './utils/smtp.js';

import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;

const MONGO_URI = 'mongodb://localhost:27017/node_project';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    // transporter.sendMail(mailSchema(process.env.EMAIL_USER, 'DB Conneted, ITI-Node-Porject', 'Database Connected successfuly for ITI-Node-Porject')
    // , (err, info)=>{
    //   if (err) {
    //     console.error('Error sending email:', err);
    //   } else {
    //     console.log('Email sent successfully:', info.response);
    //   }
    // })
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});