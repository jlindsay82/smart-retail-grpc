var express = require("express");
var router = express.Router();
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

/*
var CART_PROTO_PATH = __dirname + "../../protos/cart.proto";
var cartPackageDefinition = protoLoader.loadSync(CART_PROTO_PATH);
var cart_proto = grpc.loadPackageDefinition(cartPackageDefinition).cart;

var CHECKOUT_PROTO_PATH = __dirname + "../../protos/checkout.proto";
var checkoutPackageDefinition = protoLoader.loadSync(CHECKOUT_PROTO_PATH);
var checkout_proto = grpc.loadPackageDefinition(
  checkoutPackageDefinition
).checkout;
*/
var USER_PROTO_PATH = __dirname + "../../../protos/user.proto";
var userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH);
var user_proto = grpc.loadPackageDefinition(userPackageDefinition).user;

var user_client = new user_proto.UserService(
  "0.0.0.0:4000",
  grpc.credentials.createInsecure()
);

/* GET home page. */
router.get("/", function (req, res, next) {
  var userId = req.query.userId;
  var result;

  if (userId != null) {
    try {
      user_client.login({ userId: userId }, function (error, response) {
        try {
          res.render("index", {
            title: "Smart Retail",
            error: error,
            result: response.result,
          });
        } catch (error) {
          console.log(error);
          res.render("index", {
            title: "Smart Retail",
            error:
              "Service is not available at the moment please try again later",
            result: null,
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.render("index", {
        title: "Smart Retail",
        error: "Service is not available at the moment please try again later",
        result: null,
      });
    }
  } else {
    res.render("index", {
      title: "Smart Retail",
      error: null,
      result: result,
    });
  }
});

module.exports = router;
