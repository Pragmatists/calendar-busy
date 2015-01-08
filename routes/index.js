var express = require('express');
var router = express.Router();
var google = require('googleapis');


var SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
var KEY = process.env.GOOGLEAPI_PRIVATEKEY;

var jwt = new google.auth.JWT(
    SERVICE_ACCOUNT_EMAIL,
    null,
    KEY,
    ['https://www.googleapis.com/auth/calendar.readonly']);


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

router.get('/salka-duza', function (req, res) {
    jwt.authorize(function (err, result) {
        console.log(err);
        console.log(result);

        google
            .calendar('v3').freebusy.query({
                resource: {
                    timeMin: new Date().toISOString(),
                    timeMax: new Date(new Date().getTime() + 1000).toISOString(),
                    items: [
                        {
                            id: 'salka-duza@pragmatists.pl'
                        }
                    ]
                },
                auth: jwt
            }, function (err, result) {
                console.log(err);
                console.log(result);
                console.log(result.calendars['salka-duza@pragmatists.pl'].busy);
                console.log(result.calendars['salka-duza@pragmatists.pl'].errors);
                res.json(result.calendars['salka-duza@pragmatists.pl'].busy);
            });
    });
});


module.exports = router;
