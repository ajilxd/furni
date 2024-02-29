const express = require("express");
const adminRoute = express();
const multer = require("../middleware/multer");
adminRoute.set("views", "./views/admin");
adminRoute.use("/node_modules", express.static("./node_modules"));
const adminController = require("../controllers/adminController");
adminRoute.get("/", adminController.adminPageLoad);
adminRoute.post("/", adminController.verifyAdmin);
adminRoute.get("/categorydashboard", adminController.loadProductsDashboard);
adminRoute.get("/addcategory", adminController.loadAddCategory);
adminRoute.post("/addcategory", adminController.insertCategoryDb);
adminRoute.get("/productdashboard", adminController.loadProductsDashboard);
adminRoute.get("/addproduct", adminController.loadAddproduct);
adminRoute.post(
  "/addproduct",
  upload.array("files", 5),
  adminController.insertProductDb
);
adminRoute.get("/editproduct/:id", adminController.editProduct);
adminRoute.post("/editproduct/:id", adminController.editUpdateDb);
adminRoute.get("/deleteproduct/:id", adminController.deleteProduct);
adminRoute.get("/userdashboard", adminController.loadUserDashboard);
adminRoute.get("/blockuser/:id", adminController.blockUser);
adminRoute.get("/unblockuser/:id", adminController.unblockUser);
module.exports = adminRoute;
