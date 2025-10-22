const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const statsByDateRouter = require('./routes/statsByDate');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// Debug middleware (ẩn thông tin nhạy cảm)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Method: ${req.method}, Body:`, req.body);
    next();
  });
}

// Routes
app.use('/', require('./routes/auth'));
app.use('/thongke/ngay', statsByDateRouter);

app.use('/thongke/thang', require('./routes/statsByMonth'));
app.use('/thongke/nam', require('./routes/statsByYear'));


app.use('/thongke', require('./routes/dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started at http://10.0.0.26:${PORT}`));

app.get('/', (req, res) => {
  res.redirect('/login');
});