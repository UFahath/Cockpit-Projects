const cds = require('@sap/cds');
const { INSERT } = require('@sap/cds/lib/ql/cds-ql');
// const getData = require('../scripts/externalData');

module.exports = cds.service.impl(async function() {
    const {Worksheet} = this.entities;
    const external = await cds.connect.to('API_MANAGE_WORKFORCE_TIMESHEET');
    // const db = await cds.connect.to('db');
     this.on('replicateTimeSheet',async()=>{
        const data = await external.run(SELECT.from('TimeSheetEntryCollection') .columns(
          'TimeSheetRecord',
          'TimeSheetDate',
          'CompanyCode',
          'TimeSheetStatus',
          'PersonWorkAgreementExternalID'
        )
        .limit(10));
        //array
        // const worksheet =cds.entities['employee.db.externalTimeSheet']
        // console.log(cds.entities)
       const dataCount = await UPSERT.into(Worksheet).entries(data);
       console.log(dataCount)
        return data
     })
});



