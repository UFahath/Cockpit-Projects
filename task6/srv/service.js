const cds = require('@sap/cds');
const axios = require('axios');

// http://postalpincode.in/api/pincode
// {
//    "Message":"Number of Post office(s) found: 21",
//    "Status":"Success",
//    "PostOffice":[
//       {
//          "Name":"Baroda House",
//          "Description":"",
//          "BranchType":"Sub Post Office",
//          "DeliveryStatus":"Non-Delivery",
//          "Circle":"New Delhi",
//          "District":"Central Delhi",
//          "Division":"New Delhi Central",
//          "Region":"Delhi",
//          "State":"Delhi",
//          "Country":"India"
//       }
//    ]
// }

module.exports = cds.service.impl(function () {
  this.on('getMap', async (req) => {
    try {
      let  name = req.data.loc;
      if(!name) return req.error(400,"Invalid Input");

      const  pincodeVerifier = !isNaN(Number(name));
      if(pincodeVerifier){
       name = await pincodeConverter(name);
       name = name?.District;
      }
      const data = await axios(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&language=en&format=json`)
      const results = data?.data?.results;
       if (!data || results.length === 0) {
        return req.error(404, "Location not found");
      }
    //  console.log(results)
      const result  = results.reduce((accu,{name,latitude,longitude,country,admin1})=>{
          accu.push({name,latitude,longitude,country,state:admin1});
          return accu;
      },[]);
      return result;
    }catch(err){
      const status = err.status;
      const message = err.message;
      return req.error(status|| 502,message||"Internal Server Error");
    }
  })



  // //Pincode to District(Conversion)
  async function pincodeConverter(pincode){
    try{
      const data = await axios(`https://api.postalpincode.in/pincode/${pincode}`);
      const {Status,PostOffice,Message}=data.data[0];
      // console.log(data.data[0])
      if(Status!=='Success' || !PostOffice || PostOffice.length ===0){
        const err =  new Error(`Pincode API Failed:${Message}`);
        err.status = 404;
        throw err;
      }
      return PostOffice[0];
    }catch(err){
      if(err.status) throw err;
      const err1 = new Error("Pincode Api Failed");
      err1.status = 502;
      throw err1;
    }
  }
})



