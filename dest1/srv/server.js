const cds = require('@sap/cds');

// cds.on('loaded',function(model){
//     console.log(model)
// })
cds.on('served',async(req)=>{
// console.log(cds.service.providers[0].handlers);

 const edmx = cds.compile.to.edmx(cds.model,{service:'MyService'});
 console.log(edmx)
})