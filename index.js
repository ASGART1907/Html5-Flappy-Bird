const express = require("express");

const app = express();

app.use(express.static("FlappyBird"));

app.listen(8080 || process.env.PORT,() => {
    console.log("Server Success");
});