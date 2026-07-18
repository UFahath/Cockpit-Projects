const fs = require("fs");
    let numbers=0;
 function writeID(ID){
   if(!ID){
    throw 'not passed id'
   }
     fs.appendFile('./IDFile.txt',`\n${numbers++}::${ID}`,(err)=>{
        if(err) throw 'Error Writing'
        return 'Successfully Written'
     })
}

module.exports = {writeID}