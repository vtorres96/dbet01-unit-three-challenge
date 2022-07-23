const express = require('express');
require('dotenv').config();

const usersRoutes = require('./routes/users');
const authenticationRoutes = require('./routes/authentication');
const categoriesRoutes = require('./routes/categories');
const transactionsRoutes = require('./routes/transactions');

const app = express();

app.use(express.json());
app.use('/usuario', usersRoutes);
app.use('/login', authenticationRoutes);
app.use('/categoria', categoriesRoutes);
app.use('/transacao', transactionsRoutes);

app.listen(process.env.PORT);