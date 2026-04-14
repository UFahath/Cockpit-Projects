service MyService {
    function getMap(loc: String) returns array of {
        name      : String;
        latitude  : Decimal;
        longitude : Decimal;
        country   : String;
        state     : String;
    };

    function getCountry(country: String)returns array of {
        state : String;
        lat   : Decimal;
        lon   : Decimal;
    }

    function getState(name: String)returns array of {
        district : String;
        lat      : Decimal;
        lon      : Decimal;
    }

    function getDistrict(district: String)returns array of {
        district : String;
        lat      : Decimal;
        lon      : Decimal;
    }


    function getAddresses(state: String, district: String, pincode: String, address: String) returns array of {
        addressLine : String;
        city        : String;
        district    : String;
        state       : String;
        pincode     : String;
        lat         : Decimal;
        lon         : Decimal;
    }
}