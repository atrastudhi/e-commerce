var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
require('dotenv').config();

var mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/ecommerce-${process.env.NODE_ENV}`);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to database...');
});

var usersRouter = require('./routes/users');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const transactionRoute = require('./routes/transaction')

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use('/users', usersRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/transaction', transactionRoute);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'not found'
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
