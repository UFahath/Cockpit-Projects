using {myapp.db as db} from '../db/schema';

service UserPermissionService{
    entity Users as projection on db.User;
    entity Roles as projection on db.Role;
    entity UserRoles as projection on db.UserRole;
}