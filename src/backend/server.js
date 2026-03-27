const express = require('express');
const mongoose = require('mongoose');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use('/api/dashboard', dashboardRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));