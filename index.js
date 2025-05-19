const express =  require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const { transporter, mailSchema } = require('./utils/smtp.js');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/product', require('./routes/productRoute'));
app.use('/api/cart', require('./routes/cartRoute'));
app.use('/api/order', require('./routes/orderRoute'));
app.use('/api/user', require('./routes/userRoute'));

const PORT = process.env.PORT || 5000;

const MONGO_URI = 'mongodb://localhost:27017/node_project';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    transporter.sendMail(mailSchema(process.env.EMAIL_USER, 'DB Conneted, ITI-Node-Porject', 'Database Connected successfuly for ITI-Node-Porject')
    , (err, info)=>{
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    })
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});