const bcrypt = require("bcrypt");

const userRepository = require("../repositories/user.repository");

class AuthService {

    async signup(userData) {

        const existingUser =
            await userRepository.findByEmail(userData.email);

        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword =
            await bcrypt.hash(userData.password, 10);

        const newUser =
            await userRepository.create({
                name: userData.name,
                email: userData.email,
                password: hashedPassword
            });

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };

    }

}

module.exports = new AuthService();