const cds = require('@sap/cds');

cds.on('loaded',function(){
    const edmx = cds.compile.to.edmx(cds.model,{service:'MyService'});
    console.log(edmx)
})