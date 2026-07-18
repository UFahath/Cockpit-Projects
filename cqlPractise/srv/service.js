const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');


//Service Reuse Pattern------------------------------------
   let srv2;
  async function getService(){
   if(!srv2){
       srv2=await cds.connect.to('DummyService')
   };
   return srv2;
}
//-----------------------------------------------------------------
module.exports = cds.service.impl(async function(){

   console.log('Service Name::',this.name)
   if(this.name==='DummyService'){
     const {Departments} = this.entities;
    this.before('*',async(req)=>{
      console.log(req.method)
      console.log(req.event);
      // console.log(req.target.projection.from.ref[0]);
      // console.log(req.target.elements)

      //Count Total Field in the Entity
      let totalFieldinthetargetEntity = Object.entries(req.target.elements).reduce((count)=>{
             count+=1;
             return count;
      },0)

      //Field and Data Type
      let fields = Object.entries(req.target.elements).map(([field,def])=>{
         return {
            field,
            type:def.type
         }
      });
   //   console.log(Object.entries(req.target.elements))
      //Seperate Key fields
      let keyFieldSeperation = Object.entries(req.target.elements).reduce((field,[fieldName,def])=>{
       
         if(def.key){
              field.keyFields.push(fieldName);
         }else{
            field.nonKeyFields.push(fieldName);
         };
         return field;
      },{keyFields:[],nonKeyFields:[]});
      console.log("Key Fields And Non Key Fields::",keyFieldSeperation)
      console.log("Fields and data types::",fields);
      console.log("Total Field in the Entity::",totalFieldinthetargetEntity);
      

      //Wrapper Pattern
      this.handlers.on.forEach((h)=>{
         let original = h.handler;
         h.handler=async(req)=>{
            let start = Date.now();
            console.log("----------------")
            console.log(this)
              console.log("----------------")
            let result = await original.call(this,req);
            console.log(`${req.target.name.split('.')[1]} ${h.on} took  ${Date.now()-start} ms`);
            return result;
         }
      });


      console.log(req.query)
      console.log(this.name)
    })
    this.on('READ',Departments,async(req)=>{
       const result = await SELECT.from(Departments);
       
       return result;
      // let requests = [];
      // for(let i = 0 ;i<300;i++){
      //    requests.push(this.run(SELECT.from(Departments)));
      // }
      // const promiseForFakeRequest = await Promise.all(requests);
      // console.log("Total Response Length",promiseForFakeRequest.length);
      // return await SELECT.from(Departments)
     
   });

  
   }else{
       let secondService = await getService();
   
          const{Departments} = secondService.entities;
     const {Employees} = this.entities;
   //   [ '*', { ref: [ 'department' ], expand: [ '*' ] } ]
     this.on('READ',Employees,async(req)=>{
       let col = req.query.SELECT.columns;
       let association="";
        col.forEach((field)=>{
         if(field.ref && field.expand){
            association=field.ref;
         }
       });
       console.log(association)
       let data = await SELECT.from(Employees);
         let departments = await SELECT.from(Departments);
       return data.map((field,i)=>({
         ...field,
         ...(association!==""&&{department:departments.find((d)=>d.ID===field.department_ID)})
       }));
     })
   }
   

})



//----------------------------------------
 //   this.before('READ',Departments,async(req)=>{
   //    console.log("Before Triggered.....")
   // });
   //   this.before('READ',Departments,async(req)=>{
   //    console.log("Before Triggered 2 nd time.....")
   // });
   //--------------------------------------------------------
   //   console.log("Departments Read Triggered....")
   //   let result = await cds.run(SELECT.from(Departments));
   //   return result;
   //---------------------------------------------------------
    // this.after('READ',Departments,async(result,req)=>{
   //    console.log("Iam from on handler::",result);
   //    console.log("This is from service request::",req)
   // })
   //----------------------------------------------------------














   // console.log(this.name)
   //  console.log(Object.keys(this.entities))
   // const {Employees,Departments,Products,Categories} = this.entities;
   // console.log("Entity::",Employees)
   // console.log("--------------------------------")
   // console.log("Entity::",Departments);







  //   let obj = {};
  //    let data = await SELECT.from(Employees).columns('department.name as department','Avg(salary) as AverageSalaryOfDept','count(department) as departmentCount').groupBy('department');
  //    this.on('READ',Employees,async(req)=>{})
  //    let emp = await SELECT.from(Employees).columns('*','department.name as department');
     
  //    console.log(emp)
  //    for(let {department,salary} of emp){
  //       if(obj.hasOwnProperty(department)){
  //         obj[department].salary+=salary;
  //         obj[department].count+=1;
  //       }else{
  //         obj[department]={salary,count:0}
  //         obj[department].count+=1;
  //       }
  //    }


  //    console.log(obj)

  //   // average
  //   let averageSalaryOfEmployee = emp.filter((e)=>{
  //     return (obj[e.department].salary/obj[e.department].count<e.salary);
  //   })

  // const result = await SELECT.from('employee.Employees as e')
  // .join(
  //   SELECT.from('employee.Employees')
  //     .columns('department_ID', 'avg(salary) as avgSalary')
  //     .groupBy('department_ID')
  // ).on('e.department_ID = department_ID')
  // .columns('e.ID', 'e.name', 'e.salary', 'e.department_ID')
  // .where('e.salary > avgSalary')