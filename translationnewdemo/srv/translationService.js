const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');
const axios = require('axios');
require('dotenv').config();
module.exports = cds.service.impl(function () {


  const tokenUrl = process.env.tokenUrl;
  const clientId = process.env.clientId;
  const clientSecret = process.env.clientSecret;

  this.on('getTranslate', async function (req) {
    const {text,la} = req.data;
    if(!text){
      return req.error(400,'Valid Input Needed');
    }

    let output = await getAccessToken();
    let languagesCodes = await SELECT.one.from('languagesCodes.db.languagesCodes').where({Language:la});
    let response = await getTranslation(languagesCodes.Locale,output,text);
    let decodedText = Buffer.from(response.data, 'base64').toString('utf-8');
    return decodedText;
  })






  //Access Token Generation
  async function getAccessToken() {
    const tokenResponse = await axios.post(
      tokenUrl, 'grant_type=client_credentials'
      ,
      {
        auth: {
          username: clientId,
          password: clientSecret
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

    const accessToken = tokenResponse.data.access_token;
    // console.log(accessToken)
    return accessToken
  }


  //Translation part
  async function getTranslation(to, token,text) {
    let response = await axios.post(
      `https://document-translation.api.us10.translationhub.cloud.sap/api/v1/translation?sourceLanguage=en-US&targetLanguage=${to}`,text,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'text/plain'
        }
      }
    );
    // console.log(response.data);
    return response.data;
  }
});