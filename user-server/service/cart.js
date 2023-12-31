// ****CartService member variables and functions****

var userService = require("./user");
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
      var findUser = userService.users.find((x) => x.id === userId);
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

// function to create add a new item to an existing shopping cart
function addItem(call, callback) {
  try {
    var cartId = parseInt(call.request.cartId);
    var item = call.request.item;
    var cost = parseFloat(call.request.cost);
    var validCart = cartId != 0;
    var result;

    if (validCart) {
      console.log("valid cart found")
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

//function to retrieve existing shopping cart's details
function getCart(call, callback) {
  try {
    var cartId = parseInt(call.request.cartId);
    var findCart = carts.find((x) => x.cartId === cartId);
    if (findCart) {
      var result =
        "I have found your cart. You are using cart id: " +
        findCart.cartId + ". The total number of items is " + findCart.totalItems + ". The total cost of your cart is €" + parseFloat(findCart.totalCost).toFixed(2) + ".";
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

module.exports = {createCart, addItem, getCart, carts};