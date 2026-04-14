const cds = require('@sap/cds');
const { SELECT, INSERT } = require('@sap/cds/lib/ql/cds-ql');


// Test Handlers
// Write a CREATE handler for Employee that auto-creates a Passport if not provided.

//implementation function
module.exports = cds.service.impl(function () {
    const { Employee, Passport } = this.entities;


    async function checkLast(entityObj) {
        const data = await SELECT.from(entityObj).orderBy('ID desc');
        const last = data[0].ID;
        const newID = Number(last) + 1;

        return newID;
    }
    this.before('CREATE', Employee, async (req) => {
        const { name, email, passport_ID } = req.data;
        const empgeneratedId = await checkLast(Employee);
        if ( !name || !email) {
            return req.error(400, { msg: "All the Fields Are Required" });
        }
        if (!passport_ID) {
            const generatedId = await checkLast(Passport);
            const newPassport = {
                ID: generatedId,
                number: 23444,
                country_code: 'IND',
                employee_ID: empgeneratedId
            }
          
            await INSERT.into(Passport).entries(newPassport);
            req.data.passport_ID = generatedId;  
        }
          req.data.ID = empgeneratedId;
    })
});