sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/ui/model/json/JSONModel'], function (Controller, MessageToast, JSONModel) {
   const AppController = Controller.extend('ui5new1.controller.Dummy', {
      // onInit: function () {

      //    let data = {
      //       firstSection: {
      //          name: "John"
      //       }
      //    }
      //    let jModel = new JSONModel(data);
      //    this.getView().setModel(jModel)
      // },
      // toast: function (oEvent) {
      //    let btnText = this.byId('myBtn');
      //    console.log(btnText)
      //    console.log(oEvent.getSource())
      //    console.log(btnText === oEvent.getSource())
      //    MessageToast.show(btnText.getText())
      // },
      onBack: function () {
         this.getOwnerComponent().getRouter().navTo("Home");
      }
   });

   return AppController;
})