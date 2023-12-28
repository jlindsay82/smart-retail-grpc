// Mount dependencies for clientapplication
var readlineSync = require("readline-sync");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var PROTO_PATH = __dirname + "/protos/camera.proto";

var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var camera_proto = grpc.loadPackageDefinition(packageDefinition).camera;

var client = new camera_proto.CameraService(
  "0.0.0.0:40000",
  grpc.credentials.createInsecure()
);

// Initialise variables
var id = readlineSync.question("Input your 4 digit camera id: ");
var status = "active";
var location = Math.floor(Math.random() * 100) + 1;
var detectedShoppers = 0;
var call = client.cameraTalk();

//Define call logging
call.on("data", function (resp) {
  console.log(resp.id + ": Status is " + resp.status + ", location is " + resp.location + ", number of detected shoppers is " + resp.detectedShoppers);
});
call.on("end", function () {});
call.on("error", function (e) {
  console.log("Cannot connect to camera service");
});

//Call sending initial camera data to the service
call.write({
  id: id,
  status: status,
  location: location,
  detectedShoppers: detectedShoppers,
});

// Post camera status, location and number of detected shoppers data every 30 seconds to the camera service
setInterval(cameraStatus,30000)

function cameraStatus(){
 detectedShoppers = Math.floor(Math.random() * 10) + 1;
  call.write({
    id: id,
    status: status,
    location: location,
    detectedShoppers: detectedShoppers,
  });
};