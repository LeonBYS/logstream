'use strict'

var assert = require('assert');
var request = require('supertest');
var app = require('../server.js');

describe('API base', function() {
    it('response to GET /api/projects', (done) => {
        request(app).get('/api/projects').expect(200, done);
    });
    
    it('response to GET /', (done) => {
        request(app).get('/').expect(200, done);
    });

    it('404 everything else', (done) => {
        request(app).get('/api/some-strange-thing').expect(404, done);
    });

});

describe('API logs', function() {
    it('reponse to POST /api/testProj/testLogname/logs without timestamp', (done) => {
        var log = {logtext:"This is a test msg at " + new Date(Date.now()).toLocaleDateString() + '\n'};
        request(app)
            .post('/api/testProj/testLogname/logs')
            .send(log)
            .expect(200, log, done);
    });

    it('reponse to POST /api/testProj/testLogname/logs with timestamp', (done) => {
        var log = {logtext:"This is a test msg with timestamp\n", timestamp: Date.now()};
        request(app)
            .post('/api/testProj/testLogname/logs')
            .send(log)
            .expect(200, log, done);
    });

    it('reponse to POST /api/testProj/testLogname/logs with invalid log', (done) => {
        var log = {invalid:"This is a test msg with timestamp\n", timestamp: Date.now()};
        request(app)
            .post('/api/testProj/testLogname/logs')
            .send(log)
            .expect(500, {error:'invalid log'}, done);
    });
    
    it('reponse to POST /api/testProj/testLogname/logs with broken log', (done) => {
        request(app)
            .post('/api/testProj/testLogname/logs')
            .send("this is a broken log")
            .expect(500, done);
    });

    it('reponse to GET /api/testProj/testLogname/logs without timestamp', (done) => {
        request(app)
            .get('/api/testProj/testLogname/logs')
            .expect(200, done);
    });

    it('reponse to GET /api/testProj/testLogname/logs with timestamp', (done) => {
        request(app)
            .get('/api/testProj/testLogname/logs?timestamp=' + Date.now())
            .expect(200, [], done);
    });
});

describe('API commands', function() {
    it('response to POST /api/testProj/testLogname/commands', (done) => {
        var log = JSON.stringify({timestamp: Date.now(), logtext:'text from command1\n'});
        var commands = [{name:"command1", url:"http://localhost:3333/api/testProj/testLogname/logs", method:'POST', headers:{'Content-Type':'application/json'}, body:log}, {name:"command2", url:"url2"}];
        request(app)
            .post('/api/testProj/testLogname/commands')
            .send(commands)
            .expect(200, commands, done);
    });

    // it('response to POST /api/LogStream/Console/commands', (done) => {
    //     var log = JSON.stringify({timestamp: Date.now(), logtext:'text from command1\n'});
    //     var commands = [
    //         {
    //             name:"Open-Status-Chart", 
    //             url:"http://localhost:3333/api/open-status-chart",
    //             method:'GET'
    //         }, 
    //         {
    //             name:"Close-Status-Chart", 
    //             url:"http://localhost:3333/api/close-status-chart",
    //             method:'GET'
    //         }
    //     ];
    //     request(app)
    //         .post('/api/LogStream/Console/commands')
    //         .send(commands)
    //         .expect(200, commands, done);
    // });


    it('response to POST /api/testProj/testLogname/commands with broken data', (done) => {
        request(app)
            .post('/api/testProj/testLogname/commands')
            .send("broken data")
            .expect(500, done);
    });

    it('response to POST /api/testProj/testLogname/commands with broken data2', (done) => {
        request(app)
            .post('/api/testProj/testLogname/commands')
            .send([{name:"", url:"url1"}, {url:"url2"}])
            .expect(500, done);
    });

    it('response to GET{EXECUTE} /api/testProj/testLogname/commands/command1', (done) => {
        request(app)
            .get('/api/testProj/testLogname/commands/command1')
            .expect(200, done);
    });

    it('response to GET /api/testProj/testLogname/commands', (done) => {
        request(app)
            .get('/api/testProj/testLogname/commands')
            .expect(200, ['command1', 'command2'], done);
    });

    it('response to DELETE /api/testProj/testLogname/commands', (done) => {
        request(app).delete('/api/testProj/testLogname/commands').expect(200, done);
    });
});

describe('API charts', function() {
    it('response to POST /api/testProj/testLogname/charts/testChart', (done) => {
        request(app)
            .post('/api/testProj/testLogname/charts/testChart')
            .send({chartType:'line', timestamp:2333, data:[{key:'key1', value:1}]})
            .expect(200, {chartType:'line', timestamp:2333, data:[{key:'key1', value:1}]}, done);
    });

    it('response to POST /api/testProj/testLogname/charts/testChart with invalid type', (done) => {
        request(app)
            .post('/api/testProj/testLogname/charts/testChart')
            .send({chartType:'invalid type', timestamp:2333, data:[{key:'key1', value:1}]})
            .expect(500, done);
    });

    it('response to GET /api/testProj/testLogname/charts', (done) => {
        request(app)
            .get('/api/testProj/testLogname/charts')
            .expect(200, ['testChart'], done);
    });

    it('response to GET /api/testProj/testLogname/charts/testChart', (done) => {
        request(app)
            .get('/api/testProj/testLogname/charts/testChart')
            .expect(200, {type:'line', data:{'key1':[[1,2333]]}}, done);
    });

    it('response to DELETE /api/testProj/testLogname/charts/testChart', (done) => {
        request(app)
            .delete('/api/testProj/testLogname/charts/testChart')
            .expect(200, done);
    });
});

