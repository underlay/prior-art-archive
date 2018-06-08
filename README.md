# Prior Art Archive

This repo contains all of the code powering the Prior Art Archive.

The project is broken into several smaller functions which form the heirarchy of our folder structure:

- `/site`: Code for the user-facing frontend
- `/clientApi`: Node API using for logins, and other front-end actions
- `/searchApi`: Java API for interfacing with Elasticsearch
- `/lambdaListener`: AWS Lambda function for handling new files created by the SFTP server

## Site
**To install:** site dependencies, run `npm install` from the root directory of the repository.

**To develop:** run `npm run start-site` from the root directory of the repository. The dev site will be live at `locahost:8080` and will auto-reload with changes to the code.

Static files such as images, robots.txt, etc are stored in the /static folder. The contents of this folder are copied to the /dist folder during the production build. The contents, not the folder itself, are copied, so that robots.txt, etc will be at the top-level of the deployed application.

### Deploying
The site automatically deploys on new pushes to the dev and master branch on Github. The dev branch triggers new dev builds and the master branch will trigger new production builds. These build configurations and triggers are managed through Netlify, where the site is hosted.

## API

First, create a `config.js` file to configure the values. See `config.sample.js` for an example.

Then run:

```
npm install
npm run start-api
```

### Deploying
The API automatically deploys on new pushes to the dev and master branch on Github. The dev branch triggers new dev builds and the master branch will trigger new production builds. These build configurations and triggers are managed through Heroku, where the api is hosted.