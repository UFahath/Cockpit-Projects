const cds = require('@sap/cds');
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const logger = cds.log('Books');
module.exports = cds.service.impl(function () {

    const { Books, Authors, Categories } = this.entities;

    //1)Select all Books
    //2)Select title and Price
    //3)Select books with stock > 5 
    //4)Select books where price BETWEEN 200 AND 500
    //5)Select books where title contains "SAP"
    //6)Select books where title ends with "Basics".
    // 8) Books with price > 100 AND stock < 10.
    // 9)Books in category "Fiction" OR "Science"
    // 10)Books NOT in category "History".
    // 11)Books with price < 100 OR stock < 5.
    //12)Books with stock >= 10 AND (price < 500 OR category.name = 'Science').
    //13)Books with price > 100 AND stock < 10 .
    // 14) Books with stock >=10 AND (price < 500 OR category='Science') .
    this.on('READ', Books, async (req) => {
        const data = await SELECT.from(Books).columns('*',{author:['name']})
        //   const data = await SELECT.from(Books);
        //  const data = await UPDATE(Books).set({price:Books.price-(Books.price*(percentage/100))}).where({ID:bookId});
        //   const data = await SELECT.from(Books).columns('title','price');
        //   const data = await SELECT.from(Books).where({stock:{'>':5}});
        //   const data = await SELECT.from(Books).where({price:{between:[200,500]}});
        //  const data = await SELECT.from(Books).where({ price: {">=":200,"<=":500 } });
        // const data = await SELECT.from(Books).where({title:{like:"%SAP%"}});
        //   const data = await SELECT.from(Books).where({title:{like:"%Basics"}});
        // const data = await SELECT.from(Books).where([{ref:['price']},'>','100','and',{ref:['stock']},'<','10']);
        // const data = await SELECT.from(Books).where([{ref:['price']},'>=','1000','and',{ref:['stock']},'<','10']);
        //    const data = await SELECT.from(Books).where([
        //     {ref:['category_name']},'like',{val:'%Fiction%'},
        //     'or',
        //     {ref:['category_name']},'like',{val:'%Science%'}
        // ])    
        //  const data = await SELECT.from(Books).where({category_name:{'!=':'History'}});
        // const data = await SELECT.from(Books).where([{ref:['price']},'<',{val:'100'},'or',{ref:['stock']},'<',{val:'5'}])
        //    logger.info(data);

        // const data = await SELECT.from(Books).where([{ref:['price']},'>',{val:'800'},'and',{ref:['stock']},'<',{val:'10'}])
        // const data = await SELECT.from(Books).where`
        // stock>=${10} and (price<${200} or category = ${'Science'})
        // `

        // const data = await SELECT.from(Books).where`
        // category_name IN (${'Fiction'},${'Science'})
        // `
        // const data = await SELECT.from(Books)
        return data;
    });


    this.on('READ', Authors, async (_) => {
        //7)Select authors whose name contains "Smith" or "Miller".
        //8)List all books with their author names.
        // const data = await SELECT.from(Authors).where([
        //     { ref: ['name'] }, 'like', { val: '%Smith%' },
        //     'or'
        //     , { ref: ['name'] }, 'like', { val: '%Miller%' }])
        // return data;

        // const data = await SELECT.from(Authors)
    })

    this.on('READ', Categories, async (_) => {
        //8)Select categories whose description contains "technical".
        const data = await SELECT.from(Categories).where({ description: { like: "%technical%" } });
        return data;
    })




    //Bound Action
    this.on('applyDiscount', async (req) => {
        const bookId = req?.params[0]?.ID;
        const percentage = req.data.percentage;
        let data = await UPDATE('Books').set({ price: { '-=': { '*': [{ ref: ['price'] }, percentage / 100] } } }).where({ ID: bookId });
   
     console.log(data)
        return await SELECT.from('Books');
    })
});