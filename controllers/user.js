  
const fs = require("fs");
const path = require("path");
const bcrypt= require("bcrypt-nodejs");
const jwt= require('../services/jwt');
const User= require('../models/user');

function signUp(req,res){
    const user= new User();
    
    const{name, lastname, email, password, repeatPassword}=req.body
    user.name=name;
    user.lastname=lastname;
    user.email=email.toLowerCase();
    user.role="admin";
    user.active= false;

    if(!password || !repeatPassword){
        res.status(404).send({message: "Las contraseñas son obligatorias"});
    }else{
        if(password !== repeatPassword){
            res.status(404).send({message: "Las contraseñas tienen que ser iguales"});
        }
        else{
            bcrypt.hash(password, null, null, function(err, hash){
                if(err){
                    res.status(500).send({message:"error al ecriptar la contraseña"});
                }else{
                    user.password=hash;

                    user.save((err,userStored)=>{
                        if(err){
                            res.status(500).send({message:"El usuario ya existe"})
                        }else{
                            if(!userStored){
                                res.status(400).send({message: "Error al crear el usuario"})
                            }else{
                                res.status(200).send({user: userStored});
                            }
                        }
                    })
                }
        
            });
        }
    }
}

function signIn(req,res){
    const params=req.body;
    const email= params.email.toLowerCase();
    const password=params.password;

    User.findOne({email}, (err, userStored)=>{
        if(err){
            res.status(500).send({message: "Error del servidor."});
        }else{
            if(!userStored){
                res.status(404).send({message: "Usuario no encontrado"});
            }else{
                bcrypt.compare(password, userStored.password, (err,check)=>{
                    if(err){
                        res.status(500).send({message: "Error del servidor."})
                    }else if(!check){
                        res.status(404).send({message: "La contraseña es incorrecta"})
                    }
                    else{
                        if(!userStored.active){
                            res.status(200).send({code:200, message:"El usuario no se ha activado."})
                        }else{
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            });
                        }
                    }
                })
               
            }
        }
    })
}

function getUsers(req, res){
    User.find().then(users=>{
        if(!users){
            res.status(404).send({message: "No se ha encontrado ningún usuario"});
        }else{
            res.status(200).send({users});
        }
    })
}

function getUsersActive(req, res){
    
    const query=req.query;

    User.find({active: query.active}).then(users=>{
        if(!users){
            res.status(404).send({message: "No se ha encontrado ningún usuario"});
        }else{
            res.status(200).send({users});
        }
    })

}

function uploadAvatar(req,res) {
    const params = req.params;

    User.findById({ _id: params.id }, (err, userData) => {
      if (err) {
        res.status(500).send({ message: "Error del servidor." });
      } else {
        if (!userData) {
          res.status(404).send({ message: "Nose ha encontrado ningun usuario." });
        } else {
          let user = userData;
  
          if (req.files) {
            let filePath = req.files.avatar.papath;
            let fileSplit = filePath.split('\\');
            let fileName = fileSplit[2];
  
            let extSplit = fileName.split(".");
          console.log(extSplit)

        }
            }
        }
    })
}

module.exports={
    signUp,
    signIn, 
    getUsers,
    getUsersActive,
    uploadAvatar
};