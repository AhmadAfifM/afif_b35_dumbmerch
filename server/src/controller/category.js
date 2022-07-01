const { products, category, category_product } = require("../../models");

// Add Category
exports.addCategory = async (req, res) => {
  try {
    const data = await category.create(req.body);

    res.send({
      status: "Success!",
      message: "Add Category Success!",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Sever Error",
    });
  }
};

// Get All Category
exports.getCategories = async (req, res) => {
  try {
    const data = await category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success!",
      message: "Get All Category Success!",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Sever Error",
    });
  }
};

// Get Category Detail
exports.getCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await category.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!data) {
      res.send({
        status: "Failed!",
        message: `Category with id: ${id} not found!`,
      });
    } else {
      res.send({
        status: "Success!",
        message: "Get Category Detail Success!",
        data,
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Sever Error",
    });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;
    let data = await category.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!data) {
      return res.send({
        status: "Failed!",
        message: `Cetagory with id: ${id} not found!`,
      });
    }

    await category.update(newData, {
      where: { id: id },
    });

    data = await category.findOne({
      where: { id },
    });

    res.send({
      status: "Success!",
      message: `Update category with id: ${id} Success!`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Sever Error",
    });
  }
};

// Get Category Detail
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await category.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!data) {
      return res.send({
        status: "Failed!",
        message: `Category with id: ${id} not found!`,
      });
    }

    await category.destroy({
      where: { id: id },
    });

    res.send({
      status: "Success!",
      message: `Delete category with id: ${id} success!`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Sever Error",
    });
  }
};
