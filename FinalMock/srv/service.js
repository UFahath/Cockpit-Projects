const cds = require('@sap/cds');
const {RED} = cds.utils.colors
const LOG = cds.log('error',{level:'debug'});
const { SELECT, INSERT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const obj = require('@sap-cloud-sdk/connectivity');

module.exports = cds.service.impl(function(){
    const {Employees,Department,getTotalEmployee} = this.entities;



    //bound action
    this.on('getTotalEmployee',async(req)=>{
         let totalEmployee = await SELECT.from(Employees);
         let information = `Total Employee Length::${totalEmployee.length}`
         req.info(information);
         return information;
    });


    this.before('READ','Departments',async(req)=>{
      console.log("hi")
    })
   

    this.on('userAUpdate',async(req)=>{
        console.log("UserA START", Date.now());
        const ID = req.data.ID;

        let data;
        let user = await SELECT.one.from(Employees).where({ID})
        console.log("ID::",user.ID)
           await new Promise(r => setTimeout(r, 25000));
            data = await UPDATE(Employees).set({name:'Sebastin'}).where({ID:user.ID});
            console.log("UserA::",data)
        console.log("UserA End", Date.now());
        // console.log(ID)
    })


    this.on('userBUpdate',async(req)=>{
        console.log("UserB START", Date.now());
         const ID = req.data.ID;
        let data;
        let user = await SELECT.one.from(Employees).where({ID})
            data = await UPDATE(Employees).set({name:'Murugan'}).where({ID:user.ID});
            console.log("UserB::",data);
            console.log("UserB End", Date.now());
    })

   //query Practise
   this.on('READ',Department,async(req,next)=>{
     let isBeforePresent = false;
     console.log(this.handlers.before)
     for(let events of this.handlers.before){
       if(events.before==='READ'&&events.path==='MyService.Departments'){
        isBeforePresent = true;
       }
     }
     console.log(isBeforePresent)
    const result = await SELECT.from(Department).columns((d)=>{
      d.ID.as('DepartmentID'),
      d.deptName.as('DepartmentName'),
      d.employees(e=>{
        e.ID,
        e.name 
      });

      // console.log(cds.env)
    })
  //   //from Variant
  // const result = await 
  // SELECT.from(Employees).columns(e => {
  //   e.ID,
  //   e.name,
  //   e.salary,
  //   e.laptop.laptopName.as('LaptopName')
  // }).where({salary:{'>=':2000}}).and({salary:{'<=':4000}});




  //With or
  //  const result = await 
  // SELECT.from(Employees).columns(e => {
  //   e.ID,
  //   e.name,
  //   e.laptop.laptopName.as('LaptopName')
  // }).where({ID:'E002'}).or({name:'David'});


  //With and
  // const result = await 
  // SELECT.from(Employees).columns(e => {
  //   e.ID,
  //   e.name,
  //   e.laptop.laptopName.as('LaptopName')
  // }).where({'laptop.laptopName':'HP'}).and({name:'Murugan'});


  //With in
  // const result = await 
  // SELECT.from(Employees).columns(e => {
  //   e.ID,
  //   e.name,
  //   e.laptop.laptopName.as('LaptopName')
  // }).where({name:{in:['Murugan','David']}})


  //With limit
  // const result = await 
  // SELECT.from(Employees).columns(e => {
  //   e.ID,
  //   e.name,
  //   e.laptop.laptopName.as('LaptopName')
  // }).limit(3);

  //With order
  // const result = await 
  // SELECT.from(Employees).columns(e => {
  //   e.ID,
  //   e.name,
  //   e.salary,
  //   e.laptop.laptopName.as('LaptopName')
  // }).orderBy('salary desc');

  //With Like
  // const result = await 
  // SELECT.from(Employees).columns(e => {
  //   e.ID,
  //   e.name,
  //   e.salary,
  //   e.laptop.laptopName.as('LaptopName')
  // }).where({name:{like:'M%'}})


  //with between
  //  const result = await 
  // SELECT.from(Employees).columns(e => {
  //   e.ID,
  //   e.name,
  //   e.salary,
  //   e.laptop.laptopName.as('LaptopName')
  // }).where({salary:{'>=':2000}}).and({salary:{'<=':4000}});

    // let start = Date.now();
    // let output = await obj.getDestination({destinationName:'Northwind'});
    // console.log(output);
    // console.log(`End::${Date.now()-start} ms`)

  console.time("destination1");
const d1 = await obj.getDestination({ destinationName: 'Northwind' });
console.log(d1)
console.timeEnd("destination1");

// console.time("dest2");
// const d2 = await obj.getDestination({ destinationName: 'Northwind' });
// console.timeEnd("dest2");

// console.log("Same object?", d1 === d2);
console.log("I am the First one")
    return next() ;
   })
   //""
   this.on('READ',Department,async(next)=>{
    console.log(this.handlers);
     console.log("I am Second On")
     return next()
   })

   this.on("getDepartment",async(req)=>{
    console.log("dummy");
   })

   this.on('CREATE','*',async(req)=>{
    console.log(req.query);
   })
    //data migrate
    this.on('dataMigrate',async(req)=>{
        const sqlite = await cds.connect.to('sqlite');
        const db = await cds.connect.to('db');
          const Employee = cds.entities['myapp.db.Relations1.Employee'];
          const EmployeeFromhana = 'myapp_db_Relations1_Employee'
        let sqlitedata = await sqlite.run(SELECT.from(Employee));
        // console.log(sqlitedata)
        let hanadata = await db.run(SELECT.from(Employee));
        for(let index in sqlitedata){
          let sqliterecord = sqlitedata[index];
          let checkExistance = hanadata.some((h)=>h.ID===sqliterecord.ID);
    
          if(!checkExistance){
            //  console.log("hi")
            await db.run(INSERT.into(EmployeeFromhana).entries(sqliterecord))
          }
        }


        console.log("sqlite data::",sqlitedata);
        console.log("hana data::",hanadata)

    })
    cds.on('error', (err) => {
  console.log('GLOBAL ERROR CAUGHT:', err.message);
});


//
this.on('dummyInput',(req)=>{
  console.log(cds.context.query)
  // console.log(req.query)
  let {name} = req.data;
   if(!name) req.error(400,'Empty Field');
   req.info(name);
   return name;
});

let activeRequests = 0;

this.on('*', async (req, next) => {
  activeRequests++;
  console.log("Active:", activeRequests);
  //  await new Promise((resolve)=>setTimeout(resolve,7000000));

  try {
    return await next();
  } finally {
    activeRequests--;
  }
});

// this.on('READ','*',async(req)=>{
//     // const data = await SELECT.from(Employees);
//  await new Promise((resolve)=>setTimeout(resolve,7000000));
//     const data = await SELECT.one.from(Employees).where({name:{like:'%kumar'}});
//         // LOG.error("hi")
//     console.log("1)end---------------------")
//     // Fetch only employee names and salary
//     // const data1 = await SELECT.from(Employees).columns('name','salary').orderBy('salary desc').limit(1,1)
//     console.log("2)end------------------------------")
//     // Get employees with salary > 4000
//     // const data2 = await SELECT.from(Employees).where({salary:{'>':4000}})
//     console.log("3)end-------------------------")
   
//     return data;
// })
})