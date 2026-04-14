const { searchRegisteredDestination } = require('@sap-cloud-sdk/connectivity/dist/internal');
const cds = require('@sap/cds');

module.exports = cds.service.impl(async function(){
    const {PaymentMethod} = this.entities;
    console.log(this.name);
    
    const conn = await cds.connect.to('API_BUSINESS_PARTNER')

    this.on('READ',PaymentMethod,async(req)=>{
        console.log(req.query);
       const result = await conn.run(req.query);
       console.log(result);
       return result;
    })
})