const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {
    const { PurchaseOrders } = this.entities;

    
//Read and add RiskLevel
    this.after('READ', PurchaseOrders, async function (req) {
        let objNew = {};
        const data = await SELECT.from(PurchaseOrders);

        for (let obj of data) {
            let { amount } = obj;
            if (amount > 100000) {
                obj.riskLevel = 'HIGH';
                objNew = {...obj};
            } else if (amount >= 50001 && amount <= 100000) {
                obj.riskLevel = 'MEDIUM';
                objNew = {...obj};
            } else {
                obj.riskLevel = 'LOW';
                objNew = {...obj};
            }
        }
        objNew = { ...data };
        return objNew;

    });


    //UPDATE
    this.before('UPDATE',PurchaseOrders,async function(req){
        const {id} = req.params[0];

        const data = await SELECT.from(PurchaseOrders);
        console.log(data)
    })
})


