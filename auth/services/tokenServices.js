const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET
const secretResetKey = process.env.JWT_RESET_SECRET

//arrow func and sometimes not => check what works!!!!!

class TokenServices {
    static generateAccessToken = (id, role) => {
        // Generate a JWT token for the authenticated user
        const payload = { id, role }
        const accessToken = jwt.sign(
            payload,            // Payload (data inside the token)
            secretKey,          // Secret key for signing the token
            { expiresIn: "1h" } // Token expiration time (1 hour)
        ); 
        return accessToken;
    }

    static verifyAccessToken(token) {
        
        try {
            return jwt.verify(token, secretKey);
        } catch (err) {
            throw new Error('Wrong or expired token');
        }
    }

    static generateResetToken = (email) => {
        
        const payload = { email }
        const resetToken = jwt.sign (
            payload,
            secretResetKey,
            { expiresIn: '1h'}
        );
        return resetToken;
    }

    static decodedEmail = ( resetToken ) => {

        try {
            const decoded = jwt.verify(resetToken, secretResetKey);
            return decoded.email
        } catch (e) {
            return null;
        }
    }
}

module.exports = TokenServices;