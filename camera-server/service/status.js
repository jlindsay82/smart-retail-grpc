//Initialise client count
var clientCount = 0;

//function defines call response for each client found in clients array. If not found, client id is added to clients array
  function serviceStatus(call, callback) {
    clientCount++;
    setInterval(status, 30000);

    function status(){
      call.write({
        status: "active",
        clientCount: clientCount,
      });
    }
    //call.end();
  }
module.exports = {serviceStatus};