# uuid

# Table of Conetnts

- [About](#about)
- [Important](#important)
- [WebService](#webservice)
- [Project Setup](#project-setup)
    + [npm Setup](#npm-setup)
    + [env Setup](#env-setup)
- [Local setup](#local)
- [Prisma](#prisma)
    + [Prisma Studio](#prisma-studio)
    + [Reset/migrate](#reset)
    + [Seed Admins](#admin-seed)
- [Running Tests](#test-suite)
- [Prettier/Eslint](#pre-lint)
- [Postman Documentation](#postman)
- [Examples](#examples)
    + [register user](#register)
    + [create quiz](#quiz-create)
- [References](#ref)

## About <a name="about"/>
BIT Intermediate App Dev  
Project 2 - RESTFUL API quiz app  

Create and deploy a RESTFUL Quiz api

## Important <a name="important"/>
This code runs on node v20.9.0  
Instead your scripts use the `--env-file=.env` flag.  

If you are using a version of node that does not have this option, you will need to install and set up something like [dotenv](https://www.npmjs.com/package/dotenv)

## Web Service <a name="webservice"/>
[Render Deployment](https://smitde5-inter-dev-restful.onrender.com/)

## Project Setup <a name="project-setup"/>

### npm Setup <a name="npm-setup"/>
From the root directory of the project  
`npm install`

### env Setup <a name="env-setup"/>
Add a .env to root directory  
Check the .env.example for variables required in env
Or use the following
```js
DATABASE_URL="postgres://id608001_dsmith575_user:oitJblAKrmCpOYlFKU0sRk1yqoapT7zm@dpg-ck3om5fqj8ts738356cg-a.oregon-postgres.render.com/id608001_dsmith575"
USER_PROFILE_PIC='https://api.dicebear.com/7.x/pixel-art/svg'
QUIZ_DATABASE="https://opentdb.com/api.php?"
GIT_GIST_URL="https://gist.githubusercontent.com/DSmith575/1febdafed23fb8f592f89809423463d2/raw/08bf599fb971aa8ea14923808eb4120933fa1efe/basisUsers.json"
PORT=3000
JWT_SECRET=Pazzw0rd
JWT_LIFETIME=1hr
```

### Database setup <a name="database-setup"/>
After `npm install`  
run `npm run generate`
and then `npm run migrate`

## Local Environment <a name="local"/>
To run the local environment, in your terminal run `npm run dev`  

If you are using postman in the url use
`localhost:3000/api/v1`  
Sending a get request to this address will return a list of all endpoints

## Prisma <a name="prisma"/>

### Prisma studio <a name="prisma-studio"/>
To run prisma studio, in your terminal run `npm run prismaStudio`

### Prisma reset & migrate <a name="reset"/>
To reset the database run `npm run reset`  
To migrate the database run `npm run migrate`. **NOTE:** This also applies a prisma reset as well

### Seed super admin users <a name="admin-seed"/>
Once you have `generated` and created your prisma database  
Run `npm run seed` To seed a list of super admin users

## Running test suite <a name="test-suite"/>
To run the mocha and chai test suite run `npm run test`  
**NOTE:** You must have a database and have seeded super admins for quizTesting to work

## Prettier/Eslint <a name="pre-lint"/>

### Prettier
To check code for issues run `npm run pretty:check`  
To fix any code styling run `npm run pretty:fix`  

### Eslint
To check and format code for errors run `npm run lint`

## Postman Documentation <a name="postman"/>
A JSON file containing a postman collection for registering and end points is available in the postManCollection directory.  

In postman click import, and drag/browser to the collection jsonfile.  

![Alt text](<./screenshots/postman import.png>)

Right click the collection and click `View documentation`

![Alt text](./screenshots/viewDoc.png)

## Example requests <a name="examples"/>

### Register User (Postman) <a name="register"/>
```js
"firstName": "example",
"lastName": "example",
"username": "example",
"email": "example@example.com",
"password": "example123!",
"confirmPassword:" "example123!"
```

### Create Quiz (Postman) <a name="quiz-create"/>
```js
"name": "exampleQuiz",
"difficulty": "easy",
"categoryId": 9,
"startDate": "YYYY-MM-DD",
"endDate": "YYYY-MM-DD",
"totalQuestions": 10,
"type": "multiple"
```

## References <a name="ref"/>

| Opentdb | uuid |
| ------- | ---- |
| [Categories](https://opentdb.com/api_category.php) | [uuid](https://www.uuidgenerator.net/dev-corner/javascript) |
| [Response for incorrect/empty quiz types](https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=boolean) |

| App Dev | Axios | Prisma |
| ------- | ----- | ------ |
| [Intro/Inter AppDev](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts) | [Axios instance](https://axios-http.com/docs/instance) | [Prisma API](https://www.prisma.io/docs/reference) |
| | | [Prisma arrays](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-scalar-lists-arrays) |
| | | [Prisma lt/gte](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting) |



| JSDoc | Prettier | Eslint |
| ----- | -------- | ------ |
| [JSDocs](https://jsdoc.app/) | [Prettier rules](https://axios-http.com/docs/config_defaults) | [Eslint rules](https://eslint.org/docs/latest/rules/) |

| Joi | JoiDate | JoiValidation |
| --- | ------- | ------------- |
| [Joi Documentation](https://joi.dev/api/?v=17.9.1) | [joi-date](https://joi.dev/module/joi-date/) |[Joi validation helpers](https://joi.dev/api/?v=17.9.1#validation-helpers) |
| | | [Date comparison](https://github.com/hapijs/joi/issues/2288) |
| | | [Date comparison 2](https://github.com/hapijs/joi/issues/2371) |
| | | [Joi types](https://dev.to/itnext/joi-awesome-code-validation-for-node-js-and-express-35pk) |
| | | [Joi passing dates](https://github.com/hapijs/joi/issues/794) |