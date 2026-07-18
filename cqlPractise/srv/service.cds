using my.model as db from '../db/schema';

//1
service EmployeeService {

  entity Employees as select from db.Employees {
  *,
  department
};

    // entity Departments as projection on db.Departments;

    entity Products as projection on db.Products;

    entity Categories as projection on db.Categories;


}

//2
service DummyService{
    entity dummy as projection on db.Employees;
    entity Departments as projection on db.Departments;
}