namespace myapp.db;


type leaveStatus:String enum{
    PENDING = 'Pending';
    APPROVED = 'Approved';
    REJECTED = 'Rejected';
}
entity Employee{
    key ID:UUID;
    name:String;
    email:String;
    leaves:Composition of  many LeaveRequest on leaves.employee = $self;
}

entity LeaveRequest{
    key ID:UUID;
    fromDate:Date not null;
    toDate:Date not null;
    reason:String not null;
    status:leaveStatus @assert.range:['Pending','Approved','Rejected'];
    employee:Association to one Employee;
}