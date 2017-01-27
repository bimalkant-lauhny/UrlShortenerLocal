const express = require('express');
const assert = require('assert');
const nedb = require('nedb');
const operateDb = require('./operate_db');

var app = express(); 
var db = new nedb({filename: './data', autoload: true});

db.find({}, function (err, result) {
    if (result.length === 0){
        db.insert({
            'index': 1,
            'url': 'http://freecodecamp.com'
        }, function (err, result) {
            assert.equal(null, err); 
            console.log('Successfully initialized database!');
        });        
    }
});

function inputHandler(request, response) {
    var addUrl = request.params.Uid.split('.');
    try {
        if (addUrl[addUrl.length - 1] != 'com') {
            throw new Error('use only .com urls!'); 
        }
       
        operateDb.findDocument(db, {
            "url": "http://" + request.params.Uid
        }, function (err, result) {
            assert.equal(null, err);
            console.log('Found results: ', result);
            if (result == null) {

                operateDb.findMaxIndex(db, function (err, result) {
                    assert.equal(null, err);
                    console.log('Max index here: ', result);
                     
                    var insDoc = {
                        'index': result + 1,
                        'url': 'http://' + request.params.Uid
                    };

                    operateDb.insertDocument(db, insDoc, function (err, result) {
                        assert.equal(null, err); 
                        console.log('Successfully Inserted Doc!');
                        response.json({
                            'url': insDoc.url,
                            'shortenedUrl': '' + '/' + insDoc.index
                        });
                    });  
                   
                });
                 
            } else {
                response.json({
                    'url': 'http://' + request.params.Uid,
                    'shortenedUrl': '' + '/' + result.index
                });
            }
        });

    } catch (err) {
        response.send(err); 
    }
};

app.all('/http://:Uid', inputHandler);
app.all('/https://:Uid', inputHandler);
app.all('/:inx', function (request, response) {
    console.log('inx handler: ', request.params.inx);
    try {
        var inx = Number(request.params.inx);
        if (isNaN(inx)) {
            throw new Error('This url does not exist!'); 
        }

        operateDb.findDocument(db, {'index': inx}, function (err, result) {
            assert.equal(null, err);

            if (result == null) {
                response.send('This url does not exist!'); 
            } else {
                console.log('Matched url: ', result);
                response.redirect(result.url);
            }
        });
        
    } catch (err) {
        response.send(err.message);
    }
});

app.listen(3000);
