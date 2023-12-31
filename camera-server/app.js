// Mount dependencies for client application
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var PROTO_PATH = __dirname + "/protos/camera.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var camera_proto = grpc.loadPackageDefinition(packageDefinition).camera;

//import functions for service
var talk = require("./service/talk");
var alert = require("./service/alert");
<<<<<<< HEAD
var status = require("./service/status");
=======
>>>>>>> 2956c286ad78fa527f139d32f2699c87995d4d6e

//Establish server and services 
var server = new grpc.Server();
server.addService(camera_proto.CameraService.service, {
  cameraTalk: talk.cameraTalk,
  productLowAlert: alert.productLowAlert,
<<<<<<< HEAD
  serviceStatus: status.serviceStatus,
=======

>>>>>>> 2956c286ad78fa527f139d32f2699c87995d4d6e
});

server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    server.start();
  }
);

console.log("Hello! The Camera Service has started :)"); 
