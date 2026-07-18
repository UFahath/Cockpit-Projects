const cds = require('@sap/cds');

module.exports = cds.service.impl(function(){
    const {Order} = this.entities;
    this.on('READ',Order,async(req,next)=>{
        console.log(req.user.attr.givenName);
        return next();
    })
})