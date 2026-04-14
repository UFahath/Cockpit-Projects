

const cds = require('@sap/cds');
module.exports = cds.service.impl(function(){
    const {Books} = this.entities
    this.before('INSERT',Books,async(req){
        
    })
})