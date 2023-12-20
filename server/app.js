
var grpc = require("@grpc/grpc-js");
var protLoader = require("@grpc/proto-loader");

var CART_PROTO_PATH = __dirname + "../../protos/cart.proto";
var cartPackageDefinition = protLoader.loadSync(CART_PROTO_PATH);
var cart_proto = grpc.loadPackageDefinition(cartPackageDefinition).cart;

// var CHECKOUT_PROTO_PATH = __dirname + "../../protos/checkout.proto";
// var checkoutPackageDefinition = protLoader.loadSync(CHECKOUT_PROTO_PATH);
// var checkout_proto = grpc.loadPackageDefinition(
//   checkoutPackageDefinition
// ).checkout;

var USER_PROTO_PATH = __dirname + "../../protos/user.proto";
var userPackageDefinition = protLoader.loadSync(USER_PROTO_PATH);
var user_proto = grpc.loadPackageDefinition(userPackageDefinition).user;


//****UserService members and functions****

var users = []; // Set-up user data array globally
var activeCartId = 0; //counter starts at zero and will be incremented for every new login call

//validation for userId
function validUserId(userId) {
  userId != 0 && userId.toString().length == 4; 
}
//function to find user
function findUser(userId) {
  users.find((x) => x.id === userId);
}
// function to add a user to the users object array
function setUser(userId, name, activeCartId) {
  users.push({ id: userId, name: name, activeCartId: activeCartId, aisle:1, shelf:1 });
  var thisUser = users.find((x) => x.id === userId)
  console.log(thisUser)
}

//function to update users location in the store from client call
function updateLocation(userId, aisle, shelf) {
  //Find index of specific object using findIndex method.    
  var userIndex = users.findIndex((obj => obj.id === userId));

  //Log object to Console.
  console.log("Before update: ", users[userIndex])

  //Update object's name property.
  users[userIndex].aisle = aisle;
  users[userIndex].shelf = shelf;

  //Log object to console again.
  console.log("After update: ", users[userIndex])
}

function login(call, callback) {
  try {
    var userId = parseInt(call.request.userId);
    var name = call.request.name;
    var validUser = userId != 0 && userId.toString().length == 4;
    var result;
    var activeUser;
    if (validUser && name != null) {
      console.log("valid user")
      var findUser = users.find((x) => x.id === userId);
      if (!findUser) {
        activeCartId++;
        setUser(userId, name, activeCartId);
        activeUser = users.find((x) => x.id === userId);
        console.log(userId + ": " + name + " just logged in!");
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
      console.log("invalid user")
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
    var userId = parseInt(call.request.userId);
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
    var userId = parseInt(call.request.userId);
    var aisle = parseInt(call.request.aisle);
    var shelf = parseInt(call.request.shelf);
    console.log("Updated location is aisle #"+aisle+", shelf #"+shelf);
    var thisUser = users.find((x) => x.id === userId);
    if (userId != null && thisUser != null) {
      updateLocation(userId,aisle,shelf);
      updatedUser = users.find((x) => x.id === userId);
      var result = "Your location is aisle #" + updatedUser.aisle + ", shelf #" + updatedUser.shelf;
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



// ****CartService functions****

var carts = [];

// utility function to add a new cart to the carts object array
function newCart(cartId, userId) {
  carts.push({ cartId:cartId,userid: userId,totalItems:0,totalCost:0.00 });
  var thisCart = carts.find((x) => x.cartId === cartId)
  console.log(thisCart)
}
// call function for creating a new shopping cart object
function createCart(call, callback) {
  try {
    var userId = parseInt(call.request.userId);
    var validUser = userId != 0 && userId.toString().length == 4;
    var result;
    if (validUser) {
      console.log("valid user")
      var findUser = users.find((x) => x.id === userId);
      if (findUser) {
        var cartExists = carts.find((x) => x.cartId === findUser.activeCartId);
        if(!cartExists){
          newCart(findUser.activeCartId, findUser.id);
          var thisCart = carts.find((x) => x.cartId === findUser.activeCartId)
          result = "Thanks, " + findUser.name + " - Your cart (ref #"+ thisCart.cartId + ") is now set up!";
        }
        else{
          var thisCart = carts.find((x) => x.cartId === findUser.activeCartId)
          result = "You already have an active cart (ref #" + thisCart.cartId + ")";
        } 
      } else {
        result = "Please try logging in again :)";
      }
      callback(null, {
        message: undefined,
        result: result,
      });
    } else {
      console.log("invalid user")
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

// utility function to add an item's cost/count to an existing cart object to the carts array
function addToCart(cartId, cost) {
  var cartIndex = carts.findIndex((x) => x.cartId === cartId)

  console.log("Before update: ", carts[cartIndex])

  carts[cartIndex].totalItems ++;
  carts[cartIndex].totalCost += cost;

  console.log("After update: ", carts[cartIndex])

}

// call function for creating a new shopping cart object
function addItem(call, callback) {
  try {
    console.log("addItem");
    var cartId = parseInt(call.request.cartId);
    //console.log(cartId);
    var item = call.request.item;
    //console.log(item);
    var cost = parseFloat(call.request.cost);
    //console.log(cost);
    var validCart = cartId != 0;
    //console.log(validCart);
    var result;

    if (validCart) {
      console.log("valid cart")
        var cartExists = carts.find((x) => x.cartId === cartId);
        if(!cartExists){
          result = "Please create a cart before attempting to add items";
        }
        else{
          addToCart(cartId,cost);
          result = item + " has been added to your cart";
        } 
      } else {
        result = "Please input a valid cart Id (number)";
      }
      callback(null, {
        message: undefined,
        result: result,
      });
  } 
  catch (e) {
    callback(null, {
      message: "An error occured during computation",
    });
  }
}


//retrieve existing shopping cart
function getCart(call, callback) {
  try {
    var cartId = parseInt(call.request.cartId);
    var findCart = carts.find((x) => x.cartId === cartId);
    if (findCart) {
      var result =
        "I have found your cart. You are using cart id: " +
        findCart.cartId + ". The total number of items is " + findCart.totalItems + ". The total cost of your cart is €" + parseFloat(findCart.totalCost) + ".";
      callback(null, {
        message: undefined,
        result: result,
      });
    } else {
      callback(null, {
        message: undefined,
        result:
          "Please enter a valid cartId or create one",
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
  createCart: createCart,
  addItem: addItem,
  //removeItem: removeItem,
  getCart: getCart,
});

server.bindAsync(
  "0.0.0.0:4000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    server.start();
  }
);
