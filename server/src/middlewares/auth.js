const jwt = require("jsonwebtoken");

const env = require("../../config/env");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ status: "failed!", message: "Access denied!" });
  }

  try {
    const verified = jwt.verify(token, env.TOKEN_KEY);
    //verified token
    console.log(req.user);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid token" });
  }
};
