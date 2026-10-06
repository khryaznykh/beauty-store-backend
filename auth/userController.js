const User = require("./schema/User");
const userServices = require("./services/userServices");
const UserServices = require("./services/userServices");


class AuthController {

    async allSubscribers(req,res) {
        try {
            const subscribers = await User.find().sort({ createdAt: -1 });
            res.status(200).json({ message: 'List of all your subscribers received!', data: subscribers });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message || "Error occured gettin the list of subscribers" });
        }
    }

    async signupNewUser(req, res) {
        try {
            const { firstName, lastName, email, password, agree }  = req.body;
            const user = await UserServices.registration(firstName, lastName, email, password, agree);
            return res.json({ message: 'Welcome to your Beuty World! You are succesfully signed up!' });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message || "Error occured during registration" });
        }
    }

    async login (req, res) {
        try {
            const { email, password } = req.body;
            const token = await UserServices.login( email, password );
            return res.json({token})
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message || "Access denied" });
        }
    }

    async getProfile(req, res) {
        try {
            const token = req.headers.autorization?.split(' ')[1]
            const profile = await UserServices.getProfile(token)
            return res.json(profile) 
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message || "Access denied" });
        }
    }

    async deleteProfile(req,res) {
        try{
            const result = await UserServices.deleteProfile(req.user.id);
            res.status(200).json(result)
        } catch(e) {
            console.log(e)
            return res.status(400).json({message: e.message})
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const response = await UserServices.forgotPassword(email);
            return res.json(response)
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: e.message || "Error occured during password reset" });
        }
    }
    

    async resetPassword(req,res) {
        try {
            const { resetToken, newPassword } = req.body;
            const response = await UserServices.resetPassword(resetToken, newPassword)
            return res.json(response)
        } catch (e) {
            console.log(e)
            return res.status(400).json({ message: e.message || "Error occured during password reset" })
        }
    }

    async updateUserRole(req,res) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const updatedUser = await userServices.updateUserRole( id, role );
            res. status(200).json("User role has been changed!", updatedUser)
        } catch (e) {
            console.log(e)
            res.status(400).json({message: e.message || "Error occurred during role change"})
        }
    }
};

module.exports = new AuthController();