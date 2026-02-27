import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
// Controllers For User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // find user by email
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        // setting user data in session
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id;
        return res.json({
            message: 'Account created successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
// Controllers For User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Password is wrong' });
        }
        // setting user data in session
        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        return res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
// Controllers For User Logout
export const logoutUser = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
    });
    return res.json({ message: 'Logout successful' });
};
// Controllers For User Verify
export const verifyUser = async (req, res) => {
    try {
        const { userId } = req.session;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid user' });
        }
        return res.json({ user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
// Controllers For Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'If this email exists, a reset token has been generated' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 15);
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
        return res.json({
            message: 'Password reset token generated',
            resetToken,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
// Controllers For Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }
        if (String(newPassword).length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.json({ message: 'Password reset successful. Please login.' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
