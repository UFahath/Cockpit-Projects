// orderCreate
const cds = require('@sap/cds');
const {getDestination} = require('@sap-cloud-sdk/connectivity')
// {
//     "url": "https://clm-sl-ans-live-ans-service-api.cfapps.us10.hana.ondemand.com",
//     "client_id": "sb-1a56c8a1-d7b6-426c-b448-a2dd49b395f9!b634740|ans-xsuaa!b673",
//     "client_secret": "7f7dd293-66c5-4589-93cd-afd0eb2c6059$L6kiVVm1Xn-yrcDA-3z40b9ztkHiqlq48_M_TNX2VLo=",
//     "oauth_url": "https://f23cbb9btrial.authentication.us10.hana.ondemand.com/oauth/token?grant_type=client_credentials"
// }



let notifyUser = async (insertedData) => {
    //let output = await getDestination({destinationName:'alertService2'});
    //console.log(output)
    let alertService = await cds.connect.to('alertService2');
    // console.log(alertService)
    let data = await alertService.send({
        method: 'POST',
        path: '/cf/producer/v1/resource-events',
        data:{
            eventType: 'orderCreate',
            severity: 'INFO',
            subject: 'Order Creation Status',
            body:`Order SuccessFully Placed 
                  Order Details::
                           SalesOrder       :${insertedData.SalesOrder}
                           SoldToParty      :${insertedData.SoldToParty}
                           SalesOrderDate   :${insertedData.SalesOrderDate}
                           TotalNetAmount   :${insertedData.TransactionCurrency} ${insertedData.TotalNetAmount}`,
            category: 'NOTIFICATION',
            resource: {
                resourceName: 'Order success Details',
                resourceType: 'Update Order Status'
            }
        }
       })

       return data;
  };

module.exports = notifyUser;