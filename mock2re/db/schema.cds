namespace myapp.db;
using{cuid} from '@sap/cds/common';

entity User{
   key ID:String;
   customerName:String(30) not null;
   role:Association to many UserRole on role.user = $self;

}

entity Role{
    key ID:String;
    role:String(19) not null;
    user:Association to many UserRole on user.role = $self;
}


entity UserRole{
    key user:Association to User;
    key role:Association to Role;
}