const cds = require('@sap/cds');

module.exports = cds.service.impl(function(){
    const {student} = this.entities;
    this.on('READ',student,async function(req){
        console.log(cds.entities)
    })
})