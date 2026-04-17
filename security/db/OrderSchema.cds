namespace myapp.db;
using {managed} from '@sap/cds/common';

entity Order:managed{
   key ID:UUID;
   orderNumber:String(10);
   customerName:String(100);
   status:String(20);
}