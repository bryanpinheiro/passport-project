import { PassportStatic } from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../interfaces";

export default function initialize(passport: PassportStatic, getUserByEmail: Function, getUserById: Function) {
    const authenticateUser: VerifyFunction = async (email, password, done) => {
        const user: User = getUserByEmail(email);
        
        if(!user) {
            return done(null, false, {message: "User not found!"});
        }

        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Incorrect Password."})
            }
        } catch(error) {
            return done(error);
        }
    }

    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
    passport.serializeUser((user, done) => { return done(null, (user as User).id )});
    passport.deserializeUser((id, done) => {
       return done(null, getUserById(id));
    });
}