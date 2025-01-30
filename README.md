# Estreams Frontend

Frontend repository for Estreams

## Deployment

The `main` branch is deployed by AWS Amplify: https://master.d39b5lly1v60vf.amplifyapp.com/, which redirects to https://www.estreams.eawag.ch/.

For development, a preview is automatically generated when a Pull Request is opened.

## Local Test Environment

To set up a local test server for your web app, you can use Node.js and a development server.

1. Install Node.js: If you haven't already, download and install Node.js from the official website: https://nodejs.org/

2. Install dependencies: Navigate to your project directory in the terminal and run the following command to install dependencies listed in package.json:

    ```console
    npm install
    ```

3. Start a local server

    ```console
    npm start
    ```

This command will start a development server and automatically open your default web browser to display the web app.