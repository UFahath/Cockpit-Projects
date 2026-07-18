const cds = require('@sap/cds');
const fs = require('fs');
(async () => {
  // Load your CDS model (all .cds files)
  const csn = await cds.load('*');

  // Compile to EDMX for specific service
 const xml = cds.compile.to.edmx(csn, {
  service: 'LeaveRequestService'
}).toString();

  console.log(xml);
   fs.writeFileSync('LeaveRequestService.xml', xml);
})();