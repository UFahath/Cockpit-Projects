namespace myapp.db;

entity Employee {
  key ID        : UUID;
      name      : String;
      email     : String @title:'Email';
      ApproveStatus:String;
      leaves    :Association to many LeaveRequest on leaves.employee = $self;
}

entity LeaveRequest {
  key ID        : UUID;
      employee  : Association to Employee;
      fromDate  : Date;
      toDate    : Date;
      reason    : String;
      status    : String; 
}


entity approveStatus{
    key code : String;
    status:String;
}