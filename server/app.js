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

//UserService members and functions
var users = []; // Set-up user data array globally
var activeCartId = 0; //counter starts at zero and will be incremented for every new login call
var userId;
//var aisle;
//var shelf;

function validUserId(userId) {
  userId != 0 && userId.toString().length == 4; //validation for userId
}
function findUser(userId) {
  users.find((x) => x.id === userId);
}
// function to add a user to the users object array
function setUser(userId, name, activeCartId) {
  users.push({ id: userId, name: name, activeCartId: activeCartId });
}

//function to initialise the user's location in the store
function setLocation(userId) {
  if (findUser(userId)) {
    users.push({ aisle: 1, shelf: 1 });
  }
}
//function to update users location in the store from client call
function updateLocation(userId, aisle, shelf) {
  var myUser = users.find((x) => x.id === userId);
  myUser.aisle === aisle;
  myUser.location === shelf;
}

function login(call, callback) {
  try {
    var userId = parseInt(call.request.userId);
    var name = call.request.name;
    var validUserId = userId != 0 && userId.toString().length == 4;
    var result;
    var activeUser;
    //var findUser = findUser(userId);
    console.log(userId + ": " + name + "just logged in!");
    if (validUserId && name != null) {
      var findUser = users.find((x) => x.id === userId);
      if (!findUser) {
        activeCartId++;
        console.log("Cart Id: " + activeCartId);
        setUser(userId, name, activeCartId);
        activeUser = users.find((x) => x.id === userId);
        result = "Welcome, " + activeUser.name + ": Please enter the store :)";
      } else {
        activeUser = users.find((x) => x.id === userId);
        result =
          activeUser.name +
          ": You are already logged in, please enter the store :)";
      }
      console.log(activeUser.id + ": " + activeUser.name); //reflect stored user login details

      callback(null, {
        message: undefined,
        result: result,
      });
    } else {
      callback(null, {
        result:
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
    userId = parseInt(call.request.userId);
    var findUser = users.find((x) => x.id === userId);
    if (userId != null && findUser) {
      var result =
        "I have found your profile, " +
        findUser.name +
        ". You are using cart id: " +
        findUser.activeCartId;
      callback(null, {
        message: undefined,
        result: result,
      });
    } else {
      callback(null, {
        message: undefined,
        result:
          "Please enter a valid userId or visit www.smart-retail.com/register",
      });
    }
  } catch (e) {
    callback(null, {
      message: undefined,
      result: "An error occured during computation",
    });
  }
}

function myLocation(call, callback) {
  try {
    userId = parseInt(call.request.userId);
    var aisle = parseInt(call.request.aisle);
    var shelf = parseInt(call.request.shelf);
    console.log(aisle);
    console.log(shelf);
    var findUser = users.find((x) => x.id === userId);
    if (userId != null && findUser) {
      var result = "Your location is aisle #" + aisle + ", shelf #" + shelf;
      callback(null, {
        message: undefined,
        result: result,
      });
    } else {
      callback(null, {
        message: undefined,
        result:
          "Please enter a valid userId or visit www.smart-retail.com/register",
      });
    }
  } catch (e) {
    callback(null, {
      message: undefined,
      result: "An error occured during computation",
    });
  }
}

// ****Cart functions*****
function getCart(call, callback) {
  try {
    var userId = parseInt(call.request.userId);
    var findUser = users.find((x) => x.id === userId);
    if (userId != null && findUser) {
      var result =
        "I have found your cart, " +
        findUser.name +
        ". You are using cart id: " +
        findUser.activeCartId;
      callback(null, {
        message: undefined,
        result: result,
      });
    } else {
      callback(null, {
        message: undefined,
        result:
          "Please enter a valid userId or visit www.smart-retail.com/register",
      });
    }
  } catch (e) {
    callback(null, {
      message: undefined,
      result: "An error occured during computation",
    });
  }
}

var server = new grpc.Server();

server.addService(user_proto.UserService.service, {
  login: login,
  getUser: getUser,
  myLocation: myLocation,
});

server.addService(cart_proto.CartService.service, {
  //createCart: createCart,
  //addItem: addItem,
  //removeItem: removeItem,
  getCart: getCart,
});
/*
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
