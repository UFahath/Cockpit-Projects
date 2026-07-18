const cds = require('@sap/cds');


// cds.on('loaded',function(model){
//     // console.log(model.definitions['dummy.Test'].projection.columns)



//     let [dbLayer,,srvLayer] = Object.keys(model.definitions);
    
//     //Entity
//     let dbEntity ,srvEntity;

//     for(let key in model.definitions){
//         if(key === dbLayer){
//             // console.log(model.definitions[key])
//             dbEntity = model.definitions[key]
//         }if(key=== srvLayer){
//             srvEntity = model.definitions[key]
//         }
//     };


//     // console.log(dbEntity.elements);
//     // console.log("----------------");
//     // console.log(srvEntity.elements)


//    for(let [name,element] of Object.entries(dbEntity.elements)){
//     if(!srvEntity.elements[name]){
//         model.definitions[srvLayer].elements[name]=element
//         model.definitions[srvLayer].projection.columns.push({ref:[name]})
//     }
//    }

//    console.log(model.definitions[srvLayer])
// })


 cds.on('loaded',function(model){
    // console.log(model.definitions)
    let dbLayer = model.definitions['myapp.db.Dummy'];
    let srvLayer = model.definitions['dummy.Test'];
    // console.log(dbLayer);
    // console.log(srvLayer)


    for(let [name,element] of Object.entries(dbLayer.elements)){
        if(!srvLayer.elements[name]){
            srvLayer.projection.columns.push({ref:[name]})
            srvLayer.elements[name] = element
        }
    }
 })