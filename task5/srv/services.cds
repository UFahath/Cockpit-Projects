using {employee.db as db} from '../db/schema';


service EmployeeWorksheetService{
  entity Worksheet as projection on db.externalTimeSheet;
  entity Employee as projection on db.Employee;
  // entity dummyTest as select from Employee inner join Worksheet on Employee.ID = Worksheet.PersonWorkAgreementExternalID{
  //   Worksheet.*,Employee.Dept
  // } 
  action replicateTimeSheet();
}