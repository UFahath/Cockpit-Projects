using {myapp.db as db} from '../db/schema';

service LeaveRequestService @(path:'LeaveService'){
    entity Employees as projection on db.Employee actions{
          action approve(ID:String) returns String;
    };
    entity LeaveRequest as projection on db.LeaveRequest;
  
}