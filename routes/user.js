const express = require("express");
const UserController= require("../controllers/user");
const multiPart = require("connect-multiparty")

const md_auth= require('../middleware/authenticated');
const md_upload_avatar = multiPart({ uploadDir: "../uploads/avatar" });

const api= express.Router();

api.post("/sign-up",UserController.signUp);
api.post("/sign-in",UserController.signIn);
api.get("/users",[md_auth.ensureAuth], UserController.getUsers);
api.get("/users-active",[md_auth.ensureAuth], UserController.getUsersActive);
api.put("/upload-avatar/:id", [md_auth.ensureAuth,  md_upload_avatar], UserController.uploadAvatar);

module.exports= api;