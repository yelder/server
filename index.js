const mongoose=require("mongoose");
const app=require("./app.js")
const port=process.env.PORT || 3977;
const {API_VERSION,IP_SERVER,PORT_DB}=require("./config")
//CONECTO LA BASE DE DATOS
mongoose.set("useFindAndModify",false);

mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/yelderproyecto`,
{useNewUrlParser: true, useUnifiedTopology: true},(err,res)=>{
    if(err){
        throw err;
    }else{
        console.log('La conexión a la base de datos es correcta');
        
        app.listen(port,()=>{
            console.log('API REST');
            console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
        })
    }
});