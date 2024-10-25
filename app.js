require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();
const path = require('path')
// EJS View Engine
app.set('view engine', 'ejs');
app.use(expressLayouts);

const staticpath = path.join(__dirname, "./public");
app.use(express.static(staticpath));


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.log('MongoDB Connection Error: ', err));

  // Passport Config
require('./config/passport')(passport);

// Bodyparser Middleware
app.use(express.urlencoded({ extended: true }));


// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

// Add this middleware before your routes
app.use((req, res, next) => {
    res.locals.user = req.user || null;  // Make 'user' available globally
    next();
});
  

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
