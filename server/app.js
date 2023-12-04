var grpc = require("@grpc/grpc-js");
var protLoader = require("@grpc/proto-loader");

var CART_PROTO_PATH = __dirname + "../../protos/cart.proto";
var cartPackageDefinition = protLoader.loadSync(CART_PROTO_PATH);
var cart_proto = grpc.loadPackageDefinition(cartPackageDefinition).cart;

var CHECKOUT_PROTO_PATH = __dirname + "../../protos/checkout.proto";
var checkoutPackageDefinition = protLoader.loadSync(CHECKOUT_PROTO_PATH);
var checkout_proto = grpc.loadPackageDefinition(
  checkoutPackageDefinition
).checkout;

var USER_PROTO_PATH = __dirname + "../../protos/user.proto";
var userPackageDefinition = protLoader.loadSync(USER_PROTO_PATH);
var user_proto = grpc.loadPackageDefinition(userPackageDefinition).user;

function login(call, callback) {
  try {
    var userId = call.request.userId;
    console.log(userId);
    if (userId != null) {
      var result = "Welcome, " + userId;
      callback(null, {
        message: undefined,
        result: result,
      });
    } else {
      callback(null, {
        message:
          "Please enter a valid userId or visit www.smart-retail.com/register",
      });
    }
  } catch (e) {
    callback(null, {
      message: "An error occured during computation",
    });
  }
}

function getUser(call, callback) {
  try {
    var userId = parseString(call.request.user);
    if (userId != null) {
      var result = "We have found your profile, " + userId;
      callback(null, {
        message: undefined,
        result: result,
      });
    } else {
      callback(null, {
        message:
          "Please enter a valid userId or visit www.smart-retail.com/register",
      });
    }
  } catch (e) {
    callback(null, {
      message: "An error occured during computation",
    });
  }
}

var server = new grpc.Server();

server.addService(user_proto.UserService.service, {
  login: login,
  getUser: getUser,
});

/*
server.addService(cart_proto.CartService.service, {
  createCart: createCart,
  addItem: addItem,
  removeItem: removeItem,
  getCart: getCart,
});

server.addService(checkout_proto.CheckoutService.service, {
  checkoutRequest: checkoutRequest,
});
*/

server.bindAsync(
  "0.0.0.0:4000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    server.start();
  }
);
