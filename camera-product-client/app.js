// Mount dependencies for client application
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
var shelf = Math.floor(Math.random() * 100) + 1;
var productCount = Math.floor(Math.random() * 10) + 1;
      // var call = client.productLowAlert()

var call = client.productLowAlert(function (error, response) {
  if (error) {
    console.log("An error occurred");
  } else if (response.productCount < 5) {
    console.log(
      "Shelf #" + response.shelf + " only has " +
      response.productCount + " items remaining!"
    );
  }
  else {
    console.log ("Product stock count is ok for shelf #" + shelf)
  }
});

//var requestCount = 0;
function sendProductCount(){
  productCount = Math.floor(Math.random() * 10) + 1;
  console.log ("Shelf #" + shelf + " has " + productCount + " remaining products")
  //requestCount++;
  call.write({
    id: id,
    shelf: shelf,
    productCount: productCount,
  });
}

setInterval(sendProductCount, 30000);