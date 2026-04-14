const myfun = function(srv){
    srv.on('dummy',(req,res)=>{
        return "Hi"+req.data.msg;
    })
};


module.exports = myfun;