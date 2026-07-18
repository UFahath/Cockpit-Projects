const cds = require('@sap/cds');

module.exports = cds.service.impl(function(){
    const {Books} = this.entities;
    this.before('READ',Books,async function(){
        console.log(cds.entities)
    })
})