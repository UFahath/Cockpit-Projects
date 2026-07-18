sap.ui.define([
    'sap/m/Page',
    'sap/m/Input',
     'sap/m/Button',
     'sap/m/Text'
],function(Page,Input,Button,Text){
     "use strict";
     //Text
    let textEle = new Text({
        text:'',
        // level:'H1'
    })

    //Create Inputs
    function createInput(placeholder,liveInput =""){
        return new Input({
        placeholder:placeholder,
        width:'20rem',
        showClearIcon:true,
        liveChange:function(event){
            let value = event.getParameter('value');
           liveInput && liveInput.setText(value)
        }
    })
    }


   

    // Input2
    let input1 = createInput('Enter The Amount',textEle);
    let input2 = createInput('How Many People');

   console.log(input1.getMetadata().getProperties())

    //Button
    let button = new Button({
        text:'Split Button',
        type:'Emphasized',
    })
    

    // console.log(button.getMetadata().getProperties())
   let newPage = new Page({
    //    height:'100vh',
       title:'Expense Splitter App',
       content:[input1,input2,button,textEle]
})

   let app = new sap.m.App({
    pages:[newPage]
   })
   app.placeAt('content')
})