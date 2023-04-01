const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config/config.env" });
//connect to DB
connectDB();
//Route file
const hospitals = require(`./routes/hospitals`);
const auth = require("./routes/auth");
const appointments = require("./routes/appointments");

const app = express();

// app.get('/',(req,res)=>{
//     // res.send('<h1>Hello from express</h1>');
//     //res.send({name:'Brad});
//     //res.json({name:'Brad});
//     //res.sendStatus(400);
//     // res.sendStatus(400).json({success:false});
//     res.status(200).json({success:true,data:{id:1}});
// });

app.use(express.json());
//Mount  router
app.use(`/api/v1/hospitals`, hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);
app.use(cookieParser());
const PORT = process.env.PORT;
const server = app.listen(
  PORT,
  console.log(
    "Server running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
