const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

// Parse JSON bodies
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static("public"));

app.use("/api/exams", require("./routes/exams"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/users", require("./routes/users"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
