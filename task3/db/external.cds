namespace externalAPi.db;
using {API_BUSINESS_PARTNER as db} from '../srv/external/API_BUSINESS_PARTNER';

// @cds.persistence.table
entity EmailAddress as projection on db.A_AddressEmailAddress{
    AddressID,
    Person,
    OrdinalNumber,
    IsDefaultEmailAddress,
    EmailAddress
};

entity ExternalEmailAddress {
    AddressID:String;
    Person:String;
    OrdinalNumber:String;
    IsDefaultEmailAddress:Boolean;
    EmailAddress:String;
}

