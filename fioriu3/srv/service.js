const cds = require('@sap/cds');
module.exports = cds.service.impl(async function(){
    const {Order,OrderItem} = this.entities;
    //new draft for order(during edit mode i am setting childentity id so not found error is went)
     this.before('NEW',Order.drafts,async function(req){
      // console.log(req.data.items)
      let myId="376367637"
        req.data.items={ID:myId};
     })

     this.before('CREATE',Order,async function(req){
      console.log(req.data)
     })
})