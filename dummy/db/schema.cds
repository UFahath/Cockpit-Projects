// namespace myapp.db;
// using {cuid,managed} from '@sap/cds/common';

// entity Author : cuid,managed{
//     title:String;
// }

// entity Book : cuid,managed{
//     name:String;
//     author:Association to Author;
// }


namespace my.company;
 
using { managed, cuid } from '@sap/cds/common';
 
// -----------------------------
// Departments
// -----------------------------
// entity Departments : cuid, managed {
//     DeptName   : String(100);
//     Location   : String(100);
//     Employees  : Association to many Employees on Employees.DepartmentID = $self;
//     Projects   : Association to many Projects on Projects.DeptID = $self;
// }
 
// -----------------------------
// Employees
// -----------------------------
// entity Employees : cuid, managed {
//     Name         : String(100);
//     Age          : Integer;
//     Email        : String(255);
//     Salary       : Decimal(15,2);
//     IsActive     : Boolean;
//     DepartmentID : Association to Departments;
// }
 
// -----------------------------
// Projects
// -----------------------------
// entity Projects : cuid, managed {
//     ProjectName : String(100);
//     DeptID      : Association to Departments;
//     Budget      : Decimal(15,2);
// }

// entity PurchaseOrders {
//   key ID        : String(9);
//   vendor        : String;
//   amount        : Integer;
//   currency      : String;
//   status        : String;
//   isUrgent      : Boolean;
//   createdBy     : String;
// }