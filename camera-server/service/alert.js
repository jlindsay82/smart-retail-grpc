
//function will take call data from client and if less than 5 products are counted on a shelf, the server will log a warning alert.

function productLowAlert(call, callback) {
  call.on("data", function (request) {
    if(request.productCount < 5){
      console.log("Alert: Product count is low on shelf #" + request.shelf + "!");
    }
  });

  call.on("end", function () {
    call.end();
  });

  call.on("error", function (e) {
    console.log("An error occured");
  });
}

module.exports = {productLowAlert};
