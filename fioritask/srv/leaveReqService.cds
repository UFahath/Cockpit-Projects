using {myapp.db as db} from '../db/leaveReqSchema';

service LeaveRequestService {
    entity Employees as projection on db.Employee;
    entity LeaveRequest as projection on db.LeaveRequest;
}