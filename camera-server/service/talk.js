<<<<<<< HEAD
//Initialise clients object array
var clients = {};

//function defines call response for each client found in clients array. If not found, data is added to clients array
=======
//Initialise variables
var clients = {};

>>>>>>> 2956c286ad78fa527f139d32f2699c87995d4d6e
function cameraTalk(call) {
  call.on("data", function (camera_message) {
    if (!(camera_message.id in clients)) {
      clients[camera_message.id] = {
        id: camera_message.id,
        call: call,
      };
    }

    for (var client in clients) {
      clients[client].call.write({
        id: camera_message.id,
        status: camera_message.status,
        location: camera_message.location,
        detectedShoppers: camera_message.detectedShoppers,
      });
    }
  });

  call.on("end", function () {
    call.end();
  });

  call.on("error", function (e) {
    console.log(e);
  });
}

module.exports = {cameraTalk};
