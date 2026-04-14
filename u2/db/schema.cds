namespace myapp.db;
using {cuid} from '@sap/cds/common';

entity Orders : cuid {
    orderNumber: String @unique;
    customerID: UUID;
    orderDate: Date;
    deliveryDate: Date;
    status: localized String @title:'{i18n>status}';
    amount: Decimal;
    deliveryMethod:localized String @title:'{i18n>deliveryMethod}';
} 



// {
//   "orderNumber": "ORD-1001",
//   "customerID": "c8b9e3e4-2a3d-4a10-9b7c-8c1f9e54f68b",
//   "orderDate": "2026-04-08",
//   "deliveryDate": "2026-04-10",
//   "status": "NEW",
//   "amount": 1500.75,
//   "deliveryMethod": "PICKUP"
// }