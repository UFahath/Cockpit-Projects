using {myapp.db as db} from '../db/schema';

service Practise1{
    // entity Students as projection on db.Student{
    //     *,advisor.dept
    // };

    
    // entity Advisor as projection on db.Advisor;
    // entity Students as select from db.Student as s inner join db.Advisor as a on s.advisor_ID =a.ID{
    //     s.*,
    //     a.dept
    // }
    
    // entity Enrollment as projection on db.Enrollment;
}


// service Practise2{
//     entity Employee as projection on db.Employee;
//     entity Passport as projection on db.Passport;
//     entity EmployeeWithPassport as projection on Employee{
//         ID,
//         name,
//         passports
//     }
// }


// service Practise3{
//     entity Employee as projection on db.Employee;
//     entity Project as projection on db.Project;
//     entity EmployeeProject as projection on db.EmployeeProject;
// }


service Practise4{
    entity Student as projection on db.Student;
    entity Course as projection on db.Course;
    entity StudentCourse as projection on db.StudentCourse;
    entity Teacher as projection on db.Teacher;
    entity Assignment as projection on db.Assignment;
    
}