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

// entity Order{
//     key ID:UUID;
//     junction :Composition of  many Product on junction.order.ID=ID;

// }

// entity OrderItem{
//    key ID:UUID;
//    product:String;
// }

// entity Product{
//     key order:Association to Order;
//     key orderItem: Association to OrderItem;
// }


//One to one using Association
// entity User{
//     key ID:UUID;
//     email:String(255);
//     password:String(6);
//     profile_ID:UUID;
//     profile :Association to one Profile on profile.ID = profile_ID;
// }


// entity Profile{
//     key ID:UUID;
//     name:String(30);
//     age:UInt8;
//     phoneNo:String(10);
// }


// annotate User with @assert.unique.profile_ID:[profile_ID];



//one to many
// entity Profile{
//     key ID:UUID;
//     name:String(30);
//     age:UInt8;
//     phoneNo:String(10);
//     orders: Association to many Order on orders.profile = $self;
// }
// entity Order{
//     key ID:UUID;
//     profile:Association to Profile;
// }


// Perfect Interview Answer
//  Say this:

// “This is a one-to-many relationship where one Profile can have multiple Orders.
// The foreign key is stored in the child entity (Order) as profile_ID.
// Multiple orders can reference the same profile_ID, which establishes the one-to-many relationship.”


//many to many
entity Product{
    key ID:UUID;
    productName:String(30) not null;
    orders:Association to many OrderItem on orders.product = $self;
}

entity Order{
    key ID:UUID;
    orderDate:Date;
    products:composition of many OrderItem on products.order = $self;
}

entity OrderItem{
   key product:Association to Product;
   key order:Association to Order;
}

//