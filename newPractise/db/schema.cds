namespace my.app;

entity Books {
  key ID                    : String;
      title                 : String(100);
      author                : String(100);
      price                 : Decimal(9, 2);
      stock                 : Integer;
      createdAt             : Timestamp;
      modifiedAt            : Timestamp;
      virtual availablity : String;
};
