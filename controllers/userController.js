const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const Product = require("../models/productModel");
const Address = require("../models/addressModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

//loading login page
const loadLoginPage = async (req, res) => {
  try {
    console.log("Login page is loaded>>>>");
    res.render("login.ejs");
  } catch (error) {
    console.log("error at loadLoginPage 📛>>>>");
    console.log(error.message);
  }
};
//loading registration page
const loadSignupPage = async (req, res) => {
  try {
    console.log(req.body);
    console.log("Signup page is loaded>>>>");
    res.render("signup.ejs");
  } catch (error) {
    console.log("error at loadSignupPage 📛>>>>");
    console.log(error.message);
  }
};
//inserting users to
const insertUser = async (req, res, next) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      mobilenumber: req.body.mobilenumber,
      isVerified: false,
    });
    // checking session exists or not
    req.session ? console.log("session exists") : console.log("session error");

    req.session.userData = user;
    const userData = await user.save();
    console.log("this userDb");
    console.log(req.session.userData);

    next();
  } catch (error) {
    console.log("error at insertuser 📛>>>>");
    console.log(error.message);
  }
};

//verifying users

const verifyUser = async (req, res) => {
  try {
    const userData = await User.findOne(req.email);
    const productData = await Product.find({});
    console.log("User verfifcation went successfull");
    req.session.user = userData;
    console.log(req.session.user);
    if (req.body.password === userData.password) {
      res.render("home.ejs", { productData });
    } else {
      res.end("invalid");
    }
  } catch (error) {
    console.log("'error at verifyUser login  📛>>>>'");
    console.log(error);
  }
};

//signup validation
const signUpValidation = async (req, res, next) => {
  try {
    console.log(req.body);
    const inEmail = req.body.email;
    console.log("Sign-up validation loaded succesfully");

    const userData = await User.findOne({ email: inEmail });

    if (userData && userData.email) {
      console.log("Existing email account with input email");
      return res.render("signup.ejs", { message: "Email is already taken" });
    } else if (req.body.password.length < 8) {
      console.log("input password is small");
      return res.render("signup.ejs", { message: "Password is too short" });
    } else {
      console.log("Signup validation went succesfull....>>>>>");
      next();
    }
  } catch (error) {
    console.log("'error at signup Validation   📛>>>>'");
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
};

//load otp page
const verifyOtpLoad = async (req, res, next) => {
  try {
    console.log("otp page is loaded succesfully");
    res.render("verifyotp.ejs");
    //next();
  } catch (error) {
    console.log(error.message);
  }
};
//nodemailer
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const otpModal = require("../models/otpModel");
const userModal = require("../models/userModel");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.useremail,
    pass: process.env.password,
  },
});

const secret = speakeasy.generateSecret({ length: 20 });

//send otp
const otpGenerator = async (req, res, next) => {
  console.log("otp generated ");
  email = req.body.email;
  // checking input email for otp verification NotImp
  console.log("input email is " + email);
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });
  //checking req.session.userData._id NotImp
  // console.log(req.session.userData._id);

  console.log(`req body in otp generator`);
  console.log(req.body);
  const otpDB = new Otp({
    userId: req.session.userData._id,
    otp: otp,
  });
  console.log("Otp database is created");
  await otpDB.save();
  console.log(otpDB);
  console.log("otp from otpdb" + otpDB.otp);
  const mailOptions = {
    from: "ajilpramodone@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}`,
  };

  console.log(otp + "generated otp");
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error.message);

      return res.status(500).json({ error: "Failed to send OTP" });
    }
  });
  // if( )
  next();
};
//Verifying Otp
const verifyOtp = async (req, res, next) => {
  try {
    console.log("verify otp section----");
    console.log(Object.values(req.body).join(""));
    const userInputOtp = Object.values(req.body).join("");
    console.log(req.session);
    const otp = await otpModal.findOne({ userId: req.session.userData._id });
    const userData = await userModal.find({});
    // console.log(otp.otp);
    console.log(
      `otp verification of userinput otp & otp from otpDb : ${
        otp.otp == userInputOtp
      }`
    );
    if (otp.otp == userInputOtp) {
      console.log("sameuser");
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

const productLoader = async (req, res) => {
  try {
    const productid = req.params.id;
    const Productdata = await Product.findOne({ _id: productid });
    res.render("productpage.ejs", { Productdata });
  } catch (error) {
    console.log(error.message);
  }
};

const userProfileLoader = async (req, res) => {
  try {
    console.log("iam userProfiler");
    console.log(req.session.user);
    const userprofile = await User.findOne({ _id: req.session.user._id });
    console.log(userprofile);
    res.render("./user/userprofile.ejs", { userprofile });
  } catch (error) {
    console.log(error);
  }
};

const userAddressLoader = async (req, res) => {
  try {
    console.log("userddd");
    console.log(req.session.user);
    const userAddress = await Address.find({ userid: req.session?.user?._id });
    console.log(userAddress);
    res.render("./user/myaddress.ejs", { userAddress });
  } catch (error) {
    console.log(error.message);
  }
};

const userAddAddressLoader = async (req, res) => {
  try {
    console.log("hi iam add address");
    console.log(req.session.user);
    res.render("./user/addaddress.ejs");
  } catch (error) {
    console.log(error.message);
  }
};

const saveAddressDb = async (req, res) => {
  try {
    console.log(req.session.user);
    console.log(req.body);
    const userData = req.session.user;
    const address = new Address({
      typeofaddress: req.body.typeofaddress,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street,
      landmark: req.body.landmark,
      mobileno: userData.mobilenumber,
      name: userData.name,
      userid: userData._id,
      pincode: req.body.pincode,
    });
    await address.save();
    res.redirect("/address");
  } catch (error) {
    console.log(error.message);
  }
};

const cartLoader = async (req, res) => {
  try {
    const cartData = await Cart.find({ userId: req.session.user._id }).populate(
      "productId"
    );
    res.render("./user/cart.ejs", { cartData });
  } catch (error) {
    console.log(error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    console.log("hi");
    const cartData = await Cart.find({ userId: req.session.user._id });
    const productData = await Product.findOne({ _id: req.params.id });
    console.log(productData);
    if (true) {
      const Cartdb = new Cart({
        productId: req.params.id,
        userId: req.session.user._id,
        productname: productData.productName,
        quantity: 1,
        price: productData.price,
        productimage: productData._id,
        totals: productData.price,
      });
      console.log(Cartdb);
      await Cartdb.save();
    }
    console.log(req.params);
    console.log(req.session.user);
  } catch (error) {
    console.log(error.message);
  }
};

const checkOutLoader = async (req, res) => {
  try {
    const cartData = await Cart.find({ userId: req.session.user._id });
    const userData = await User.findOne({ _id: req.session.user._id });
    const addressData = await Address.find({ userid: req.session.user._id });
    res.render("./user/productcheckout.ejs", {
      cartData,
      addressData,
      userData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    await Cart.deleteOne({ _id: cartItemId });
    console.log("Product is removed from cart");
  } catch (error) {
    console.log(error.message);
  }
};

const userProfileAddressDelete = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await Address.deleteOne({ _id: id });
    res.redirect("/address");
  } catch (error) {
    console.log(error.message);
  }
};

const userProfileAddressEdit = async (req, res) => {
  try {
    const addressId = req.params.id;
    const addressDb = await Address.findOne({ _id: addressId });
    console.log("this is addressDb");
    console.log(addressDb);
    const editAddress = await Address.findByIdAndUpdate(
      { _id: addressId },
      {
        $set: {
          country: req.body.country || addressDb.country,
          state: req.body.state || addressDb.state,
          city: req.body.city || addressDb.city,
          street: req.body.street || addressDb.street,
          landmark: req.body.landmark || addressDb.landmark,
          pincode: req.body.pincode || addressDb.pincode,
          name: req.body.name || addressDb.name,
          mobileno: req.body.mobileno || addressDb.mobileno,
        },
      }
    );
    res.redirect("/address");
  } catch (error) {
    console.log(error.message);
  }
};

const changePasswordLoader = async (req, res) => {
  try {
    const userData = User.findOne({ _id: req.session.user._id });
    res.render("./user/changepassword.ejs", { userData });
  } catch (error) {
    console.log(error.message);
  }
};

const oldPasswordSender = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.session.user._id });
    const oldPass = userData.password;
    res.json(oldPass);
  } catch (error) {
    console.log(error.message);
  }
};

