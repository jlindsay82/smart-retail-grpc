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

// Initialise variable
var call = client.serviceStatus({});

// Call service and handle response
call.on("data", function (resp) {
  console.log(
    "Camera Service Status is " + resp.status + ". Number of connected clients is " + resp.clientCount
  );
});

call.on("end", function () {});

call.on("error", function (e) {
  console.log(e);
});