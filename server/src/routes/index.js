const express = require("express");

const router = express.Router();

//controller in USER
const {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/user");

//controller in PROFILE
const {
  addProfile,
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controller/profile");

//controller in PRODUCT
const {
  getProducts,
  getProduct,
  updateProduct,
  addProduct,
  deleteProduct,
} = require("../controller/product");

//controller in TRANSACTION
const {
  getTransactions,
  addTransaction,
  notification,
} = require("../controller/transactions");

//controller in AUTH
const { register, login, checkAuth } = require("../controller/auth");

//Middleware Auth
const { auth } = require("../middlewares/auth");

//Middleware Auth
const { uploadFile } = require("../middlewares/uploadFile");

//Middleware
const {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category");

router.post("/user", auth, addUser);
router.get("/users", auth, getUsers);
router.get("/user/:id", auth, getUser);
router.patch("/user/:id", auth, updateUser);
router.delete("/user/:id", auth, deleteUser);

router.get("/products", auth, getProducts);
router.get("/product/:id", auth, getProduct);
router.patch("/product/:id", auth, uploadFile("image"), updateProduct);
router.post("/product", auth, uploadFile("image"), addProduct);
router.delete("/product/:id", auth, deleteProduct);
// router.get("/user-products", auth, getUserProduct);

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.post("/transaction", auth, addTransaction);
router.get("/transactions", auth, getTransactions);

router.post("/notification", notification);

router.post("/category", auth, addCategory);
router.get("/categories", auth, getCategories);
router.get("/category/:id", auth, getCategory);
router.patch("/category/:id", auth, updateCategory);
router.delete("/category/:id", auth, deleteCategory);

router.post("/profile", auth, addProfile);
router.get("/profiles", getProfiles);
router.get("/profile", auth, getProfile);
router.patch("/profile/:id", auth, updateProfile);
router.delete("/profile/:id", auth, deleteProfile);

module.exports = router;
