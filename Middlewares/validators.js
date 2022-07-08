const dataMethod = ['body' , 'params' , 'query']

const validation = schema =>{
    return (req ,res ,next) =>{
       try {
        validationErrArr = []
        dataMethod.forEach(key => {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key] , {
                    abortEarly : false
                })
                if (validationResult.error) {
                    validationErrArr.push(validationResult.error.details)
                }  
                }
        })
        if (validationErrArr.length) {
            res.status(400).json({ message: 'validation error', err: validationErrArr })
        } else {
        next()
        }
       } catch (error) {
        res.status(500).json({ message: "catch error", error})
        console.log(error);
       }
    }
}

module.exports = {
    validation
}