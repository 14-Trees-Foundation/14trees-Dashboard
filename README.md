# 14 Trees Dashboard Frontent

Set the environment variables:
- `REACT_APP_API_MAP_KEY`
- `REACT_APP_CLIENT_ID`
- `REACT_APP_ENV=development|production`

Install dependencies `yarn install`
and start the development server: `yarn dev`

### `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Run this project without authentication

In backend service, `app/auth/verifyToken.js` make below changes and run backend.
```diff
- return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
+ // return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
```

Check the file changes for
- `src/api/local.js`
    - change the base usl to your localhost url of 14trees-api service. ex: `http://localhost:7000`

- `src/App.js`
    - Comment out `RequireAuth` and `AuthProvider`

- `src/pages/admin/LeftDrawer.jsx`
    - make below changes
    ```diff
    - let auth = useAuth();
    + // let auth = useAuth();
    + let auth = { permissions: ["all"] };
    ```