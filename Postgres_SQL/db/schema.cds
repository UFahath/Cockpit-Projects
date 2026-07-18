namespace myapp.db;

type Client_number:String(10);
type Client_Address{
    doorno:String(3);
    Address:String(30)
}
entity  Client{
    key Client_ID:Integer;
    Client_name:String;
    Client_mail_id:String;
    Phone_Number:Client_number;
    Address:Client_Address;
    Client_Branch:array of String;
}

type EffectiveSignature:projection on Client{
    Client_name
}

entity TypeProjection {
    key ID:UUID;
    Client_name:EffectiveSignature;
}
