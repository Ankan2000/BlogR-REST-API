require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const commentRoutes = require("./routes/comment");

mongoose
  .connect("mongodb://localhost:27017/blogr", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB CONNECTED!"))
  .catch((err) => console.error("DB connection failed!", err));

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", blogRoutes);
app.use("/api", commentRoutes);

//* custom error handler for all the requests
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status).json({
    error: true,
    msg: err.message,
    data: { ...err.inner, code: err.code },
  });
});

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(`CORS enabled server is running in port ${port}`)
);
