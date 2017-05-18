const winston = require('winston');
const http = require('https');
const querystring = require('querystring');


/**
 * Function for checking a Google captch
 * @param err function run should an error occur
 * @param failure function run should a failure occur
 * @param success function run when the capture is deemed as being good
 * @param response
 * @param secret
 */
module.exports = function (err, failure, success, response, secret,) {

    // setup the captcha check and post off to Google for verification
    // post data for sending to
    let postData = `response=${encodeURIComponent(response)}&secret=${encodeURIComponent(secret)}`;

    // check the incoming captcha settings and if correct then continue
    http.request({
        hostname: 'www.google.com',
        port: 443,
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    }, res => {
        winston.info(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', data => {
            winston.debug(`Google SiteVerify Response Data ${JSON.stringify(data)}`);
            if (data.success) {
                success();
            } else {
                failure(data);
            }
        });
    }).on('error', e => {
        winston.info("Google SiteVerify error: " + e.message);
        err();
    }).write(postData);

};

