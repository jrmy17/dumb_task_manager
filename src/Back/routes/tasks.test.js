const server = require('../../app.js');
const session = require('supertest-session');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);

let testSession = null;

beforeEach(function () {
    testSession = session(server);
});

describe( 'Tasks router test', () => {

    let authenticatedSession;

    beforeEach(function (done) {
        testSession.post('/login')
            .send({ username: 'admin', password: 'admin123'})
            .end(function (err) {
                if (err) return done(err);
                authenticatedSession = testSession;
                return done();
            });
    });

    test('dashboard not logged in', async () => {
        const res = await requestWithSupertest.get('/tasks');
        expect(res.status).toEqual(401);
    })

    test('dashboard logged in', function(done){

        authenticatedSession
            .get('/tasks')
            .expect(200)
            .end(function(err, res){
                if(err){
                    return done(err);
                }
                return done();
            })    
    })

    test('add task', function(done){
        
    })

} )