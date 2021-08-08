⚠️⚠️⚠️ PLEASE NOTE YOU ARE NOT ALLOWED TO COPY SOURCE CODE INTO OTHER GITHUBS! You are not allowed to disclose private, confidential information belonging to SOQQLE PTE LTD without authorization. SOQQLE PTE LTD reserves all rights including legal action. ⚠️⚠️⚠️

### Pre-requisite for your Development Setup:

- Python is installed. If not, download and install from the following link https://www.python.org/downloads/
- python-pip Python package manager is installed. If not, run the following command: `apt-get install python-pip`
- boto3 is installed. If not, run the following command: `pip install boto3==1.3.0`. Use python3 and pip3 if you already have python2 configured on your system
- Node Version 8.9.4 (Currently 8.8.1),
- Mongo Version 3.4.13 currently but please use 3.6. UAT has 3.6 unless we are facing issues in testing we will use 3.6.

- DEVELOPMENT IS ALWAYS DONE IN STAGING. Once approved by Daniel, you can promote it to master for deployment into PRODUCTION.
- You should code in your own branch.

### Configure AWS Credential

Open/create file ~/.aws/config , add the following:

```
[default]
aws_access_key_id = AWS_ACCESS_KEY_ID
aws_secret_access_key = AWS_SECRET_ACCESS_KEY
region=ap-southeast-1
```

## How to deploy from dev local machine

### Run command to deploy to AWS

```
npm run publish:stg
npm run publish:prod

first command would deploy to staging environment, second one - into production
```

Whatever inside folder `dist` will be deployed to the indicated environment.

Note: Added automatic deployment when push in staging and master branch

# React Hot Boilerplate

The minimal dev environment to enable live-editing React components.

### ⚠️⚠️⚠️ This Is Experimental and Incomplete! ⚠️⚠️⚠️

This is **not a good starting point for people learning React.**  
It’s experimental and completely lacks any production features.

**Do not use this as an actual project boilerplate!**  
If you’re just getting started with React, **use [Create React App](https://github.com/facebookincubator/create-react-app) instead.**

### Usage

```
git clone https://github.com/3posol/3posol-blockchain-app.git
cd 3posol-blockchain-app/
npm install
npm start
open http://localhost:3000
```

Now edit `src/App.js`.  
Your changes will appear without reloading the browser like in [this video](http://vimeo.com/100010922).

### Linting

This boilerplate project includes React-friendly ESLint configuration.

```
npm run lint
```

### Using `0.0.0.0` as Host

You may want to change the host in `server.js` and `webpack.config.js` from `localhost` to `0.0.0.0` to allow access from same WiFi network. This is not enabled by default because it is reported to cause problems on Windows. This may also be useful if you're using a VM.

### WebStorm

Because the WebStorm IDE uses "safe writes" by default, Webpack's file-watcher won't recognize file changes, so hot-loading won't work. To fix this, disable "safe write" in WebStorm.

### Dependencies

- React
- Webpack
- [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- [babel-loader](https://github.com/babel/babel-loader)
- [react-hot-loader](https://github.com/3posol/3posol-blockchain-app)

### Resources

- [Demo video](http://vimeo.com/100010922)
- [react-hot-loader on Github](https://github.com/3posol/3posol-blockchain-app)
- [Integrating JSX live reload into your workflow](http://gaearon.github.io/react-hot-loader/getstarted/)
- [Troubleshooting guide](https://github.com/3posol/3posol-blockchain-app/blob/master/docs/Troubleshooting.md)
- Ping [@dan_abramov](https://twitter.com/dan_abramov) on Twitter or #reactjs (`chat.freenode.net/reactjs`) on IRC
