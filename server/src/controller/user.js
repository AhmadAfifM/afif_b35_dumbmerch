const { user, profile } = require("../../models");
exports.addUser = async (req, res) => {
  try {
    const data = await user.create(req.body);

    res.send({
      status: "Success!",
      message: `Add User ${req.body.name} Success!`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const data = await user.findAll({
      include: {
        model: profile,
        as: "profile",
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success!",
      message: "Get Users Success!",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await user.findOne({ where: { id: id } });

    if (data == null) {
      res.send({
        status: "Failed!",
        message: "Data Not Found!",
      });
    } else {
      res.send({
        status: "Success!",
        message: `Get User Id: ${id} Success!`,
        data,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await profile.findAll({
      include: {
        model: user,
        as: "user",
      },
    });

    if (data == null) {
      res.send({
        status: "Failed!",
        message: "Data Not Found!",
      });
    } else {
      res.send({
        status: "Success!",
        message: `Get User Id: ${id} Success!`,
        data,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    const data = await user.findOne({ where: { id } });

    if (!data) {
      return res.send({
        status: "Failed!",
        message: `User with id: ${id} not found!`,
      });
    }

    await user.update(newData, { where: { id: id } });

    res.send({
      status: "Success!",
      message: `Update User Id: ${id} Success!`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await user.findOne({ where: { id } });
    if (!data) {
      return res.send({
        status: "Failed!",
        message: `User with id: ${id} not found!`,
      });
    }
    await user.destroy({ where: { id: id } });

    res.send({
      status: "Success!",
      message: `Delete User Id: ${id} Success!`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error",
    });
  }
};
