const cds = require("@sap/cds");
const utils = require('./utils/translationHub.js');
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
module.exports = cds.service.impl(async function () {
    const { Orders } = this.entities;
    this.after('READ', Orders, async (result, req) => {
       const start = Date.now();

    await new Promise(r => setTimeout(r, 141000));

    const duration = Date.now() - start;

    // Add header to response
    // req._.res.setHeader("Server-Timing", `app;dur=${duration}`);
        const locale = req.locale;
        // console.log(req.headers['accept-language'])
        const isLocaleExist = await SELECT.one.from('myapp.db.Orders_texts').where({ locale });
        if (isLocaleExist) {
            return { ...result, status: isLocaleExist.status, deliveryMethod: isLocaleExist.deliveryMethod }
        } else {
            let token = await utils.generateToken();
            console.log(locale)
            try {
                const records = result.flatMap((e) =>({status:e.status, deliveryMethod:e.deliveryMethod}));
                // console.log(records)
                // console.log(records)
             const text =[];
             console.log("before promise")
            //    for(let record  of records){
            const translatedText
             = await Promise.allSettled(
                utils.translation(token, locale, records.status,records.deliveryMethod)
            )
            // }
           

                return translatedText
                // console.log(translated);
                // console.log("hi")
                // console.log(translated)
            } catch (err) {
                console.log(err.message)
            }

            //  let data = await utils.translation(token,locale,record);


            //    console.log(data)
        }
    })
 this.on('READ','*',async(req,next)=>{
      await new Promise(r => setTimeout(r, 200000));
      return next();
 })
process.on('SIGTERM', async () => {
  console.log('SIGTERM received - shutting down gracefully');

  // close DB connections, cleanup
  await cds.shutdown();

  process.exit(0);
});

    this.before('CREATE', Orders, async function (req) {
        const {
            orderNumber,
            customerID,
            orderDate,
            deliveryDate,
            status,
            amount,
            deliveryMethod
        } = req.data;

        if (!orderNumber || !customerID || !orderDate || !deliveryDate || !status || amount == undefined || !deliveryMethod) {
            return req.error(400, "Invalid Inputs")
        }
        // console.log(cds.entities)
        req.data.ID = cds.utils.uuid();
    })
    this.on('CREATE', Orders, async function (req, next) {
        const { ID, status, deliveryMethod } = req.data;
        const { Orders_texts } = this.entities;
        let locale = req._.req.query['sap-locale'];
        console.log(locale)
        const isDataHasTranslation = await SELECT.one.from('myapp.db.Orders_texts').where({ ID, locale });
        if (!isDataHasTranslation) {

            await INSERT.into(Orders_texts).entries({
                ID,
                locale,
                status: translated.translatedText,
                deliveryMethod: "dummy"
            });
        }
        return next()
    })

    this.on('getWithDrafts', async function () {
        const draft = await SELECT.from('MyService.Orders_drafts');
        const data = await SELECT.from(Orders)
        let result = [...data, ...draft]
        console.log(result)
        return result;
    });

});