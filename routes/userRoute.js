const express = require("express");
const user_route = express();
const path = require("path");
const cookie = require("cookie-parser");

const session = require("express-session");
const config = require("../config/config");

user_route.set("views", "./views");
user_route.use("/node_modules", express.static("./node_modules"));
const userController = require("../controllers/userController");

user_route.get("/", userController.loadLoginPage);
user_route.post("/", userController.verifyUser);
user_route.get("/signup", userController.loadSignupPage);
user_route.post(
  "/signup",
  userController.signUpValidation,
  userController.insertUser,
  userController.otpGenerator,
  userController.verifyOtpLoad
);
user_route.post(
  "/verifyotp",
  userController.verifyOtp,
  userController.loadLoginPage
);

user_route.get("/product/:id", userController.productLoader);

user_route.get("/userprofile", userController.userProfileLoader);
user_route.get("/address", userController.userAddressLoader);
user_route.get("/addaddress", userController.userAddAddressLoader);
user_route.post("/addaddress", userController.saveAddressDb);
user_route.get("/cart", userController.cartLoader);
user_route.get("/cart/remove/:id", userController.removeFromCart);
user_route.get("/addtocart/:id", userController.addToCart);
user_route.get("/checkout", userController.checkOutLoader);
user_route.get("/address/delete/:id", userController.userProfileAddressDelete);
user_route.post("/address/edit/:id", userController.userProfileAddressEdit);
user_route.get("/changepassword", userController.changePasswordLoader);
user_route.post("/changepassword", userController.changePasswordLoaderDb);
user_route.get("/oldpassword", userController.oldPasswordSender);

user_route.post(
  "/cart/quantitychange/:quantity",
  userController.quantityUpdate
);

user_route.post("/checkout/addaddress", userController.checkoutAddress);

user_route.post("/checkout", userController.placeOrder);
module.exports = user_route;
