using {myapp.db as db} from '../db/empPasDb';

service Travel{
    entity Employee as projection on db.Employee;
    entity Passport as projection on db.Passport;
    entity Department as projection on db.Department;
    entity Laptop as projection on db.Laptop;
}