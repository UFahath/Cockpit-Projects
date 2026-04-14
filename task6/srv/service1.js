const cds = require('@sap/cds');
const { default: axios } = require('axios');
const { get } = require('express/lib/request');
module.exports = cds.service.impl(async function () {
  let countryCodeLocal = null
  const geo = await cds.connect.to('GeoAPI');
  const pincodeAPI = await cds.connect.to('PincodeAPI');
  const countryAPI = await cds.connect.to('CountryCityAPI')

  //---------------------------functions
  //getcountrycode
  async function countryCode(name, req) {
    if (!name) return null;
    if (!countryCodeLocal) {
      const allcountries = await countryAPI.send({
        method: "GET",
        path: "/countries",
        headers: { "X-CSCAPI-KEY": process.env.CSC_API_KEY }
      })
      countryCodeLocal = allcountries;
    }

    const code = countryCodeLocal.find((c) => {
      return c.name.toLowerCase() == name.toLowerCase();
    })
    //IN -->INDia                  
    if (!code?.iso2) {
      return req.error(404, "No Such State Present");
    }
    return code?.iso2;
  }


  //Get State
  async function getState(state) {

    const res = await axios.get('http://api.geonames.org/searchJSON', {
      params: {
        country: "IN",
        featureCode: "ADM1",
        name: state,
        maxRows: 1,
        username: 'uzfahath_49'
      }
    })
    // console.log(res)
    return res.data.geonames[0];
  }


  //Get Districts based on the retrieved  stateCode (all)
  async function getDistricts(stateCode) {
    const res = await axios.get("http://api.geonames.org/searchJSON", {
      params: {
        country: "IN",
        featureCode: 'ADM2',
        adminCode1: stateCode,
        maxRows: 200,
        username: 'uzfahath_49'
      }
    });
    return res.data.geonames.map((obj) => {
      return {
        district: obj.name,
        lat: obj.lat,
        lon: obj.lng
      }
    })
  }

  //main for getDistrictsByState
  async function getDistrictsByState(state) {
    // console.log(state)
    let { adminCode1 } = await getState(state);
    // console.log(stateCode.adminCode1)
    let districts = await getDistricts(adminCode1);
    return districts;
  }



  //get Single district coordinates
  async function getDistrict(district) {
    // console.log(district)
    const res = await axios.get("http://api.geonames.org/searchJSON", {
      params: {
        country: 'IN',
        featureCode: 'ADM2',
        adminCode1: 25,
        maxRows: 40,
        username: 'uzfahath_49'
      }
    });

    let distr = res.data.geonames.find(({ name = 'nothing' }) => {
      return name == district || name.includes(district);
    })
    // console.log(distr)
    let result = [distr].map(({ name, lat, lng: lon }) => {
      return {
        district: name,
        lat,
        lon
      }
    });
    return result;
  }

  // //Pincode to District(Conversion)
  async function pincodeConverter(target) {
    try {
      // console.log(target)
      const data = await pincodeAPI.send({
        method: "GET",
        path: `/pincode/${target}`
      });
      console.log(data[0])
      const { Status, PostOffice, Message } = data[0];
      if (Status !== 'Success' || !PostOffice || PostOffice.length === 0) {
        const err = new Error(`Pincode API Failed:${Message}`);
        err.status = 404;
        throw err;
      }
      return PostOffice[0]

    } catch (err) {
      if (err.status) throw err;
      const err1 = new Error("Pincode Api Failed");
      err1.status = 502;
      throw err1;
    }
  }

  // async function pincodeToLatLon(pin) {
  //   console.log("hi")
  //   const loc = await pincodeConverter(pin);
  //   console.log("bye")
  // console.log(loc)
  //   const searchText = `${loc.Name}, ${loc.District}, ${loc.State}, India`;

  //   const res = await axios.get("http://api.geonames.org/searchJSON", {
  //     params: {
  //       q: searchText,
  //       maxRows: 1,
  //       username: 'uzfahath_49'
  //     }
  //   });

  //   const geo = res.data.geonames[0];

  //   if (!geo) throw new Error("Coordinates not found");

  //   return [{
  //     name: loc.Name,
  //     district: loc.District,
  //     state: loc.State,
  //     lat: geo.lat,
  //     lon: geo.lng
  //   }];
  // }

  //--------------------------------functions end-------



  //get state by country (using countrycode)
  this.on('getCountry', async (req) => {
    const country = req.data.country;
    if (!country) {
      return req.error(400, "Country is Required");
    }
    const countrycode = await countryCode(country, req)
    if (!countrycode) {
      return req.error(404, "No such country present");
    }
    const response = await countryAPI.send({
      method: "GET",
      path: `/countries/${countrycode}/states`,
      headers: { "X-CSCAPI-KEY": process.env.CSC_API_KEY }
    })
    return response.map(({ name, latitude, longitude }) => ({
      state: name,
      latitude,
      longitude,
    }))
  });




  this.on('getState', async (req) => {
    const state = req.data.name;

    if (!state) return req.error(400, "State required");

    try {
      const results = await getDistrictsByState(state);
      return results;
    } catch (err) {
      return req.error(404, err.message)
    }
  })


  // Geo + Pincode
  this.on('getMap', async (req) => {
    let name = req.data.loc;
    if (!name) return req.error(400, "Invalid Input");

    try {
      const pincodeVerifier = !isNaN(Number(name));
      if (pincodeVerifier) {
        name = await pincodeConverter(name);
        console.log(name)
        name = name?.District;
        console.log(name)
      }
      const data = await geo.send({
        method: "GET",
        path: `/v1/search?name=${name}&language=en&format=json`
      })
      const results = data?.results;
      if (!data || results.length === 0) {
        return req.error(404, "Location not found");
      }
      const result = results.reduce((accu, { name, latitude, longitude, country, admin1 }) => {
        accu.push({ name, latitude, longitude, country, state: admin1 });
        return accu;
      }, []);
      return result;
    } catch (err) {
      const status = err.status;
      const message = err.message;
      return req.error(status || 502, message || "Internal Server Error");
    }
  })


  //Get Single District
  this.on('getDistrict', async (req) => {
    const { district } = req.data;

    if (!district) return req.error(400, "District required");

    try {
      return await getDistrict(district);
    } catch (err) {
      return req.error(404, err.message);
    }
  });

  //getAddress
  this.on('getAddresses', async (req) => {
    const { state, district, pincode, address } = req.data;
    if (!state && !district && !pincode && !address) {
      return req.error(400, "Any one Field Required")
    }

    if (state && !district && !pincode && !address) {
      const response = await getState(state);

      if (!response) return req.error(404, "State not found");
      return [{
        name: response.name,
        lat: response.lat,
        lon: response.lng
      }];

    }
    if (!state && district && !pincode && !address) {
      const response = await getDistrict(district);
      return response;
    }
    if (!state && !district && pincode && !address) {
      const response = await pincodeConverter(pincode);
      // console.log(response.District)
      let district = response.District;
      const result = await getDistrict(district);
      return result;
    }
    if (state && district && pincode && address) {
      const searchText = [
        address, district, state, pincode
      ].filter(Boolean).join(", ");
      // console.log(searchText)
      let output = await getLocation(searchText, req);
      return output;
    }
  })

  async function getLocation(searchText, req) {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: searchText,
          format: "json",
          addressdetails: 1,
          limit: 1
        },
        headers: {
          "User-Agent": "my-app"
        }
      }
    );

    if (!response || !response.data.length === 0) {
      return req.error(404, "No Address Found")
    }
    return response.data.map(({ address, name, lat, lon }) => {
      let city = address?.city.slice(0, address.city.indexOf(" "));
      return {
        addressLine: name,
        city,
        district: city + " district",
        state: address.state,
        pincode: address.postalCode,
        lat,
        lon
      }
    })
  }
})


// {
//    "state":"Tamil Nadu",
//    "district":"Chennai",
//    "pincode":"600089",
//    "address":"DLF Ramapuram"
// }
