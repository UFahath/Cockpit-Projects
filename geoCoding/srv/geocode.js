const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

  const geo = await cds.connect.to('Geocoding');

  this.on('getCoordinates', async (req) => {

    const address = req.data.address;
    
    if(!address){
        return req.error(400,"Input is Required")
    }
    const result = await geo.send({
      method: 'POST',
      path: '/geocode',
      data: {
        credentials: {
          provider: "HERE",
          api_key:"SAP-KEY"
        },
        addresses: [address]
      }
    });
    
    console.log(result.features)
    if(!result || result.length===0){
        return req.error(404,"No Results Found")
    }

    const feature = result.features[0];
    return {
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      State:feature.properties.address.State,
      location: feature.properties.locationLabel
    };

  });

});


// {
//   type: 'FeatureCollection',
//   features: [ { type: 'Feature', geometry: [Object], properties: [Object] } ]
// }



// [
//   {
//     type: 'Feature',
//     geometry: { type: 'Point', coordinates: [Array] },
//     properties: {
//       relevance: 1,
//       locationLabel: 'Tamil Nadu, India',
//       address: [Object],
//       inputIndex: 0,
//       precision: [Object]
//     }
//   }
// ]


// {
//   type: 'Feature',
//   geometry: { type: 'Point', coordinates: [ 80.28273, 13.08404 ] },
//   properties: {
//     relevance: 1,
//     locationLabel: 'Tamil Nadu, India',
//     address: {
//       Country: 'India',
//       Label: 'Tamil Nadu, India',
//       State: 'Tamil Nadu'
//     },
//     inputIndex: 0,
//     precision: { addressType: 'state', matchScore: 1 }
//   }
// }