const changePasswordLoaderDb = async (req, res) => {
  try {
    console.log("form submitted");
    const userId = req.session.user._id;
    const newPassword = req.body.confirmpassword;
    const userData = await User.updateOne(
      { _id: userId },
      { $set: { password: newPassword } }
    );
    console.log(userData);
  } catch (error) {
    console.log(error.message);
  }
};

const quantityUpdate = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const cartId = req.body.cartItemId;
    const cartData = await Cart.findOne({ _id: cartId });
    const quantity = req.params.quantity;
    const totalsum = quantity * cartData.price;
    console.log("totalsum", totalsum);
    await Cart.updateOne(
      { _id: cartId },
      { $set: { quantity: quantity, totals: totalsum } }
    );
    const cartDat = await Cart.findOne({ _id: cartId });
    console.log(cartDat);
    const cartDocs = await Cart.find({});
    const sumOfAllProducts = cartDocs.reduce(
      (total, cart) => total + cart.totals,
      0
    );
    await User.updateOne(
      { _id: userId },
      { $set: { totalcart: sumOfAllProducts } }
    );
    res.json({ cartDat });
  } catch (error) {
    console.log(error.message);
  }
};

const checkoutAddress = async (req, res) => {
  try {
    console.log(req.body);
    const address = new Address({
      typeofaddress: req.body.typeofaddress,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      street: req.body.street,
      landmark: req.body.landmark,
      mobileno: req.body.mobilenumber,
      name: req.body.name,
      userid: req.session.user._id,
      pincode: req.body.pincode,
    });
    await address.save();
  } catch (error) {
    console.log(error.message);
  }
};

const placeOrder = async (req, res) => {
  try {
    console.log(req.body);
    const deliveryAddress = req.body.addressId;
    const paymentType = req.body.selectedPaymentMethod;
    const randomInteger = Math.floor(Math.random() * 10000000000);
    const cartData = await Cart.find({ userId: req.session.user._id });
    let totalAmount = 0;
    cartData.forEach((i) => (totalAmount += i.totals));
    console.log(totalAmount);
    const orderData = new Order({
      userId: req.session.user._id,
      deliveryAddress: deliveryAddress,
      payment: paymentType,
      orderId: randomInteger,
      orderAmount: totalAmount,
      orderedItems: [...cartData],
    });
    await orderData.save();
  } catch (error) {
    console.log(error.message);
  }
};

//exporting functions
module.exports = {
  otpGenerator,
  verifyOtpLoad,
  loadLoginPage,
  loadSignupPage,
  insertUser,
  verifyUser,
  signUpValidation,
  verifyOtp,
  productLoader,
  userProfileLoader,
  userAddressLoader,
  userAddAddressLoader,
  saveAddressDb,
  cartLoader,
  addToCart,
  checkOutLoader,
  removeFromCart,
  userProfileAddressDelete,
  userProfileAddressEdit,
  changePasswordLoader,
  changePasswordLoaderDb,
  oldPasswordSender,
  quantityUpdate,
  checkoutAddress,
  placeOrder,
};
