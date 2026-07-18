const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const {getDestination} = require('@sap-cloud-sdk/connectivity')

require('dotenv').config();

// {
//   text: 'Sunny',
//   icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
//   code: 1000
// }
async function getWeather(location = 'Kashmir') {
    if(process.env.USE_MOCK_WEATHER==='true'){
  return {
      text: 'Sunny',
      icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
      code: 1000
    };
    }
    // console.log("real")
    if(location.includes(' ')){
        location = location.split(' ')[0];
    }

    try {
     
        const destination = await getDestination({destinationName:'Weatherapi'});
        console.log("Destination::",destination)
        console.log("---------------------------------------------------")
        console.log(destination.originalProperties.apikey)
        const response = await executeHttpRequest(
            { destinationName: 'Weatherapi'},
            {
                method: 'GET',
                url: `/v1/current.json`,
                params: {
                    q: location,
                    key:destination.originalProperties.apikey
                }
            }
        );
        console.log(response.data.current.condition)
        return response.data.current.condition;
    } catch (err) {
        throw err;
        // console.log(err.message);
    };

}

module.exports = { getWeather }