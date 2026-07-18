namespace myapp.db;
// using {API_SALES_ORDER_SRV as external} from '../srv/external/API_SALES_ORDER_SRV';
// 
// @cds.persistence.table:true
// as projection on external.A_SalesOrder
entity SalesOrderHeader {
    key SalesOrder            : String @readonly;
        SoldToParty          : String;
        SalesOrderDate       : Date;
        TotalNetAmount       : Decimal;
        TransactionCurrency  : String;
        MyCriticality: Integer;
    virtual TotalSales:Integer;
}

entity Employee{
    key id:String;
    name:String;
    department:Association to one Department;
}

@cds.autoexpose
entity Department{
    key id:String;
    deptName:String;
}



















