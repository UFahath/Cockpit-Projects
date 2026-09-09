sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/resource/ResourceModel',
    'sap/ui/core/mvc/XMLView'
],function(UIComponent,JSONModel,ResourceModel,XMLView){
    "use strict";
    const component = UIComponent.extend("ui5new1.Component",{
         metadata:{
            "interfaces":["sap.ui.core.IAsyncContentCreation"],
             "manifest":"json"
         },
         init(){
            UIComponent.prototype.init.call(this);
           this.getRouter().initialize();

           this.getRouter().attachRouteMatched(function(oEvent){
            console.log("Route Method::",oEvent.getParameter("name"))
           })

           //Button Flag
           let buttonFlag = new JSONModel({
            isButtonPressed:false
           })

            this.setModel(buttonFlag,'viewFlip');
            //Load Json Model
            // let data ={
            //     name:'No Name'
            // }
            // let jModel = new JSONModel(data);
            // this.setModel(jModel,'textFields');

            //Resource Model
            // let rModel = new ResourceModel({
            //     bundleName:'ui5new1.i18n.i18n',
            //     supportedLocales:['en','ta'],
            //     fallbackLocale:'en'
            // });

            // this.setModel(rModel,'i18n')
         },
        //  createContent:function(){
        //    return XMLView.create({
        //     viewName:'ui5new1.view.EmpManager'
        //    });
        //  }
    });
    return component;
});