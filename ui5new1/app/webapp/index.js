

// sap.ui.define(['sap/ui/core/mvc/XMLView'], function(XMLView){
//   "use strict";

//   let targetViews = ['ui5new1.view.App','ui5new1.view.Button','ui5new1.view.App1','ui5new1.view.Dummy','ui5new1.view.Bind','ui5new1.view.EmpManager']
  
//   //  XMLView.create({
//   //   viewName:targetViews[0],
//   //  }).then((view)=>view.placeAt('firstDiv'));

//   //   XMLView.create({
//   //   viewName:targetViews[1]
//   //  }).then((view)=>view.placeAt('firstDiv'));

//     // XMLView.create({
//     //   viewName:targetViews[3]
//     // }).then((view)=>view.placeAt('firstDiv'))


//     // XMLView.create({
//     //   viewName:targetViews[4]
//     // }).then((view)=>{
//     //   view.placeAt('firstDiv');
 
//     // })

//     XMLView.create({
//       viewName:targetViews[5]
//     }).then((view)=>view.placeAt('firstDiv'))

// })



sap.ui.define(['sap/ui/core/ComponentContainer'],function(ComponentContainer){
  "use strict";
    new ComponentContainer({
      name:'ui5new1',
      settings:{
           id:'walkthrough'
      },
      async:true
    }).placeAt('firstDiv')
});