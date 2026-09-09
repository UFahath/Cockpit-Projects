sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/resource/ResourceModel',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast'
], function (Controller, ResourceModel, JSONModel, MessageToast) {
    const AppController = Controller.extend('ui5new1.controller.EmpManager', {
        // onInit: function () {
        //     let bundleInformation = {
        //             bundleName: 'ui5new1.i18n.i18n',
        //             supportedLocales: ["en","ta"],
        //             fallbackLocale: 'en'
        //     }

        //     let i18nBundle = new ResourceModel(bundleInformation);
        //     this.getView().setModel(i18nBundle, 'i18n');
        //     const data ={
        //         name: 'No Name' 
        //     }
        //     let jModel = new JSONModel( data );
        //     this.getView().setModel(jModel,'textFields');
        //     console.log(this.getView().getModel('textFields'))
        // },
        onUpdate: function () {
            let oBundle = this.getView().getModel('i18n').getResourceBundle();

            let inputValue = this.byId('nameInput1').getValue();
            if (!inputValue) {
                MessageToast.show(oBundle.getText('errorEmpty'));
                return;
            }
            if (inputValue.length < 3) {
                MessageToast.show(oBundle.getText('errorShort'));
                return;
            }

            let jModel = this.getView().getModel('textFields');
            let languageDetection = sap.ui.getCore().getConfiguration().getLanguage();
            console.log(languageDetection)
            jModel.setProperty('/name', inputValue)
        },
        onToggle: function () {
            alert('On Toggle Triggered')
        },
        onSwitchLang: function () {
            alert('on Switch language Triggered')
        },
        onLanguageChange: function (event) {
            let lang = event.getSource().getSelectedKey();
            console.log(lang)
            sap.ui.getCore().getConfiguration().setLanguage(lang);

            const res = this.getView().getModel("i18n").getResourceBundle().getText("successMsg")
            //   console.log(res.getText('empDetailHeading'))
            MessageToast.show(res);
            //  location.reload();
        },
        onNavToDetail: function () {
             alert("I am triggered")
            this.getOwnerComponent().getRouter().navTo("Dummy");
        }
    });

    return AppController;
})



//-------------onLanguageChange-----------------
//    let fixedLanguage = sap.ui.getCore().getConfiguration().getLanguage();
//    console.log(fixedLanguage)
//     console.log(lang)
//  function setResourceLanguage(lang){
//     const oModel1 = new ResourceModel({
//             bundleName:'ui5new1.i18n.i18n',
//             bundleLocale:lang.toLowerCase()
//         })
//  console.log(oModel1)

// //  let model = setResourceLanguage(lang);
//  this.getView().setModel(oModel1,'i18n')
//-------------------------------------------



