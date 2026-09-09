sap.ui.define([
    'sap/ui/core/mvc/Controller'
],function(Controller){
    return Controller.extend('ui5new1.controller.App2',{
        onSearch(event){
          let value = event.getParameter('newValue');
        //   console.log(value)
         

        //Get Table
         let table = this.byId('myTable');

         //Get table binding
         let bindingDetail = table.getBinding('items');
          console.log(bindingDetail)
          let applyFilter = [];
           table.removeStyleClass('show');
            table.addStyleClass('fadeEffect');

          if(value && value.length>0){
            let filterneed = new sap.ui.model.Filter(
                'name',
                sap.ui.model.FilterOperator.StartsWith,
                value
            );
            // table.addStyleClass('fadeEffect');
            applyFilter.push(filterneed)
          };
          bindingDetail.filter(applyFilter);
          setTimeout(()=>{
               table.removeStyleClass('fadeEffect');
               table.addStyleClass('show');
          },100)
        }


    })
})