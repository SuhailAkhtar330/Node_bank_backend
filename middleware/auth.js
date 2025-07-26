
const jwt = require('jsonwebtoken');
require('dotenv').config();

// to check authentication 
exports.auth = (req, res, next) => {

    try {
        //extract jwt token
        // const token = req.body.token ;//|| req.cookies.token;

        // if(!token) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Token is missing."
        //     })
        // }


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


// Great question!

// No — the server does not store the token in token-based authentication like JWT (JSON Web Token). Instead, it verifies the token using a secret key.

// Let me explain step-by-step in simple words:

// 🔑 What Happens When a User Logs In?
// User provides email & password.

// Server creates a token with some user info (like ID, role, etc.).

// Server signs the token using a secret key (like a password only the server knows).

// Server sends this signed token to the client (browser/app).

// Client stores it (e.g., in cookies or localStorage).

// 🛂 What Happens on the Next Request?
// Client sends the token back (usually in headers: Authorization: Bearer <token>).

// Server receives the token and:

// Decodes it,

// Verifies the signature using the same secret key.

// If the signature is valid and not expired → user is authenticated.

// If the token is invalid or tampered with → request is rejected.

// 🤔 So… How Does the Server Know It’s Real?
// Because only the server has the secret key.

// If someone changes the token, the signature will not match.

// The server doesn’t need to remember or store the token — it just needs the secret key to check its authenticity.
