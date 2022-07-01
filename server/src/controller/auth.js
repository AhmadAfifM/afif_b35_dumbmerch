const { user } = require("../../models");

const Joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const env = require("../../config/env");

exports.register = async (req, res) => {
  // Take name, email and password
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    re_password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    // FITUR RE-CHECK PASSWORD
    if (req.body.password != req.body.re_password) {
      return res.send({
        status: "Failed!",
        message: "Recheck Password Doesn't Match!",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      status: "customer",
    });

    const token = jwt.sign({ id: user.id }, env.TOKEN_KEY);

    res.status(200).send({
      status: "Success",
      message: `Resgister user ${req.body.name} success!`,
      data: {
        name: newUser.name,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error!",
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!userExist) {
      return res.status(404).send({
        status: "Failed",
        message: `Email: ${req.body.email} not found!`,
      });
    }

    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Credential is INVALID!",
      });
    }

    const token = jwt.sign({ id: userExist.id }, env.TOKEN_KEY);

    res.status(200).send({
      status: "Success!",
      message: `Register User ${userExist.name} SUCCESS!`,
      data: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        status: userExist.status,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed!",
      message: "Server Error!",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success...",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          status: dataUser.status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
