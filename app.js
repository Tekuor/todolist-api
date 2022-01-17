const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const categoryRouter = require("./routers/category");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT;
require("./db/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(userRouter);
app.use(taskRouter);
app.use(categoryRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
