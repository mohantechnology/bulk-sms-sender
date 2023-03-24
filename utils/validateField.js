/* eslint-disable no-useless-escape */

var validate ={ 
  
  email: (input)=> {
  
    if (input && typeof input === "string" && input.length>7 && input.length <100) {
      let strongRegex = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9.-]+$");
      if( strongRegex.test(input)) { 
        return {status:"ok" };
      }
    }
   
    return   {status:"error" ,message : "Please Enter a valid email " };  
  
  },
  
};
  
module.exports = validate ; 