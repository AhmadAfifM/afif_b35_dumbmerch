const { product, user, category, productCategory } = require("../../models");

const { Op } = require("sequelize");

const env = require("../../config/env");

exports.getProducts = async (req, res) => {
  try {
    const { search, searchKey } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [];
      if (searchKey === "name") {
        where[Op.or].push({ name: { [Op.like]: `%${search}%` } });
      }
      if (searchKey === "sku") {
        const editedSku = search.split(" ");
        where[Op.or].push({ sku: { [Op.in]: editedSku } });
      }
    }

    let data = await product.findAll({
      where,
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return { ...item, image: env.PATH_FILE + item.image };
    });

    res.send({
      status: "Success!...",
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

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await product.findOne({
      where: {
        id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: env.PATH_FILE + data.image,
    };

    res.send({
      status: "Success!...",
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

exports.addProduct = async (req, res) => {
  try {
    let { categoryId } = req.body;

    if (categoryId) {
      categoryId = categoryId.split(",");
    }

    const data = {
      name: req.body.name,
      desc: req.body.desc,
      sku: req.body.sku,
      price: req.body.price,
      image: req.file.filename,
      qty: req.body.qty,
      idUser: req.user.id,
    };

    let newProduct = await product.create(data);

    if (categoryId) {
      const productCategoryData = categoryId.map((item) => {
        return { idProduct: newProduct.id, idCategory: parseInt(item) };
      });

      await productCategory.bulkCreate(productCategoryData);
    }

    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });
    productData = JSON.parse(JSON.stringify(productData));

    res.send({
      status: "Success!!",
      data: {
        ...productData,
        image: env.PATH_FILE + productData.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed!!",
      message: "Server Error!",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { categoryId } = req.body;
    categoryId = await categoryId.split(",");

    const data = {
      name: req?.body?.name,
      desc: req?.body?.desc,
      sku: req?.body?.sku,
      price: req?.body?.price,
      image: req?.file?.filename,
      qty: req?.body?.qty,
      idUser: req?.user?.id,
    };

    await productCategory.destroy({
      where: {
        idProduct: id,
      },
    });

    let productCategoryData = [];
    if (categoryId != 0 && categoryId[0] != "") {
      productCategoryData = categoryId.map((item) => {
        return { idProduct: parseInt(id), idCategory: parseInt(item) };
      });
    }

    if (productCategoryData.length != 0) {
      await productCategory.bulkCreate(productCategoryData);
    }

    await product.update(data, {
      where: {
        id,
      },
    });

    res.send({
      status: "Success!",
      data: {
        id,
        data,
        productCategoryData,
        image: req?.file?.filename,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!",
      message: "Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await product.destroy({
      where: {
        id,
      },
    });

    await productCategory.destroy({
      where: {
        idProduct: id,
      },
    });

    res.send({
      status: "Success!",
      message: `Delete product id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed!!",
      message: "Server Error",
    });
  }
};
