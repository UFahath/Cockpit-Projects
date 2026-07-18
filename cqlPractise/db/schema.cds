namespace my.model;

entity Departments {
    key ID          : UUID;
        name        : String;
}

entity Employees {
    key ID          : UUID;
        name        : String;
        email       : String;
        salary      : Integer;
        department  : Association to Departments;
}

entity Categories {
    key ID          : UUID;
        name        : String;
}

entity Products {
    key ID          : UUID;
        name        : String;
        price       : Integer;
        category    : Association to Categories;
}