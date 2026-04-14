using {dblayer.db as db} from '../db/schema';

@impl:'./rat-service.js'
service srvLayer{

    // entity srventity as select from db.schemaentity1{
    //     count(*) as total
    // };

// Q1

// Create a service view:

// Name: AllContacts
// Show all fields

// Q4

// Create:
// 3. Filter records

// 👉 Show only people whose name is 'Arun Kumar'

// Add new column:
// country = 'India'
    entity srventity as select from db.schemaentity1;
    // entity srventity as select from db.schemaentity1 where name = 'Neha Kapoor';
    entity srventity1 as select from srventity{
        name,
        phoneNo as customerPhoneno,
        12 as Status:Integer
    }


    entity question1 as select from srventity;

    entity question4 as select from srventity {
        *,
        'India' as country:String
    }


    entity  question5 as select from srventity where name = 'Arun Kumar';

     entity filter_1 as select from srventity {
        *,
        18 as age :Integer

  }
    entity  question_6 as select from srventity where name like 'A%';
    entity  question_7 as select from srventity order by  name desc;
    entity question_8 as select from srventity {
        *,
       '+91'|| phoneNo as phoneNo
    }
    entity question_9 as select from srventity{
        *,
        price+500 as updated_price
    }

    entity question_10 as select from srventity{
     sum(price) as TotalSum,
     max(price) as max_price,
     min(price) as min_price,
     count(price) as no_ofoprice,
     avg(price) as average_price
    } 


  entity question_11 as select from srventity{
    
  } group by price;

}

 