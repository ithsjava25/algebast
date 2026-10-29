const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const pool = require("./config/connectionMySQL");

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET saknas i .env");
}

const app = express();
const port = 3000;

const sessionStore = new MySQLStore({}, pool);

// Parse JSON bodies
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static("public"));

app.use(
  session({
    name: "algebast.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

app.use("/api/exams", require("./routes/exams"));
app.use("/api/questions", require("./routes/questions"));
app.use("/api/users", require("./routes/users"));
app.use("/api/badges" , require("./routes/badges"))

sessionStore
  .onReady()
  .then(() => {
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`),
    );
  })
  .catch((err) => {
    console.error("Kunde inte initiera sessionslagringen:", err);
    process.exit(1);
  });
