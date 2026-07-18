const cds = require('@sap/cds');
const axios = require('axios');

module.exports = cds.service.impl(async function () {

 

  this.on('translateText', async (req,next) => {
          //Get Access Token 

async function getAccessToken() {
  const tokenUrl = "https://f23cbb9btrial.authentication.us10.hana.ondemand.com/oauth/token";

  const clientId = "sb-74a6e78c-4bb5-4838-8da5-73448b4996be!b634740|document-translation-us10!b1112";
  const clientSecret = "f049f885-7bf7-421a-8b0a-83a9c9563c3a$XRxe6UuIjQoqxENEioKVQF4hUO7mOb1PAOFdq-e-7Jw=";

  const response = await axios.post(
    tokenUrl,
    "grant_type=client_credentials",
    {
      auth: {
        username: clientId,
        password: clientSecret
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  console.log("Access Token:", response.data.access_token);
  return response.data.access_token;
}

let data = await getAccessToken();
console.log(data);
return next();
  });

});






