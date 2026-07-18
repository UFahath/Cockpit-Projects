namespace myapp.db;
using {API_SALES_ORDER_SRV as  so} from '../srv/external/API_SALES_ORDER_SRV';

@cds.persistence.table
entity SalesOrderHeader 
  as projection on so.A_SalesOrder {

    key SalesOrder          : String(10),

        SoldToParty         : String(10),

        TotalNetAmount      : Decimal(15,2),

        TransactionCurrency : String(3),

        OverallSDProcessStatus : String(1),

        OverallDeliveryStatus  : String(1),

        CreationDate        : Date,

        RequestedDeliveryDate : Date
}