const cds = require('@sap/cds');
const config = cds.env.requires.translation;
const axios = require('axios');
const FormData = require('form-data');
// const fs = require('fs');
let i=0;

const username = config.clientid;
const password = config.clientsecret;
const tokenUrl = config.tokenurl;
const apiUrl = config.apiUrl;

// console.log(username,'\n',password,'\n',tokenUrl)

//Access Token Generation
async function generateToken(){
    const response = await axios.post(tokenUrl,'grant_type=client_credentials',{
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        },
        auth:{
            username,password
        }
    });
    let accesstoken = response.data.access_token;
    return accesstoken ;
}


//Translation
async function translation(token="",targetLanguage,inputs){
    console.log("translation hit")
    let code = await getLanguages(targetLanguage)
    console.log("translation end")
    // console.log(inputs)
    // console.log(apiUrl+`/api/v1/translation?targetLanguage=${code}`)
    // console.log(code)
    // let form = new FormData();
    // form.append('text',inputs)
//    let mytoken = await generateToken();
  // Safety fixes
try{
    // console.log(await inputs)
   const response = await axios.post(`${apiUrl}/api/v1/translation?targetLanguage=${code}`,inputs,{
    headers:{
        'Authorization':`Bearer ${token}`,
         'Content-Type':'text/plain'
    }
   });
   console.log(i++)
   console.log(Buffer.from(response.data.data,'base64').toString('utf-8'))
   console.log("Iam from translation function")
   return Buffer.from(response.data.data,'base64').toString('utf-8');
}
catch(err) {
    console.log('Catch entered')
    throw err.message;
}
}

async function getLanguages(lan='en'){
    let token = await generateToken();
    const response = await axios.get(`${apiUrl}/api/v1/languages`,{
        headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
        }
    });
   let la = response.data.languages.find(({bcpcode})=>bcpcode.startsWith(lan));
//    console.log(la)
   return la.bcpcode;
}
// getLanguages();
module.exports = {generateToken,translation}