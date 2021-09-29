import express from "express";

type Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

const isAuthenticated: Middleware = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
};

const isNotAuthenticated: Middleware = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};

export {
    isAuthenticated,
    isNotAuthenticated
}