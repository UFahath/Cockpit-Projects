const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
const axios = require('axios');
module.exports = cds.service.impl(async function () {
    const { Orders } = this.entities;
    const translationHub = await cds.connect.to('SAP.Translation.Hub');

    // async function translateText(text, targetLang) {
    //     const res = await axios.post('https://libretranslate.com/translate', {
    //         q: text,
    //         // source: "en",
    //         target: targetLang,
    //         format: "text"
    //     });
    //     return res.data.translatedText;
    // }
    // this.after('READ', 'Orders', async(result, req) => {
    // console.log(req._.req?.query?.['sap-locale'])
    //     const locale = req._.req.query['sap-locale'];
    //  const TH = await cds.connect.to('SAP.Translation.Hub'); //
    //  const res = await TH.translate_post({
    //                 sourceLanguage: "en",
    //                 targetLanguages: [locale]});
    //                 console.log(res)

    // console.log(locale)
    // const isLocaleExist = await SELECT.one.from('myapp.db.Orders_texts');
    // if(isLocaleExist){
    //     let translateName = await translateText(isLocaleExist.status,locale)
    //     console.log(translateName)
    // }
    // console.log(isLocaleExist)

    // })


    async function getTranslation(text,targetLanguage) {

    const res = await translationHub.post('/translate', {
      sourceLanguage: 'en',
      targetLanguage: targetLanguage,
      text: text[0]
    });

    return { translatedText: res.data.translatedText };
  }


   
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
        const {Orders_texts} = this.entities;
        console.log(Orders_texts)
        let locale = req._.req.query['sap-locale'];
         const translated = await getTranslation(status, locale);
            //  console.log(translated)
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