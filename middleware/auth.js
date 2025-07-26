
const jwt = require('jsonwebtoken');
require('dotenv').config();

// to check authentication 
exports.auth = (req, res, next) => {

    try {
        


        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Token is missing or badly formatted.",
            });
        }

        const token = authHeader.split(" ")[1];

        //verify the token

        try {

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;


        } catch (error) {
            
            res.status(401).json({
                success: false,
                message: "Token is invalid."
            })
            
        }
        
        next();

    } catch (error) {
        
        return res.status(401).json({
            success: false,
            message: "Something went wrong, while verifying token."
        });

    }
}



// to check authorization

exports.isCustomer = (req,res,next) => {
      
    try {

        if(req.user.role !== "Customer") {

            return res.status(401).json({
                success: false,
                message: "This route is only for customer."
            });

        }

        res.status(200).json({
            success: true,
            message: "Welcome to the customer route."
        })

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "User role is not valid.",
            error: error.message
        });
    }
}


exports.isEmployee = (req, res, next) => {
      
    try {

        if(req.user.role !== "Employee") {

            return res.status(401).json({
                success: false,
                message: "This route is only for employee."
            });

        }

        res.status(200).json({
            success: true,
            message: "Welcome to the employee route."
        })

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Welcome to the employee route."
        });

    }
}



exports.isManager = (req, res, next) => {
      
    try {

        if(req.user.role !== "Manager") {

            return res.status(401).json({
                success: false,
                message: "This route is only for Manager."
            });

        }

        // res.status(200).json({
        //     success: true,
        //     message: "Welcome to the manager route."
        // })

        next();

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed request to manager route."
        });
        
    }
}


