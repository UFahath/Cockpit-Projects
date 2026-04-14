// const cdsCompile = require("@sap/cds/lib/compile/cds-compile");
// const cds = require('@sap/cds')
// module.exports = () =>{
//     return (req,res,next)=>{
//         const authHeader = req.headers['authorization'];
//         // console.log("From Middleware",authHeader)

//         if(!authHeader || !authHeader.startsWith("Basic ")){
//             return res.status(401).json({msg:"Unauthorized Access"});
//         }

//         const token = authHeader.split(' ')[1];
//         // console.log("token::",token)

//         let decode = Buffer.from(token,'base64').toString();
//         decode = decode.split(":")[0];

//         let role;
//         if(decode==='John' || decode === 'David' || decode === 'admin3'){
//             role = ['Admin']
//         }else if(decode ==='dealer1'||decode === 'dealer2' || decode === 'dealer3'){
//             role = ['Dealer']
//         }else{
//             role = ['Customer']
//         }
//         console.log("test",role)
//         const user =new cds.User({id:role});
//         req.user=user
//         next();
//     }
// }