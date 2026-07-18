// // service GetWeather{
// //     function getWeatherData(location:String) returns String;
// // }
// using {myapp.db as db} from '../db/schema';
// // using {API_SALES_ORDER_SRV as external} from './external/API_SALES_ORDER_SRV';


// service S4{
//     // entity SalesOrderHeader as projection on external.A_SalesOrder;
//      entity SalesOrderHeader as projection on db.SalesOrderHeader;
//        function getWeatherData(location:String) returns String;
// }


using { myapp.db as db } from '../db/schema';
using {API_SALES_ORDER_SRV as  s4} from './external/API_SALES_ORDER_SRV';

service MyService {


@readonly
entity SalesOrderHeader as projection on db.SalesOrderHeader;


entity SalesOrderView as projection on SalesOrderHeader{
         key  SalesOrder 
};

entity Employee as projection on db.Employee;
action createDept(id:String,deptName:String) returns String;
@cds.persistence.table:true
entity externalSalesOrderHeader as projection on s4.A_SalesOrder{
   key  SalesOrder ,    
        SoldToParty ,
        SalesOrderDate,
        TotalNetAmount,
        TransactionCurrency
}

action createSalesOrder( SalesOrder : String,
        SoldToParty : String,
        SalesOrderDate : Date,
        TotalNetAmount : Decimal(15,2),
        TransactionCurrency : String) returns String;


        action applyCriticality() returns String;

}




