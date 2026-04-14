const cds = require('@sap/cds')
module.exports = cds.service.impl(async function(){

    const { srventity } = this.entities;

    this.before('READ', srventity, function (req) {
       console.log(cds.entities)
        // console.log("Global Entities:", Object.keys(cds.entities));

        // console.log("Service View Entities:", Object.keys(this.entities));

        // console.log("This Entities:", Object.keys(this.entities));

    });

});