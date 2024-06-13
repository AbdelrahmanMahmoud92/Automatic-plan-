const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Users
app.use('/users', require('./src/routes/register'))
app.use('/users', require('./src/routes/login'))

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {console.log(`Server running on ${PORT} port.`)});;
}).catch((err) => {
    console.log(err);
});


