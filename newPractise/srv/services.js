
const cds = require('@sap/cds');
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const logger = cds.log('Books');
module.exports = cds.service.impl(function () {
   const { Books } = this.entities;
   // logger(Books);


   // this.on('addBook', Books, async (req) => {6olk,
   //    console.log("requsted")
   // })
   //Before Create
   this.before('CREATE', Books, async (req) => {
      // logger(req.method);
      const { title, price } = req.data;

      //Task 1 && 2
      if (!title) {
         return req.reject(400, "title is Empty");
      }

      if (price <= 0) {
         return req.reject(400, "Invalid Price");
      }

      // await next();
      const count = await SELECT.from(Books);
      req.data.ID = count.length + 1;

      (!req.data.hasOwnProperty('createdAt')) && (req.data.createdAt = new Date().toISOString());
      (!req.data.hasOwnProperty('modifiedAt')) && (req.data.modifiedAt = new Date().toISOString());

   });



   //Before Delete
   this.before('DELETE', Books, async (req) => {
      const { ID } = req.params?.[0] || {};

      //select matching record
      const matchingRecord = await SELECT.one.from(Books).where({ ID });
      (!matchingRecord) && req.reject(404, "No Matching Records Found");

      //extract stock
      const { stock } = matchingRecord;
      (stock > 0) && req.reject(403, "Operation not Allowed");
   })


   // Before Update or Create
   this.before(['CREATE', 'UPDATE'], Books, async (req) => {
      req.data.title = req.data.title.trim().toUpperCase();
   });

 //control creation 
   this.on('CREATE', Books, async (req, next) => {
      if (req.data.stock < 0) return req.reject(403, "Action not Allowed");
      return next();
   })

   //On Read
   this.on('READ', Books, async (req, next) => {
      try{
      const discount = req.query?.discount;
      let data = await next();
      if (Array.isArray(data) && discount === 'true') {
         let modified = data.map(obj => {
            let { price } = obj;
            price = price * 0.9;
            obj.price = price;
            return obj;
         })
         return modified;
      }
      return data;
   }catch(err)
   {
      logger(err.message)
   }
   
   });


   //applyDiscountToAll(unbound)
   this.on('applyDiscountToAll', async (req) => {
      const { percentage } = req.data;
      if (percentage === undefined) return req.reject(400, 'Invalid Percentage');

      // const data = await SELECT.from('Books');
      // for (let book of data) {
      //    await UPDATE('Books').set({ price: book.price - (book.price * (percentage / 100)) }).where({ ID: book.ID });
      // } 

      //Not working with sqllite
      // const tx = cds.tx(req);
      // await tx.run( UPDATE('Books').set(
      //    {price:{'-=':{'*':['price',percentage/100]}}
      // }));

      const tx = cds.tx(req);
      const data = await tx.run(SELECT.from('Books'));
      for (let book of data) {
         await tx.run(UPDATE('Books').set({ price: book.price - (book.price * (percentage / 100)) }).where({ ID: book.ID }));
      }

      await tx.commit();
      return "Discount Successfully Applied For All Books";
   })


  

      //log creation
   this.after('CREATE',Books,(result)=>{
      result ?logger.info(`Book Create With ID: ${result.ID}`):logger.info('undefined');
   })

   //field creation
   this.after('READ', Books,  (result) => {
      result.forEach(book => {
         book.availablity = `${book.stock > 0 ? 'In_Stock' : 'Not In Stock'}`;
         book.price = `₹ ${book.price.toFixed(2)}`;
      });
   });






})