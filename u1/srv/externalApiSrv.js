const axios = require('axios');
const cds = require('@sap/cds');
const { UPSERT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    const { ExternalApi } = this.entities;

    this.on('READ', ExternalApi, async function (req) {

        const tx = cds.tx(req);  

        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts');

            const myData = response.data.map(({ userId, id, title, body }) => ({
                myId: cds.utils.uuid(),
                userId,
                id,
                title,
                body
            }));

           
            await tx.run(UPSERT.into('my.db.MyDatas').entries(myData));

            return myData;

        } catch (err) {
            console.log(err.message);
        }
    });

});