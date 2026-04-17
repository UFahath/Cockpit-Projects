const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function(){

  // const { Orders } = srv.entities;
 this.on('READ','*',async function(req,next){
  console.log(Object.keys(this.entities))
  // console.log(cds.utils.exists('./srv/service.cds'))
       // console.log(cds.utils.isdir('data'))
  //   if(cds.utils.exists('./srv/service.cds')){
  //     console.log("Service.cds Exists")
  //   }else{
  //     console.log("Service.cds is not exists")
  //   }
       //console.log(cds.utils.uuid())
      // console.log(cds.utils.exists('./srv/service.cds')) (file existence)
      // console.log(cds.utils.isdir('data'))(directory path from root absolute path work only for current dir)
      // let pkg = await cds.utils.read('package.json');(read the file)
      // console.log(pkg)
      // console.log(cds.utils.rmdir('./dum'))(remove the folder)

    //   console.log(cds.version)
    //  cds.load= await cds.load('*');
    //  console.log(cds.load)
    // return next();


    // const data = await SELECT.from(Orders,(e)=>{
    //   e.ID
    // });
    return next();
 })
  // srv.on('CREATE', Orders, async function(req){

  //   const { ID, products } = req.data;

  //   if (!ID || !products) {
  //     return req.error(400, "Invalid Input");
  //   }

  //   const result = await INSERT.into(Orders).entries({
  //     ID: ID,
  //     orderDate: new Date(),
  //     products: products.map(p => ({
  //       product_ID: p.product_ID
  //     }))
  //   });

  //   return result;
  // });

});



