//****UserService member variables and functions****

var users = []; // Initialise user data array
var activeCartId = 0; //counter starts at zero and will be incremented for every new login call

// utility function to find a user
function findUser(userId) {
  users.find((x) => x.id === userId);
}
// utility function to add a user to the users object array
function setUser(userId, name, activeCartId) {
  users.push({ id: userId, name: name, activeCartId: activeCartId, aisle:1, shelf:1 });
  var thisUser = users.find((x) => x.id === userId)
  console.log(thisUser)
}

//utility function to update users location in the store from client call
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

//function to log a valid user into a shopping session, storing their details
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

//function to retrieve existing user details
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

//function to set client/user's location and send back stored data to the client
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

module.exports = {login, getUser, myLocation, users};