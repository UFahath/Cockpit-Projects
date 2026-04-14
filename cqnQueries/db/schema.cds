namespace my.app.db;

entity Authors {
  key ID      : String;
      name    : String;
      country : String;
      books   : Association to many Books on books.author = $self;
}

entity Categories {
  key name        : String;
      description : String;
      books       : Association to many Books on books.category = $self;
}

entity Books {
  key ID        : String;
      title     : String;
      author    : Association to Authors;
      price     : Decimal(10,2);
      stock     : Integer;
      category  : Association to Categories;
      published : Date;
      orders    : Association to many Orders on orders.book = $self;
}

entity Orders {
  key ID        : UUID;
      book      : Association to Books;
      quantity  : Integer;
      orderDate : Date;
}