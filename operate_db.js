const assert = require('assert');

exports.insertDocument = function (db, doc, callback) {
    console.log(doc);
    db.insert(doc, function (err, result) {
        assert.equal(null, err);
        console.log('Inserted Document successfully!');
        callback(null, result);
    });
};

exports.findDocument = function (db, doc, callback) {
    db.findOne(doc, function (err, result) {
        assert.equal(null, err); 
        console.log(result);
        callback(null, result);
    });
};

exports.findMaxIndex = function (db, callback) {
    db.find({}).sort({'index': -1}).exec(function (err, result) {
        assert.equal(null, err);
        console.log('Completed aggregation max search: ', result);  
        callback(null, result[0].index);
    });
};
