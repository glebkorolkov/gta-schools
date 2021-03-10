# gta-schools.ca Front-End Application

This is a front-end web application for [gta-schools.ca](https://gta-schools.ca) website &ndash; an interactive map of Greater Toronto Area schools. It is built with [React](https://reactjs.org/), [Bulma](https://bulma.io/) and [OpenLayers](https://openlayers.org/).

## Available Scripts

In the project directory, you can run:

### `npm run start` or `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run deploy:quick`

Syncs the content of the `build` folder with the S3 bucket set by `GTA_SCHOOLS_BUCKET_NAME` variable. Setting `REACT_APP_GA_TRACKING_ID` environment variable to Google Analytics universal tracking ID enables Google Analytics tracking.

### `npm run deploy -- s3://<bucket-name>`

Same as `npm run deploy:quick`, however bucket name has to be passed as argument to the script.
