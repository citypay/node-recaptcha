const winston = require('winston');
const http = require('https');
const querystring = require('querystring');


/**
 * Function for checking a Google captch
 * @param cfg a config object, see readme.md
 */
module.exports = function (cfg) {

    // set default placeholder functions if not supplied
    if (!cfg.err) {
        cfg.err = () => {
        };
    }
    if (!cfg.failure) {
        cfg.failure = () => {
        };
    }

    // run some valiation first
    if (!cfg.secret) {
        return cfg.err("illegal argument. No secret value");
    }
    if (!cfg.response) {
        return cfg.err("illegal argument. No response value");
    }
    if (!cfg.success) {
        return cfg.err("illegal argument. No success function supplied");
    }

    // setup the captcha check and post off to Google for verification
    // post data for sending to
    let postData = `response=${encodeURIComponent(cfg.response)}&secret=${encodeURIComponent(cfg.secret)}`;

    // ability to bypass captcha's primarily for testing purposes
    if (!cfg.enabled) {
        winston.warn("Google reCaptcha ...Disabled");
        cfg.success();
        return;
    }

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
        winston.debug(`Google SiteVerify ResponseCode: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', data => {
            if (data.success) {
                winston.debug("Google SiteVerify ...OK");
                cfg.success();
            } else {
                winston.warn(`Google SiteVerify ...${data}`);
                cfg.failure(data);
            }
        });
    }).on('error', e => {
        winston.error("Google SiteVerify error: " + e.message);
        cfg.err(e.message);
    }).write(postData);


};

