import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

//create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Felhasználó nem létezik" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Érvénytelen hitelesítő adatok" })
        }

        const token = createToken(user._id)
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || '', // Include phone
                avatarUrl: user.avatarUrl || ''
            }
        })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hiba" })
    }
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "A felhasználó már létezik" })
        }


        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Kérjük, írjon be egy érvényes e -mailt" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Kérjük, írjon be egy erős jelszót" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || '', // Include phone
                avatarUrl: user.avatarUrl || ''
            }
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId).select('name email phone avatarUrl'); // Select phone
        if (!user) {
            return res.json({ success: false, message: 'Felhasználó nem található' });
        }
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || '', // Include phone
                avatarUrl: user.avatarUrl || ''
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Hiba a profil lekérésekor' });
    }
};

// Update profile (name, avatar, password)
const updateProfile = async (req, res) => {
    const userId = req.body.userId;
    const { name, avatarUrl, currentPassword, newPassword } = req.body;

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'Felhasználó nem található' });
        }

        if (name) {
            user.name = name;
        }

        if (typeof avatarUrl === 'string') {
            user.avatarUrl = avatarUrl;
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.json({ success: false, message: 'Add meg a jelenlegi jelszót.' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.json({ success: false, message: 'A jelenlegi jelszó nem megfelelő.' });
            }

            if (newPassword.length < 8) {
                return res.json({ success: false, message: 'Az új jelszónak legalább 8 karakter hosszúnak kell lennie.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }

        await user.save();

        return res.json({
            success: true,
            message: 'Profil frissítve.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || '', // Include phone
                avatarUrl: user.avatarUrl || ''
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Hiba a profil frissítésekor' });
    }
};

// List all users
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Hiba a felhasználók listázásakor" });
    }
}

export { loginUser, registerUser, getProfile, updateProfile, listUsers }
