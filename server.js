const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const { expressjwt: expressJwt } = require('express-jwt');
const jwksRsa = require("jwks-rsa");
const checkJwt = expressJwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://js-simple-crud.jp.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'https://js-simple-crud.jp.auth0.com/api/v2/',
    issuer: `https://js-simple-crud.jp.auth0.com/`,
    algorithms: ['RS256']
});

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to js-simple-crud app." });
});

// app.use(checkJwt)
require("./app/routes/tutorial.routes")(app);
require("./app/routes/contact.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });
// for development
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });
