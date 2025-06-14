const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/config");
const connectDatabase = require("./database");
const cors = require("cors");
const passport = require("passport");

const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");

connectDatabase();

require("./middleware/authorizationMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: false}));

//set up system routes
app.use("/v1", userRoute)
app.use("/v1/posts", postRoute);
// system routes end --

app.get("/", (req, res) => {
    res.send("Welcome to My BlogApi Service");
});

app.use((err, req, res, next) => {
    console.error(err);
    const errStatus = err.status || 500
    res.status(errStatus).send(
        {
            status: false,
            message: err.message
        }
    )
    next()
});

app.listen(config.PORT, () => {
    console.log("Server is running on port: " + config.PORT);
});

module.exports = app;
