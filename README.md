# passport-project
![dependencies](https://img.shields.io/david/bryansouza/passport-project)
![typescript](https://img.shields.io/github/languages/top/bryansouza/passport-project)

This project is a simple API that uses Passport Authentication.

## Usage
### 1. Installing dependencies
```
yarn install
```

### 2. Environment variables
   
First, create a `.env` file in the root of the project.

Then, add these variables: 
`HOSTNAME`
`PORT`
`SESSION_SECRET`

:bulb:***TIP**: run the commands below on your terminal to generate random secrets.*
```
node

require("crypto").randomBytes(64).toString("base64")
```
   
### 3. Starting the server
```
yarn run dev
```

## How it works
### 1. Passport

Passport is an **authentication middleware** that implements some methods and proprieties on `express` such as `req.isAuthenticated()` and `req.user`.
These attributes just work because we've configured the `express-session` earlier, and without other methods like `serialize` and `deserialize` **passport** would fail to retain the user's session.
