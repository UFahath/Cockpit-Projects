require('dotenv').config();
const {getDestination} = require('@sap-cloud-sdk/connectivity')
const {executeHttpRequest} = require('@sap-cloud-sdk/http-client');
async function notify(message='hello world'){
   //let serviceUrl = process.env.ALERT_URL;
   let destination = await getDestination({destinationName:'alertservice'});
   // console.log(serviceUrl)
   // console.log(destination.destinationConfiguration.authTokens.value)
   console.log(destination)
   const response = await executeHttpRequest(destination,{
      method:'POST',
      url:'/cf/producer/v1/resource-events',
      data:{
  "eventType": "lowstockalert",
  "resource": {
    "resourceName": "MyApp",
    "resourceType": "Application"
  },
  "severity": "INFO",
  "category": "ALERT",
  "subject": "Testing alert",
  "body": "Test from Cloud SDK"
}
   });
   console.log("-------------------------------------")
   console.log(response)
   

}

module.exports = {notify}