'use strict'

var assert = require('assert');
var request = require('supertest');
var app = require('../server.js');

describe('test api', function() {
    it('response to GET /api/projects', (done) => {
        request(app).get('/api/projects').expect(200, done);
    });

    it('reponse to POST /api/testProj/testLogname/logs', (done) => {
        request(app)
            .post('/api/testProj/testLogname/logs')
            .set('Content-Type', 'text/plain')
            .send("This is a test msg at" + new Date(Date.now()).toLocaleDateString())
            .expect(200, done);
    });

    it('reponse to GET /api/testProj/testLogname/logs', (done) => {
        request(app)
            .get('/api/testProj/testLogname/logs')
            .expect(200, done);
    });

    it('response to POST /api/testProj/testLogname/commands', (done) => {
        request(app)
            .post('/api/testProj/testLogname/commands')
            .send([{name:"command1", url:"url1"}, {name:"command2", url:"url2"}])
            .expect(200, done);
    });

    it('response to GET /api/testProj/testLogname/commands', (done) => {
        request(app).get('/api/testProj/testLogname/commands').expect(200, done);
    });

    it('response to DELETE /api/testProj/testLogname/commands', (done) => {
        request(app).delete('/api/testProj/testLogname/commands').expect(200, done);
    });

    it('404 everything else', (done) => {
        request(app).get('/api/some-strange-thing').expect(404, done);
    });
});

