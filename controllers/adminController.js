const adminModal = require("../models/adminModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");

const adminPageLoad = async (req, res) => {
  try {
    console.log("Log in with admin credentials");
    res.render("adminLogin.ejs");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyAdmin = async (req, res) => {
  try {
    const adminData = await adminModal.findOne({ email: req.body.email });
    if (adminData.email == req.body.email) {
      console.log("welcome admin");
      res.render("adminDashboard.ejs");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddproduct = async (req, res) => {
  try {
    const catDoc = await Category.find({});
    console.log(catDoc);
    res.render("./products/addproducts.ejs", { category: catDoc });
  } catch (error) {
    console.log("error at loading add products page");
    console.log(error.message);
  }
};

const insertProductDb = async (req, res) => {
  try {
    console.log("this is insertProductDb");
    const imagesPaths = req.files.map((i) => i.filename);
    console.log(imagesPaths);
    console.log(req.files);
    console.log("files..........");
    const date = new Date();
    const createdDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    const product = new Product({
      productName: req.body.productname,
      price: Number(req.body.price),
      cost: Number(req.body.cost),
      color: req.body.color,
      description: req.body.description,
      isProductBlocked: req.body.isblocked,
      quantity: req.body.quantity,
      categoryId: req.body.category,
      isCategoryBlocked: false,
      createdDate: "",
      image: imagesPaths,
    });
    const productData = await product.save();
    console.log(productData);
    console.log(`${productData.productName} is succesfully added..`);
  } catch (error) {
    console.log(`error at inserting product`);
    console.log(error.message);
  }
};

const loadAddCategory = async (req, res) => {
  try {
    res.render("./category/addcategory.ejs");
  } catch (error) {
    console.log(error.message);
  }
};

const insertCategoryDb = async (req, res) => {
  try {
    const category = new Category({
      categoryName: req.body.categoryname,
      description: req.body.description,
      isBlocked: req.body.isBlocked,
    });
    const categoryData = await category.save();
  } catch (error) {
    console.log(`error at adding category`);
    console.log(error.message);
  }
};

const loadProductsDashboard = async (req, res) => {
  try {
    const productDoc = await Product.find({}).populate("categoryId");
    console.log(productDoc);
    res.render("./products/productDAshboard.ejs", { products: productDoc });
  } catch (error) {
    console.log("error at loading add products page");
    console.log(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productForDeletion = req.params.id;
    console.log(Product.findOne({ _id: productForDeletion }));
    await Product.deleteOne({ _id: productForDeletion });
    console.log("product has been deleted");
    res.redirect("/admin/productdashboard");
  } catch (error) {
    console.log("error at deleting product");
    console.log(error.message);
  }
};

const editProduct = async (req, res) => {
  try {
    const productEditId = req.params.id;
    const productData = await Product.findOne({ _id: productEditId });
    res.render("./products/editproducts.ejs", { product: productData });
  } catch (error) {
    console.log("error at loading edit page");
    console.log(error.message);
  }
};

const editUpdateDb = async (req, res) => {
  try {
    const UpdateProductId = req.params.id;
    const productDb = await Product.findOne({ _id: UpdateProductId });
    const productData = await Product.findByIdAndUpdate(
      { _id: UpdateProductId },
      {
        $set: {
          productName: req.body.name ?? productDb.productName,
          price: req.body.price ?? productDb.price,
          cost: req.body.cost ?? productDb.cost,
          color: req.body.color ?? productDb.color,
          description: req.body.description ?? productDb.description,
          isBlocked: req.body.isBlocked ?? productDb.isBlocked,
          quantity: req.body.quantity ?? productDb.quantity,
        },
      }
    );
    console.log("updation succesful");
    res.redirect("/admin");
  } catch (error) {
    console.log("error at updating editing db");
    console.log(error.message);
  }
};

const loadUserDashboard = async (req, res) => {
  try {
    userData = await User.find({});
    res.render("./users/userdashboard.ejs", { user: userData });
  } catch (error) {
    console.log("error at loading user dashboard");
    console.log(error.message);
  }
};

const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { isBlocked: true } }
    );
    console.log(`${userData.name} has been succesfully blocked`);
    res.redirect("/admin/userdashboard");
  } catch (error) {
    console.log("error at blocking user");
    console.log(error.message);
  }
};
const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { isBlocked: false } }
    );
    console.log(`${userData.name} has been succesfully unblocked`);
    res.redirect("/admin/userdashboard");
  } catch (error) {
    console.log("error at unblocking user");
    console.log(error.message);
  }
};

const loadCategory = async (req, res) => {
  try {
    const categoryData = await Category.find({});
    res.render("./category/categorydashboard.ejs", categoryData);
  } catch (error) {}
};
module.exports = {
  adminPageLoad,
  verifyAdmin,
  loadAddproduct,
  insertProductDb,
  loadAddCategory,
  insertCategoryDb,
  loadProductsDashboard,
  deleteProduct,
  editProduct,
  editUpdateDb,
  loadUserDashboard,
  blockUser,
  unblockUser,
};
