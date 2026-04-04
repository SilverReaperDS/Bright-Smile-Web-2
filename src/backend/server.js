require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use('/api/dashboard', dashboardRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));