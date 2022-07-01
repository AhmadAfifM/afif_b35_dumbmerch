const { user, profile } = require("../../models");

exports.addProfile = async (req, res) => {
  try {
    const data = await profile.create({
      ...req.body,
      image_profile: req.file.filename,
    });

    res.send({
      status: "Success!",
      message: "Add Profile Success!",
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

exports.getProfiles = async (req, res) => {
  try {
    let data = await profile.findAll(req.body, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = data.map((item) => {
      item.image_profile =
        "http://localhost:5006/uploads/" + item.image_profile;
      return item;
    });

    res.send({
      status: "Success!",
      message: `Get Profile Success!`,
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

exports.getProfile = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await profile.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!data) {
      return res.send({
        status: "Failed!",
        message: `Profile with id: ${id} not found!`,
      });
    }

    res.send({
      status: "Success!",
      message: `Get Profile with id: ${id} Success!`,
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

exports.updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    let data = await profile.findOne({
      where: { id: id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!data) {
      res.send({
        status: "Failed!",
        message: `Get Profile with id: ${id} not found!`,
      });
    }

    await profile.update(newData, { where: { id: id } });

    data = await profile.findOne({
      where: { id: id },
    });

    res.send({
      status: "Success!",
      message: `Get Profile with id: ${id} Success!`,
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

exports.deleteProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await profile.findOne({
      where: { id },
    });

    if (!data) {
      res.send({
        status: "Failed!",
        message: `Get Profile with id: ${id} not found!`,
      });
    }

    await profile.destroy({ where: { id: id } });

    res.send({
      status: "Success!",
      message: `Delete Profile with id: ${id} Success!`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error",
    });
  }
};
