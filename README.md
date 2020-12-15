# Dev++

> Social network for developers.

## Table of contents
* [Description](#description)
* [Live Demo](#live-demo)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [App Info](#app-info)



## Description
An social network  built with MERN stack, and utilizes third party API's. This social network  enable three main different flows or implementations:

1. Create a developer profile/portfolio.
2. Share posts.
3. Get help from other developers.


## Live Demo
Here is a working live demo : [dev++](https://dev-plus-2020.herokuapp.com/) 


## Screenshots

## Technologies
* Technologies used:
  * `React` 16.1 - for displaying UI components
  * `Redux` 4.0 -  predictable state container for JavaScript apps
  * `Node` 12.1 - provides the backend environment for this application
  * `Moongoose` 5.9 - Mongoose schemas to model the application data
  * `Express` 4.1 - middleware is used to handle requests, routes
  
 ## Setup
To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer.


###  Clone repo
Run the following scripts in the terminal to clone the repo
```
$ git clone git@github.com:jamesmogambi/dev-_MERN-Stack.git
$ cd dev-_MERN-Stack
```

----------------------------------

### Add a default.json file in config folder with the following

```
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": "<yoursecrectaccesstoken>"
}
```

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

### Run both Express & React from root

```bash
npm run dev
```

### Build for production

```bash
cd client
npm run build
```

### Test production before deploy

After running a build in the client 👆, cd into the root of the project.  
And run...

Linux/Unix 
```bash
NODE_ENV=production node server.js
```
Windows Cmd Prompt or Powershell 
```bash
$env:NODE_ENV="production" node server.js
```

Check in browser on [http://localhost:5000/](http://localhost:5000/)

### Deploy to Heroku

If you followed the sensible advice above and included `config/default.json` and `config/production.json` in your .gitignore file, then pushing to Heroku will omit your config files from the push.  
However, Heroku needs these files for a successful build.  
So how to get them to Heroku without commiting them to GitHub?

What I suggest you do is create a local only branch, lets call it _production_.

```bash
git checkout -b production
```

We can use this branch to deploy from, with our config files.

Add the config file...

```bash
git add -f config/production.json
```

This will track the file in git on this branch only. **DON'T PUSH THE PRODUCTION BRANCH TO GITHUB**

Commit...

```bash
git commit -m 'ready to deploy'
```

Create your Heroku project

```bash
heroku create
```

And push the local production branch to the remote heroku master branch.

```bash
git push heroku production:master
```

Now Heroku will have the config it needs to build the project.

> **Don't forget to make sure your production database is not whitelisted in MongoDB Atlas, otherwise the database connection will fail and your app will crash.**

After deployment you can delete the production branch if you like.

```bash
git checkout master
git branch -D production
```

Or you can leave it to merge and push updates from another branch.  
Make any changes you need on your master branch and merge those into your production branch.

```bash
git checkout production
git merge master
```

Once merged you can push to heroku as above and your site will rebuild and be updated.

---



## Features
List of features:
* Create Profile/Portfolio
* View Developer profiles/portfolios
* Share posts
* Like/Unlike Post 
* Comment on post
* Profile Image
* Update Profile
* Delete Account
* User Authentication


To-do list:
* Add Profile Search
* Add Password recovery


## App Info

### Author

James Mogambi
[James Mogambi](https://github.com/jamesmogambi)

### Version

2.0.0

### License

This project is licensed under the MIT License
