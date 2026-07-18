const cds = require('@sap/cds');

console.log("1------>FILE LOADED");

cds.on('bootstrap', (app) => {
  console.log(app)
  console.log("2️------------>BOOTSTRAP");
});

cds.on('served', async (req) => {
  console.log(req)
//  console.log(cds.services)           //
//  console.log(cds.type)        
  for(let srv of cds.services){
    if(!srv.definition || srv.definition.kind!=='service'){
      continue;
    }
    let edmx = cds.compile.to.edmx(cds.model,{service:srv.name});
      // console.log(edmx)
  } 
});


