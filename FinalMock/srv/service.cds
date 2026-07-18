// using {myapp.db.Company as Company} from '../db/schema';
using {myapp.db.Relations1 as asso} from '../db/schema';



service MyService{
   // entity Employees as projection on Company.Employee;
   // entity DeptDetails as projection on Company.DeptDetails;
   @cds.query.limit.default:4 @cds.redirection.target
   entity Employees as projection on asso.Employee actions {
      action getTotalEmployee() returns String;
   };

   entity Department as projection on asso.Department;
    action userAUpdate(ID:String) returns String;
    action userBUpdate(ID:String) returns String;
    function getDepartment() returns String;
   entity Laptop as projection on asso.Laptop;
   action dataMigrate() returns String;
  action dummyInput(name:String) returns String;
   // . Find employee who uses Dell laptop (hint: laptop_ID)
   entity EmployeeWithDell as select from Employees as e inner join
   Laptop as l on e.laptop.ID=l.ID{
       key e.ID as EmployeeID,
       e.name as EmployeeName,
       l.laptopName as LaptopName
   } order by LaptopName;



   //2)Names of the Employees
entity NamesOfTheEmployee as select from asso.Employee as e{ 
   key e.name as EmployeeName
} where e.name !=null;

    //3)Get Employees using Laptop L002
 entity empWithLaptopL002 as select from asso.Employee as e{
   key e.name,
    e.laptop
 } where e.laptop = 'L002';


 //4) Get Employees who don’t have laptop
  entity empWithoutLaptop as select from asso.Employee as e {
   key  e.name
  } where e.laptop IS null;

  //5)Get distinct laptop IDs used by employees
//   entity distinctId as
//       select distinct laptop from asso.Employee  {
//     laptop 
//   };
//

   //6)Count total employees
   entity totalEmpCount as select from asso.Employee as e{
   key count(e.ID) as TotalEmployees:Integer 
   }

   //7)Count Employees Who have Laptop
   entity empWithLaptopCount as select from asso.Employee as e{
    key count(e.ID) as TotalEmployeesWithLaptop:Integer 
   } where e.laptop IS NOT NULL;
   
   //8)Get employees where name is NULL
   entity detailOFNullEmp as select from asso.Employee as e {
     e.ID as EmployeeID
   } where e.name IS Null;

   //9)Replace NULL employee name with 'Unknown' using CDS
    entity nullEmpReplace as select from asso.Employee as e{
      key  case 
           when e.name IS null
           then 'Unknown'
           else e.name
         end as EmployeeName:String
    }
  
  //10)Show employees with laptop or 'No Laptop Assigned' text
    entity laptopAssignedStatus as select from asso.Employee as e {
      key  e.ID as EmployeeID,
        case
           when name IS NOT NULL
           then name
           else 'Not Registered Name'
        end as EmployeeName:String,
        case 
           when laptop IS NOT NULL
           then e.laptop.laptopName
           else 'Not Assigned'
        end as Laptop:String
    };


    // 11) Find employees with duplicate laptop usage (shared laptops)
       entity employeeWithSameLaptop as select from asso.Employee as e{
       key   count(ID) as empcount:Integer,
         e.name
       } group by e.laptop.ID,e.name having count(ID)>1;

    //12)Their full details
        entity employeeWithSameLaptop1 as select from asso.Employee as e {
       key     e.ID as EmployeeID,
            case 
               when e.name IS NULL
               then 'No Name Registered'
               else e.name
               end as EmployeeName:String,
            e.laptop.laptopName as laptopName
        }
        where e.laptop.ID in (
            select from asso.Employee {
                laptop.ID,
            } group by laptop.ID
              having count(ID)>1
        ) order by e.laptop.laptopName
}





// annotate MyService.Employees with
//     @(UI.LineItem:[
//         {
//             $Type:'UI.DataFieldForAction',
//             Action:'MyService.EntityContainer/userAUpdate',
//             Label:'Change allowed For User A'
//         },
//           {
//             $Type:'UI.DataFieldForAction',
//             Action:'MyService.EntityContainer/userBUpdate',
//             Label:'Change allowed For User B',
//         },
//         // dataMigrate
//         {
//             $Type:'UI.DataFieldForAction',
//             Action:'MyService.EntityContainer/dataMigrate',
//             Label:'dataMigrate',
//         }
//     ]
//     );

//     annotate MyService.Employees with {
//        name @assert:(
//       case
//           when name='David' then 'David Present'
//           end
//     )


    //
    
    // }

    