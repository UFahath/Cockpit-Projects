const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');



module.exports = cds.service.impl(async function(){
   const {Orders} = this.entities;
  

   this.on('READ',Orders,async(req)=>{
      const approvedVehicles = await SELECT.from(Orders).where({orderStatus:'approved'});

      if(!approvedVehicles || approvedVehicles.length<=0){
         return req.error(404,'No Approved Vehicles Found')
      }

      return approvedVehicles;
   });


//    this.on('CREATE',Orders,)
});