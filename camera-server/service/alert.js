
//function will take call data from client and if less than 5 products are counted on a shelf, the server will log a warning alert.

function productLowAlert(call, callback) {
  call.on("data", function (request) {
    if(request.productCount < 5){
<<<<<<< HEAD
      console.log("Alert: Product count is low on shelf #" + request.shelf + "!");
    }
  });

  call.on("end", function () {
    call.end();
=======
      console.log("*** Product count is low on shelf #" + request.shelf + " ***");
    }
  });
  call.on("end", function () {
    callback(null, {
    });
    console.log("Camera has left the service.");
>>>>>>> 2956c286ad78fa527f139d32f2699c87995d4d6e
  });

  call.on("error", function (e) {
    console.log("An error occured");
  });
}

module.exports = {productLowAlert};
