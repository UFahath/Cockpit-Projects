namespace myapp.db;

//one to many

// entity Student{
//     key ID:UUID;
//     name  :String(50);
//     courses:Association to many Courses on courses.student.ID = ID;
// }


// entity Courses{
//     key ID:UUID;
//     subjectName:String(30);
//     student:Association to one Student;
// }


//many to many
// entity Student{
//     key ID:UUID;
//     name :String(30);
//     courses : Association to  many StudentCourse on courses.course.ID = ID;

// }

// entity Course{
//     key ID:UUID;
//     courseName:String(30);
//     students : Association to  many StudentCourse on students.student.ID = ID;
// }



// entity StudentCourse{
//     key student : Association to Student;
//     key course  : Association to Course;
// }




// entity Order{
//     key ID:UUID;
//     item :Composition of  many OrderItem;

// }

// entity OrderItem{
//    key ID:UUID;
//    product:String;
//    order:Association to Order;
// }

entity Order{
    key ID:UUID;
    junction :Composition of  many Product on junction.order.ID=ID;

}

entity OrderItem{
   key ID:UUID;
   product:String;
}

entity Product{
    key order:Association to Order;
    key orderItem: Association to OrderItem;
}

