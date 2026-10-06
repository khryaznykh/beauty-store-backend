const User = require("../schema/User");
const bcrypt = require('bcrypt');
const TokenServices = require("./tokenServices");
const { sendResetPasswordEmail } = require("./mailServices");


class UserServices {
    //regitrstion of new user
    async registration(firstName, lastName, email, password, agree) {
        const userToSignUp = await User.findOne({email})
        if (userToSignUp) {
            throw new Error('User with this email is already registered');
        }

        const hashPassword = bcrypt.hashSync(password, 10);  //Sync means doesn't move to next code line untill hashing is finished
                     // await bcrypt.hash(password, 10)      //salt = 7, ideal between 10-22, 
                                                            //smaller number less secure, but faster
        const user = new User({firstName, lastName, email, password: hashPassword, agree});
        await user.save();
        return user;
    }

    //login - checking credentials and creating token for profile
    async login(email, password) {
        const userExists = await User.findOne({email})
        if (!userExists) {
            throw new Error(`User with email ${email} isn't registered. Please enter valid email address to login`);
        }
        const isPasswordMatching = await bcrypt.compare(password, userExists.password)
        if (!isPasswordMatching) {
            throw new Error('Incorrect password. Please try again');
        }
        
        const token = TokenServices.generateAccessToken(userExists._id, userExists.role)
        return token;
    }

    // Получение профиля пользователя по токену
    async getProfile(token) {
        if (!token) {
            throw new Error(`Access Denied`);
        }
        const verified = TokenServices.verifyAccessToken(token)
        const verifiedId = verified.id
        const profile = await User.findById(verifiedId).select('-password') //get access to
                                            //user profile info except for password
        if (!profile) {
            throw new Error(`User hasn't been find`);
        }
        return profile;
    }

    async deleteProfile(userId) {
        const profileDeleted = await User.findByIdAndDelete(userId);
        if (!profileDeleted) {
            throw new Error("User hasn't been found");
        }
        return {
            message: "Profile has been deleted"
        };
    }
    // async logout(token) no need because jwt is stored in front end, so will be handled on the front end

    async forgotPassword(email) {
        const userExists = await User.findOne({email});
        if (!userExists) {
            throw new Error (
                "User with this email doesn't exist!"
            )
        }
        const resetToken = TokenServices.generateResetToken(email);
        await sendResetPasswordEmail(email, resetToken);
        return {message: "The instruction how to reset your password has been sent to your email"}
    }

    async resetPassword(resetToken, password) {
        const email = TokenServices.decodedEmail(resetToken);
        if (!email) {
            throw new Error(
                "Invalid or expired reset token"
            );
        }
        const user = await User.findOne({email})
        if (!user) {
            throw new Error ("The user doesn't exist")
        }
        const hashPassword = bcrypt.hashSync(password, 10);//or await bcrypt.hash(password, 10)
        user.password = hashPassword;
        await user.save();
        return {message: "Your password has been changed successfully!"}
    }

    async updateUserRole(id, role) {
        if(!["USER", "ADMIN"].includes(role)){
            throw new Error("Invalid role")
        }
        const user = await User.findByIdAndUpdate(id, { role },
            {
                returnDocument: "after",
                runValidators: true
            }
        ).select('-password')
        if(!user){
            throw new Error ("User not found")
        }
        return user;
    }
}

module.exports = new UserServices();