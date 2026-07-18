namespace myapp.db;
using {cuid,managed,temporal} from '@sap/cds/common';
// context Company {
//         // @cds.autoexpose:true
//     entity Employee {
//         ID        : UUID;
//         name      : String;
//         isMarried : Boolean;
//         Des       : LargeString;
//         date1     : Date;
//         date2     : Timestamp;
//         age       : Integer;
//     }
//     extend entity Employee {
//         extraField:String;
//     }

//     entity DeptDetails:cuid{
//       dummyDate:Date @cds.on.insert:$now;
//     }
// }




//Association
context Relations1{
    //1 to 1
    // Employee ↔ Laptop
    // @cds.autoexpose
 
    entity Employee{
        key ID:String;
        name:String(30);
        salary:Integer;
        // laptop_ID:UUID;
        laptop:Association to Laptop @assert.target;
        dept:Association to Department;
    };
    @cds.autoexpose
    entity Laptop{
        key ID:String;
        laptopName:String(25) @cds.search;
    }

    annotate Relations1.Laptop with @assert.unique:{
        uniqueName:[laptopName]
    };
    
    entity Department{
        key ID:String;
        deptName:String;
        employees:Association to many Employee on employees.dept = $self;
    }
}
