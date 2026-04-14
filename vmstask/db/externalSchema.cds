namespace externalAPI.db;
using {API_BUSINESS_PARTNER as BP} from '../srv/external/API_BUSINESS_PARTNER';
entity Customer as projection on BP.A_Customer{
     key Customer,
    CustomerClassification,
    CustomerFullName
}


