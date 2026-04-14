namespace myapp.db;
using {Country} from '@sap/cds/common';


entity Employee{
  key ID:String;
  name:String;
  email:String(255);
  status:String ;
  passport_ID:String @cds.unique;
  passport:Association to  one Passport on passport.ID = passport_ID;
  department:Association to one Department;
  laptop:Association to one Laptop;
}


entity Passport{
    key ID:String;
    number:Integer;
    country:Country;
  employee: Association to one Employee;
}

entity Department{
    key ID:String;
    name:String;
    code:String;
    descr:String;
    employees:Association to many Employee on employees.department=$self; 
    // employee:Association to one Employee;
}


entity Laptop{
        key ID:String;
        brand:String;
        price:Decimal(7,2);
        }
