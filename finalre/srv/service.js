const cds = require('@sap/cds')
cds.on('served',()=>{
    console.log(cds.services.MyService)
})