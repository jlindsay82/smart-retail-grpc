
//Component to provide user service functionality

var users = []; // Set-up user data array globally
var activeCartId = 0; //counter starts at zero and will be incremented for every new login call
var userId;

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
            "Please enter a valid userId (4 digits)",
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
            "Please enter a valid userId, or try logging in again.",
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
            "Please enter a valid userId, or try logging in again.",
        });
      }
    } catch (e) {
      callback(null, {
        message: undefined,
        result: "An error occured during computation",
      });
    }
  }