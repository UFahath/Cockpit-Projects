sap.ui.define([
   "sap/m/Text",
   "sap/ui/core/HTML",
   "sap/ui/core/Icon",
   "sap/m/Button"
],function(Text,HTML,Icon,Button){
    "use strict";
    let text = "The &quot;Hello World&quot; text is now displayed by an OpenUI5 control"
    let newText = new Text({text});
    let oHtml = new HTML({
        content:"<h1>Murugan Valga</h1>"
    });
    // let input = prompt("Enter The name").toString()
    let icon = new Icon({
        src:'sap-icon://car-rental',
        size:'2rem',
        color:'blue'
    })
    let button = new Button({
        text:'Click Me',
        type:'Emphasized',
        press:function(event){
           console.log(event)
            // alert("hi "+input)
        }
    })
    

   
    newText.placeAt("muruganparagraph");
    oHtml.placeAt('content')
    icon.placeAt('content')
    button.placeAt('content')
    
});