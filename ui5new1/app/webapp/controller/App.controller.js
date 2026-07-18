sap.ui.define(['sap/ui/core/mvc/Controller'],function(Controller){


    // const AppController = Controller.extend('ui5new1.controller.App',{
    //        onShowHello(){
    //         alert("Hello World")
    //        }
    // });



    const AppController = Controller.extend('ui5new1.controller.App',{
        onInit:function(){
             console.log("onINit")
        },
        onBeforeRendering:function(){
           console.log("on Before Rendering")
        },
        onAfterRendering:function(){
           console.log("on After Rendering")
        },
        onShowHello(){
            // const data = this.byId('nameInput').getValue();
            // console.log(typeof this)
            // console.log(this)
            // console.log(this.byId('nameInput'))
            // let greetingMsg = `Hello ${data}`
            // alert(greetingMsg)
            // let data1 = this.getView();
            console.log("----------------------------------")
            // console.log(data1)
           const output = this.byId('click').setText("hello there");
        //    output.setText(greetingMsg)
           output.addEventDelegate({
            onBeforeRendering:function(){
                console.log("I am from Child Event")
            },
            onAfterRendering:function(){
                console.log("I am from Child Event after rendering")
            }
           })
        },
        // getLiveUpdate(event){
        //     const inputValue = event.getParameter('value');
        //     const output = this.byId("myText");
        //     output.setText(inputValue)
        //     // console.log(inputValue)
        // }
    })
    

    return AppController;
})