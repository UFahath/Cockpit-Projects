

sap.ui.define(["sap/m/Input",
               "sap/m/Text",
               "sap/m/Button",
               "sap/m/Page",
               "sap/m/Label",
               "sap/m/CheckBox"
],function(Input,Text,Button,Page,Label,CheckBox){

  //Text
//   let text1 = new Text({
//     text:'This is subheading'
//   })


//   //Table
//   let oTable = new Table({
//      width:'100%',
//      columns:[
//         new Column({header:new Text({text:'sno'})})
//      ],
//      items:[
      
//         new ColumnListItem({
//             cells:[
//                 new Text({text:'1'}),
//             ]
//         })
//      ]
//   })

//   //Page 1
//    let oPage = new Page({
//     title:'My Dummy Page',
//     content:[
//         text1,
//         oTable
//     ]
//    });


//    //App
//    let app = new App({
//       pages:[oPage]
//    })

//     app.placeAt('firstDiv')


    let label = new Label({
          text:'Name'
    }).placeAt('firstDiv')


    let input = new Input({
         placeholder:'Enter The Name'
    }).placeAt('firstDiv');


    let button = new Button({
        text:'click',
        press:function(){
            alert(input.getValue());
            input.setValue('')
        }
    }).placeAt('firstDiv')


    let checkbox = new CheckBox({
        text:'IsAvailable'
    }).placeAt('firstDiv')


    // let oPage = new Page({
    //     width:'100%',
    //     content:[label,input,button]
    // });

    // oPage.placeAt('firstDiv')
})