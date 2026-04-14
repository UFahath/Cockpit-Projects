const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    const { EmailAddress,ExternalEmailAddress  } = this.entities;
    const s4 = await cds.connect.to('API_BUSINESS_PARTNER');

    this.on('READ',EmailAddress, async (req) => {

        const data = await s4.run(SELECT.from('A_AddressEmailAddress').limit(20));
        if (!data || data.length === 0) return "No data returned";

        // const tx = cds.tx(req);

        // await tx.run(INSERT.into(EmailAddress).entries(
        //     data.map(r => ({
        //         AddressID: r.AddressID,
        //         Person: r.Person,
        //         OrdinalNumber: r.OrdinalNumber,
        //         IsDefaultEmailAddress: r.IsDefaultEmailAddress?1:0,
        //         EmailAddress: r.EmailAddress
        //     }))
        // ));
    //    await tx.commit();
        return data
    });

});