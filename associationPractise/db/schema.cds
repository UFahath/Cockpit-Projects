namespace myapp.db;
type EnrollmentStatus : String enum {
      ENROLLED = 'Enrolled';
      WAITLISTED = 'Waitlisted';
      PENDING = 'Pending';
      DROPPED = 'Dropped';
};

entity Student{
         key ID:UUID;
         name:String;
         degree:String;
         college:String;
         location:String;
         virtual courseName:String;
         courses:Composition of many StudentCourse on courses.student =$self;
         }
entity Course{
          key ID:UUID;
          name:String;
          teacher:Association to Teacher;
          assignments:Composition of many Assignment on assignments.course =$self;
          students:Association to many StudentCourse on students.course = $self;
          }
entity StudentCourse{
          key student:Association to Student;
          key course :Association to Course;
          enrollmentDate:Date;
          status:EnrollmentStatus;
                  }
    entity Teacher{
               key ID:UUID;
               name:String;
               courses:Association to many Course on courses.teacher = $self;
}

entity Assignment{
        key ID:UUID;
        title:String;
        course:Association to Course;
        dueDate:Date;
        maxMarks:Integer;
          }