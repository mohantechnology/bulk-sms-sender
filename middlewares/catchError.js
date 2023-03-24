  
const handleDuplicateKeyError = (err, res) => {
  try {  
    let  fieldNameList =   [];
    if( err?.errors?.length){ 
      fieldNameList = err.errors.map( (item)=> item.message );
    }
    
    // const error = `An account with given values ${fieldNameList.join(",")}  already exists.`; 
    res.status(err.statusCode || 409 ).json({
      message : fieldNameList.join(",")
    });
  }
  catch (err ){
    console.error(err);
    res.status(500).json({ message : "Something went wrong at 'handleDuplicateKeyError' "  });
  }
 
};
 
const handleValidationError = (err, res) => {
  try{ 
        
    let errorList = []; 
    let error = Object.values(err.errors).map((el )=> {
      errorList.push( { fieldName:el.path , message:el.message });
      return el.path;
    });
    if(error.length > 1) {
      error = error.join(',');
    }
    error = "Enter valid values for " + error;
    res.status(err.statusCode || 400).json({
      message : error ||  "Validation Error", 
      errorList , 
    });
  }
  catch ( err) { 
    console.error( err) ; 
    // res.status(500).json({
    //     message :err,  
    // })
  }
    
};
 
module.exports  = (func) => {
  return (req, res, next) => {

    // func(req, res, next).catch(next);
    func(req, res, next).catch((err)=>{
 
      try{ 
        if(err.name === 'SequelizeValidationError'    ) { return   handleValidationError(err, res);}
        if(err.name === 'SequelizeUniqueConstraintError') return err = handleDuplicateKeyError(err, res);
        else if(err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
        else res.status(err.statusCode||500).json({
          message : err.message
        });
      }
      catch ( err) { 
        console.error( err);
       
      }
    
    });
  };
};