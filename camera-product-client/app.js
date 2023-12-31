// Mount dependencies for client application
var readlineSync = require("readline-sync");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
var PROTO_PATH = __dirname + "/protos/camera.proto";

<<<<<<< HEAD
//Define proto package and client
=======
>>>>>>> 2956c286ad78fa527f139d32f2699c87995d4d6e
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
<<<<<<< HEAD

// Define client call
=======
      // var call = client.productLowAlert()

>>>>>>> 2956c286ad78fa527f139d32f2699c87995d4d6e
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

<<<<<<< HEAD
//function will execute every 30 seconds sending product count data from client to service
setInterval(sendProductCount, 30000);

function sendProductCount(){
  productCount = Math.floor(Math.random() * 10) + 1;
  console.log ("Shelf #" + shelf + " has " + productCount + " remaining products");
=======
//var requestCount = 0;
function sendProductCount(){
  productCount = Math.floor(Math.random() * 10) + 1;
  console.log ("Shelf #" + shelf + " has " + productCount + " remaining products")
  //requestCount++;
>>>>>>> 2956c286ad78fa527f139d32f2699c87995d4d6e
  call.write({
    id: id,
    shelf: shelf,
    productCount: productCount,
  });
<<<<<<< HEAD
}
=======
}

setInterval(sendProductCount, 30000);
>>>>>>> 2956c286ad78fa527f139d32f2699c87995d4d6e
