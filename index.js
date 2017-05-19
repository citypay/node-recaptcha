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
        cfg.err = () => {};
    }
    if (!cfg.failure) {
        cfg.failure = () => {};
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

    return {
        exec: function () {

            // setup the captcha check and post off to Google for verification
            // post data for sending to
            let postData = `response=${encodeURIComponent(cfg.response)}&secret=${encodeURIComponent(cfg.secret)}`;

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
                        cfg.success();
                    } else {
                        cfg.failure(data);
                    }
                });
            }).on('error', e => {
                winston.info("Google SiteVerify error: " + e.message);
                cfg.err(e.message);
            }).write(postData);
        }
    };


};

