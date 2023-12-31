// Mount dependencies for client application
var grpc = require("@grpc/grpc-js");
var protLoader = require("@grpc/proto-loader");

var CART_PROTO_PATH = __dirname + "/protos/cart.proto";
var cartPackageDefinition = protLoader.loadSync(CART_PROTO_PATH);
var cart_proto = grpc.loadPackageDefinition(cartPackageDefinition).cart;

var USER_PROTO_PATH = __dirname + "/protos/user.proto";
var userPackageDefinition = protLoader.loadSync(USER_PROTO_PATH);
var user_proto = grpc.loadPackageDefinition(userPackageDefinition).user;


//import services
var user = require("./service/user");
var cart = require("./service/cart");

//Define and launch server and services
var server = new grpc.Server();

server.addService(user_proto.UserService.service, {
  login: user.login,
  getUser: user.getUser,
  myLocation: user.myLocation,
});

server.addService(cart_proto.CartService.service, {
  createCart: cart.createCart,
  addItem: cart.addItem,
  getCart: cart.getCart,
});

server.bindAsync(
  "0.0.0.0:4000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    server.start();
  }
);
