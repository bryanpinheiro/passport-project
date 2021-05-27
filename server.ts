if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

import express from "express";
import handlebars from "express-handlebars";
import * as bcrypt from "bcrypt";
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import methodOverride from "method-override";
import initializePassportLocal from "./src/configs/passport-local-config";
import { User } from "./src/interfaces";
import { isAuthenticated, isNotAuthenticated } from "./src/middlewares";

const HOSTNAME = process.env["HOSTNAME"] as string;
const PORT = parseInt(process.env["PORT"] as string);
const SESSION_SECRET = process.env["SESSION_SECRET"] as string;

initializePassportLocal(
    passport,
    (email: string) => { return users.find(user => user.email === email) },
    (id: string) => { return users.find(user => user.id === id)}
);

const app = express();
const hbs = handlebars.create({
    layoutsDir: `${__dirname}/views/layouts/`,
    extname: "hbs",
    defaultLayout: "index"
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false}));
app.use(flash());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

const users: User[] = [];

app.get("/", isAuthenticated, (req, res) => {
    res.render("main", {
        name: (req.user as User).name
    });
});

app.get("/login", isNotAuthenticated, (req, res) => {
    res.render("login", { error: req.flash('error') });
});

app.post("/login", isNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get("/register", isNotAuthenticated, (req, res) => {
    res.render("register");
});

app.post("/register", isNotAuthenticated, async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        res.redirect("/login");
    } catch {
        res.redirect('/register');
    }
});

app.delete("/logout", (req, res) => {
    req.logOut();
    res.redirect("/login");
});

app.listen(PORT, HOSTNAME, () => {
    console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});