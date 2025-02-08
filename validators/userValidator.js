const Sequelize = require('sequelize');
const sequelize = require('../models/index.js').sequelize;

const user = require('../models/user.js')(sequelize, Sequelize.DataTypes);

async function doesUserExist(email){
    try{
    const response= await user.findOne({
        where:{email:email},
    });
    if(response===null){
        return false;
    }
    else{
     
     return true;
    }
    
}catch(error){
    console.log(error);
}
}

function validateUsernameAndEmail(email,username){
    if(email && username){
        return false;
    }
    else{
        return true;
    }
}

function isValidEmail(email){
    if(email.includes('@') && email.includes('.')){
        return false;
    }
    else{
        return true;
    }
}

module.exports={doesUserExist,validateUsernameAndEmail,isValidEmail};