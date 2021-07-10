const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mysql = require("mysql");
const authRoutes = require("./routes/auth");
const movieWishlistRoutes = require("./routes/movieWishlist");

dotenv.config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
connection.connect();

var sessionStore = new MySQLStore({
  expiration: 10800000,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, connection);

app.set("views", "views");
app.set("view engine", "ejs");
app.set("db", connection);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: "shhhhh",
  saveUninitialized: true,
  resave: true,
  store: sessionStore,
  cookie: {
    secure: false,
    maxAge: 36000000,
    httpOnly: false,
  },
}));
app.use(express.static("public"));
app.use("/", authRoutes);
app.use("/", movieWishlistRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Serving at port ${PORT}`);
});