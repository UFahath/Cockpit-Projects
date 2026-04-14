const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {

  const { Incident } = this.entities;

  this.before("CREATE", Incident, async (req) => {
    urgencyChangeBasedonData(req.data)
  });

  this.before("UPDATE", Incident, async (req) => {
    await update(req)
  });

//  this.on('resolveIncident', Incident, async (req) => {

//   const { ID } = req.params[0];
//   const incident = await SELECT.one.from(req.subject).where({ ID });

//   if (!incident) {
//     return req.reject(404, 'Incident not found');
//   }

//   if (incident.status_code === 'C') {
//     return req.reject(400, 'Incident is already closed');
//   }


//   await UPDATE(req.subject)
//     .set({ status_code: 'C' })
//     .where({ ID });

// });

  function urgencyChangeBasedonData(data) {
    let urgent = data.title?.toLowerCase() || '';
    if (urgent.includes('urgent')) data.urgency_code = 'H'
  }

  async function update(req) {
    let closed = await SELECT.one(1)
      .from(req.subject)
      .where`status_code = 'C'`

    if (closed) {
      req.reject(`Can't modify a closed incident!`)
    }
  }

});