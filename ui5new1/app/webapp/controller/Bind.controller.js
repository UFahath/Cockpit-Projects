sap.ui.define(['sap/ui/core/mvc/Controller','sap/ui/model/json/JSONModel','sap/ui/model/resource/ResourceModel'],function(Controller,JSONModel,ResourceModel){
     const AppController  = Controller.extend('ui5new1.controller.Bind',{
        onInit(){
            
            // let data = {
            //     name:{
            //         dumy:"hello"
            //     }
            // }
            // let jModel = new JSONModel(data);
            // console.log(jModel)
            // this.getView().setModel(jModel);
            // console.log("hi")

            let data = {
                name:'Mur',
                city:'Kancheepuram'
            };
            let data1 = {
                name:'Murugan',
                city:'Kanceepuram District'
            }

            let jModel = new JSONModel(data1);
            this.getView().setModel(jModel);

           let i18nBundle = new ResourceModel({
            bundleName:'ui5new1.i18n.i18n',
            supportedLocales:[""],
            fallbackLocale:''
           });


           this.getView().setModel(i18nBundle,'i18n')
        },
        changeMurugan(){
            let jmodel = new JSONModel({
                name:'murugan Thaliavan',
                city:'Chennai done'
            })
            this.getView().setModel(jmodel)
        }
     });

     return AppController;
})