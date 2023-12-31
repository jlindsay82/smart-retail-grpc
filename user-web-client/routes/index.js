var express = require("express");
var router = express.Router();

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var CART_PROTO_PATH = __dirname + "../../protos/cart.proto";
var cartPackageDefinition = protoLoader.loadSync(CART_PROTO_PATH);
var cart_proto = grpc.loadPackageDefinition(cartPackageDefinition).cart;

var USER_PROTO_PATH = __dirname + "../../protos/user.proto";
var userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH);
var user_proto = grpc.loadPackageDefinition(userPackageDefinition).user;


var user_client = new user_proto.UserService(
  "0.0.0.0:4000",
  grpc.credentials.createInsecure()
);

var cart_client = new cart_proto.CartService(
   "0.0.0.0:4000",
   grpc.credentials.createInsecure()
 );

/* GET home page. */
router.get("/", function (req, res, next) {
  var userId = req.query.userId;
  var name = req.query.name;
  var result;

  if (!isNaN(userId) && name != null) {
    try {
      user_client.login(
        { userId: userId, name: name },
        function (error, response) {
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
        }
      );
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

/* User Page */
router.get("/user", function (req, res, next) {
  var userId = req.query.userId;
  var result;

  if (!isNaN(userId)) {
    try {
      user_client.getUser({ userId: userId }, function (error, response) {
        try {
          res.render("user", {
            title: "Your User Details",
            error: error,
            result: response.result,
          });
        } catch (error) {
          console.log(error);
          res.render("user", {
            title: "Your User Details",
            error:
              "Service is not available at the moment please try again later",
            result: null,
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.render("user", {
        title: "Your User Details",
        error: "Service is not available at the moment please try again later",
        result: null,
      });
    }
  } else {
    res.render("user", {
      title: "Your User Details",
      error: null,
      result: result,
    });
  }
});


/* Cart Page */
router.get("/cart", function (req, res, next) {
  var userId = req.query.userId;
  var result;
if (!isNaN(userId)) {
  try {
    cart_client.createCart({ userId: userId }, function (error, response) {
      try {
        res.render("cart", {
          title: "Your Shopping Cart",
          error: error,
          result: response.result,
        });
      } catch (error) {
        console.log(error);
        res.render("cart", {
          title: "Your Shopping Cart",
          error:
            "Service is not available at the moment please try again later",
          result: null,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.render("cart", {
      title: "Your Shopping Cart",
      error: "Service is not available at the moment please try again later",
      result: null,
    });
  }
} else {
  res.render("cart", {
    title: "Your Shopping Cart",
    error: null,
    result: result,
  });
}
});


router.get("/getCart", function (req, res, next) {
  var cartId = req.query.cartId;
  var result;
if (!isNaN(cartId)) {
  try {
    cart_client.getCart({ cartId: cartId}, function (error, response) {
      try {
        res.render("cart", {
          title: "Your Shopping Cart",
          error: error,
          result: response.result,
        });
      } catch (error) {
        console.log(error);
        res.render("cart", {
          title: "Your Shopping Cart",
          error:
            "Service is not available at the moment please try again later",
          result: null,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.render("cart", {
      title: "Your Shopping Cart",
      error: "Service is not available at the moment please try again later",
      result: null,
    });
  }
} else {
  res.render("cart", {
    title: "Your Shopping Cart",
    error: null,
    result: result,
  });
}
});


router.get("/addItem", function (req, res, next) {
  var cartId = req.query.cartId;
  var item = req.query.item;
  var cost = req.query.cost;
  var result;
if (!isNaN(cartId)) {
  try {
    cart_client.addItem({ cartId: cartId,item: item, cost: cost }, function (error, response) {
      try {
        res.render("cart", {
          title: "Your Shopping Cart",
          error: error,
          result: response.result,
        });
      } catch (error) {
        console.log(error);
        res.render("cart", {
          title: "Your Shopping Cart",
          error:
            "Service is not available at the moment please try again later",
          result: null,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.render("cart", {
      title: "Your Shopping Cart",
      error: "Service is not available at the moment please try again later",
      result: null,
    });
  }
} else {
  res.render("cart", {
    title: "Your Shopping Cart",
    error: null,
    result: result,
  });
}
});



/* Location Page */
router.get("/location", function (req, res, next) {
  var userId = req.query.userId;
  var aisle = Math.floor(Math.random() * 10) + 1;
  var shelf = Math.floor(Math.random() * 10) + 1;
  var result;

  if (!isNaN(userId)) {
    try {
      user_client.myLocation(
        { userId: userId, aisle: aisle, shelf: shelf },
        function (error, response) {
          try {
            res.render("location", {
              title: "Your Location",
              error: error,
              result: response.result,
            });
          } catch (error) {
            console.log(error);
            res.render("location", {
              title: "Your Location",
              error:
                "Service is not available at the moment please try again later",
              result: null,
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
      res.render("location", {
        title: "Your Location",
        error: "Service is not available at the moment please try again later",
        result: null,
      });
    }
  } else {
    res.render("location", {
      title: "Your Location",
      error: null,
      result: result,
    });
  }
});

module.exports = router;
