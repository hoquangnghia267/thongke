const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true, useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected')).catch(console.error);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// Routes
app.use('/', require('./routes/auth'));
// app.use('/dashboard', require('./routes/dashboard'));
app.use('/thongke', require('./routes/dashboard'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));

app.get('/', (req, res) => {
  res.redirect('/login');
});