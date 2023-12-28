var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var PROTO_PATH = __dirname + "/protos/camera.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var camera_proto = grpc.loadPackageDefinition(packageDefinition).camera;

var clients = {};

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

var server = new grpc.Server();
server.addService(camera_proto.CameraService.service, {
  cameraTalk: cameraTalk,
});
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    server.start();
  }
);
