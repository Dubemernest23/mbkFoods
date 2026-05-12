const { json } = require("express");
const data = require("./admin.service");

const getAllAdmins = (req,res) =>{

    return res.status(200).json({
        success: true,
        data: data,
        count: data.length
    })
}


module.exports = {getAllAdmins}