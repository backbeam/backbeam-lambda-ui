# Backbeam lambda desktop UI

Backbeam lambda allows you to:

- Easily create, test and deploy AWS lambda functions
- Map lambda functions to API endpoints using the AWS API Gateway
- Create locally and sync dynamo tables

Advanced features:

- Lambda functions are bundled using webpack, so only the required dependencies are uploaded to AWS lambda
- Webpack is configured with babel to transpile ES2015 code, so even though AWS lambda only supports Node.js 0.10.36 you can use any ES2015 feature supported by babel
- Typical mappings are handled by you so you can accept url-encoded http request bodies (like in HTML forms) as well as query string values
- Backbeam lambda comes with a built-in development server that simulates the API gateway behavior and lambda built-in objects (event and context)

![Home screen](https://raw.githubusercontent.com/backbeam/backbeam-lambda-ui/master/screenshots/home.png)

![API](https://raw.githubusercontent.com/backbeam/backbeam-lambda-ui/master/screenshots/api.png)

## Installing

```bash
# Download the project
# Build for the first time
npm install && npm run build
# Run the electron app
npm start
```

If you have trouble running `npm install` could be because some npm and babel version doesn't work well together. Try running `npm install` again.

## Usage

Some notes:

- Green buttons in the UI perform remote actions on AWS (deploy, sync, etc). Otherwise actions are performed only locally
- After creating a project run the local development server with `npm start` in your working directory
- This is a project under heavy development. Some features are not yet implemented.
