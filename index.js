const express = require("express"); // ใช้งาน module express
const app = express(); // สร้างตัวแปร app เป็น instance ของ express
const path = require("path"); // เรียกใช้งาน path module
const createError = require("http-errors"); // เรียกใช้งาน http-errors module
const port = 3000; // port
//const url = "mongodb://localhost:27017"; // กำหนด url สำหรับ MongoDB Server
const url =
  "mongodb+srv://vercel-admin-user:mtclub0722246@cluster0.acycwyu.mongodb.net/?retryWrites=true&w=majority";
const dbName = "club"; // กำหนดชื่อฐานข้อมูลที่จะใช้งาน
const cors = require("cors"); // แก้ไขเรื่อง cors policy

const apiRouter = require("./controllers/api");
const mongoose = require("mongoose");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("view options", { delimiter: "?" });
// app.set('env','production')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use(passport.session());

// function authentication(req, res, next) {
//     var authheader = req.headers.authorization;
//     console.log(req.headers);

//     if (!authheader) {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         return next(err)
//     }

//     var auth = new Buffer.from(authheader.split(' ')[1],
//     'base64').toString().split(':');
//     var user = auth[0];
//     var pass = auth[1];

//     if (user == 'admin' && pass == 'password') {

//         // If Authorized user
//         next();
//     } else {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         return next(err);
//     }

// }

// app.use(authentication)
// เรียกใช้งาน controller/api
app.use("/api", apiRouter);

// ทำงานทุก request ที่เข้ามา
app.use(function (req, res, next) {
  var err = createError(404);
  next(err);
});

// ส่วนจัดการ error
app.use(function (err, req, res, next) {
  // กำหนด response local variables
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // กำหนด status และ render หน้า error page
  res.status(err.status || 500); // ถ้ามี status หรือถ้าไม่มีใช้เป็น 500
  //res.render("error");
  return res.json({ message: err.message });
});

mongoose.set("strictQuery", true);
mongoose.connect(`${url}/${dbName}`);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully", dbName);
});

app.listen(port, function () {
  console.log(`API listening on port ${port}!`);
});
module.exports = app;
