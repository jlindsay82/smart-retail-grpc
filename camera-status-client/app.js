// Mount dependencies for client application
var readlineSync = require("readline-sync");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var PROTO_PATH = __dirname + "/protos/camera.proto";

//Define proto package and client
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var camera_proto = grpc.loadPackageDefinition(packageDefinition).camera;

var client = new camera_proto.CameraService(
  "0.0.0.0:40000",
  grpc.credentials.createInsecure()
);

// Initialise variables
//var id = readlineSync.question("Input your 4 digit camera id: ");
var call = client.serviceStatus({});

// //Define call logging
// call.on("data", function (resp) {
//   console.log("Camera Service Status is " + resp.status + ". Number of connected clients is " + resp.clientCount);
// });
// call.on("end", function () {});
// call.on("error", function (e) {
//   console.log("Cannot connect to camera service");
// });


call.on("data", function (resp) {
  console.log(
    "Camera Service Status is " + resp.status + ". Number of connected clients is " + resp.clientCount
  );
});

call.on("end", function () {});

call.on("error", function (e) {
  console.log(e);
});



// call.on("data", function (response) {
//   console.log(
//     response.favouriteMovie +
//       " people chose " +
//       response.movieType +
//       " as their favorite movie"
//   );
// });

// call.on("end", function () {});

// call.on("error", function (e) {
//   console.log(e);
// });

//Call sending initial camera data to the service
// client.serviceStatus({
//   id: id,
// });

// Post camera status, location and number of detected shoppers data every 30 seconds to the camera service
// setInterval(cameraStatus,30000)

// function cameraStatus(){
//   detectedShoppers = Math.floor(Math.random() * 10) + 1;
//   call.write({
//     id: id,
//     status: status,
//     location: location,
//     detectedShoppers: detectedShoppers,
//   });
// };