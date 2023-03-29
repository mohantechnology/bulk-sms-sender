// const path = require('path');
const catchError = require('../middlewares/catchError');
const AppError = require("../utils/AppError");
const fetch = require('cross-fetch');
const path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const jwt = require('jsonwebtoken');
const client = require("twilio")(process.env.ACCOUNT_SID , process.env.AUTH_TOKEN );




function setCredentialsToCookies(res, accountDetail) {
  let tokenExpireAt = 604800000;

  let token = jwt.sign(
    {
      username: accountDetail.username,
      password: accountDetail.password,

    },
    process.env.JWT_SECRET_KEY);

  res.cookie('sid', token, { maxAge: tokenExpireAt, httpOnly: true });
  return token;

}









module.exports.loginUserAccount = catchError(async (req, res) => {

  req.body.username = req.body.username ? req.body.username.trim() : undefined;
  req.body.password = req.body.password ? req.body.password.trim() : undefined;

  if (!req.body.username || !req.body.password) {
    throw new AppError("Must have field 'username', 'password' ", 400);
  }

  if (req.body.username !== process.env.USER_NAME || req.body.password !== process.env.PASSWORD) {
    return res.status(401).json({ message: "Invalid Credentails" });
  }



  let token = setCredentialsToCookies(res, {
    username: req.body.username,
    password: req.body.password

  });

  return res.status(200).json({ message: "Verified Successfully" });


});




 





module.exports.sendMessage = catchError(async (req, res) => {

  // req.body.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber.trim() : undefined;
  req.body.message = req.body.message ? req.body.message.trim() : undefined;

  if (!req.body.phoneNumber || !req.body.message) {
    throw new AppError("Must have field 'phoneNumber', 'message' ", 400);
  }

  if( !Array.isArray(req.body.phoneNumber)){
    throw new AppError("  phoneNumber  must be an Array", 400);
  }
  if( req.body.phoneNumber.length ==0 || req.body.phoneNumber>10){
    throw new AppError("Array must have atleat one phone number and less then 10 phone number", 400);
  }
 
  // return res.status(200).json({ message: "Sended Successfully" , data: req.body });
let phoneNumberList =  req.body.phoneNumber ; 
for (let i = 0; i < phoneNumberList.length; i++) {
  phoneNumberList[i] = phoneNumberList[i].trim().replace(/(?:\r\n|\r|\n)/g, '');
 

  if (!phoneNumberList[i] || !phoneNumberList[i].startsWith('+')) {
      return res.status(200).json({ message: "All phone Number must start with +countrycode" });
  }

}
//  for( let i )
let errList = [ ]; 
  for (let i = 0; i < phoneNumberList.length; i++) {
    try{
      await    client.messages.create({
        body:  req.body.message , 
        from:  process.env.SENDER_NUMBER ,
        to: phoneNumberList[i]
      })
    }
    catch(err){
      errList.push ( phoneNumberList[i] + " : "  + (err.message ||  "something went wrong"))
    }
  
}


if( errList.length ) {
  return res.status(400).json({ message: errList.join("\n")});
}
else{
  return res.status(200).json({ message: "Sended Successfully" });

}
 
 


});









module.exports.logoutUserAccount = catchError(async (req, res) => {
  res.cookie('sid', "", { maxAge: 0, });


  return res.status(200).json({ message: "Logout Successfully" });

});


















module.exports.home = catchError(async (req, res) => {
  // file_path.dsfd.fdfd.f
  let file_path = __dirname + "/../public/index.html";
  file_path = path.resolve(file_path)
  console.log(file_path)
  return res.sendFile(file_path);

  return res.status(200).json({
    message: "Api is Running Successfully"
  });

});


module.exports.login = catchError(async (req, res) => {
  // file_path.dsfd.fdfd.f
  let file_path = __dirname + "/../public/login.html";
  file_path = path.resolve(file_path)
  console.log(file_path)
  return res.sendFile(file_path);

  return res.status(200).json({
    message: "Api is Running Successfully"
  });

});


