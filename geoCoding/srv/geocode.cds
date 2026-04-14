using from './external/geocoding_api';


service Geoapi {

  function getCoordinates(address: String) returns {
    latitude  : Double;
    longitude : Double;
    state     : String;
    location  : String;
  };

}
