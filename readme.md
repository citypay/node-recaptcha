# Node Recaptcha Validator

Validates a Google recaptcha token along with it's secret via the Google reCaptcha API.

Api Information at [Google ReCAPTCHA Website](https://developers.google.com/recaptcha/)
  
## Usage

To use the validator, load the recaptcha validator

```javascript
const recaptcha = require('node-recaptcha');
```

then create handlers to deal with the responses from the reCaptcha process.

### Success Handling

A success handler is a required function as
an async call when a success response is 
received from the Google reCaptcha endpoint. 

No arguments are required.

### Failure Handling
  
A failure handler is an optional function as 
an async call when a non successful response is 
received from the Google reCaptcha endpoint.
 
A message returned from Google is provided as the only argument.    
  
### Error Handling
  
An error handler is an optional function executed
as an async call when an error occurs during the
recaptcha process.

The first argument is a message containing the error.
  
### Example  
  
```javascript
const recaptcha = require('node-recaptcha');

let successHandler = function () {
    console.log("Hello reCaptcha..");
};

let errorHandler = function (msg) {
    console.log("Oops.. %s", msg);
};

let failureHandler = function (msg) {
    console.log("Forged request? ...%s", msg);
};recaptcha({

    // required values
     
    // the response value supplied by the Google recaptcha service 
    response: "adsflufn3fyqp349gafhm4iyg...", 
    
    // the secret value supplied by the Google reCaptcha API
    secret: "9834pq98gnaiunga...", 
    
    // a function which is called when successfully validated with Google. No arguments supplied
    success: successHandler, 
    
    // optional values
    
    err: errorHandler,
    failure: failureHandler  
});
```
  
  

