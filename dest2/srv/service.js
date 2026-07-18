const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');
const {getDestination} = require('@sap-cloud-sdk/connectivity')
module.exports = cds.service.impl(async function(){
   const s4 = await cds.connect.to('API_SALES_ORDER_SRV');
   const{SalesOrderHeader}= this.entities;
   this.on('READ',SalesOrderHeader,async(req)=>{
    // let destinationDetails = await getDestination({destinationName:'SalesOrder'});

    try{
    // console.log(destinationDetails)
        const {A_SalesOrder} = s4.entities;
        let requiredColumns = ['SalesOrder', 'SoldToParty','TotalNetAmount','TransactionCurrency', 'OverallSDProcessStatus','OverallDeliveryStatus','CreationDate','RequestedDeliveryDate']
        const data = await s4.run(SELECT.from(A_SalesOrder).columns(requiredColumns).limit(100));
        return data;
    }catch(err){
      // console.log(`REq End::${Date.now()-start} ms`)
      console.log(err.message)
    }
   });

  //Net Worth
   this.on('netWorth',async()=>{
    const {A_SalesOrder} = s4.entities;
      const netWorth = await s4.run(SELECT.from(A_SalesOrder).columns('TotalNetAmount').limit(10));
      return netWorth;
   })
})
