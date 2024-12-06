const server = require('../../app.js');
const session = require('supertest-session');
const supertest = require('supertest');
const requestWithSupertest = supertest(server);
const agent = supertest.agent(server)

let testSession = null;

beforeEach(function () {
    testSession = session(server);
});

afterAll(done => {
    server.close(done);
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

    test('add task empty', function(done){
        authenticatedSession
            .post('/tasks')
            .end(function(err, res){
                if(err){
                    return done(err);
                }
                expect(500)
                return done();
            })    
    })

    test('add task uncomplete', function(done){
        authenticatedSession
            .post('/tasks')
            .send({title: '', description: ''})
            .end(function(err, res){
                if(err){
                    return done(err);
                }
                expect(500)
                return done();
            })    
    })

    test('add task not logged in', function(done){
        requestWithSupertest
            .post('/tasks')
            .send({title: 'test', description: 'test', completed: ''})
            .end(function(err, res){
                if(err){
                    return done(err);
                }
                expect(401)
                return done();
            })   
    })

    test('add task okay', function(done){
        authenticatedSession
            .post('/tasks')
            .send({title: 'test', description: 'test', completed: ''})
            .end(function(err, res){
                if(err){
                    return done(err);
                }
                expect(200)
                return done();
            })    
    })

    test('update task that doesn\'t exist', function(done){
        authenticatedSession
            .put('/tasks/156198741254')
            .end(function(err, res){
                if(err){
                    return done(err);
                }
                expect(404)
                return done();
            })    
    })


    // Impossible de récupérer l'id d'une task appartenant à l'user connecté
    // test('update task uncomplete', function(done){
    //     authenticatedSession
    //         .get('/tasks')
    //         .end(function(err, res){
    //             if(err){
    //                 return done(err);
    //             }
    //             authenticatedSession
    //                 .put('/tasks/'+ res[0].id)
    //                 .send({completed : true})
    //                 .end(function(err, res){
    //                     if(err){
    //                         return done(err);
    //                     }
    //                     expect(200)
    //                     return done();
    //                 })    
    //         })    
    // })

    // test('update task not logged in', function(done){
    //     authenticatedSession
    //         .post('/')
    //         .
    // })

    // test('update task okay', function(done){
    //     authenticatedSession
    //         .post('/')
    //         .
    // })

    // test('delete task that doesn\'t exist', function(done){
    //     authenticatedSession
    //         .post('/')
    //         .
    // })

    // test('delete task not logged in', function(done){
    //     authenticatedSession
    //         .post('/')
    //         .
    // })

    // test('delete task of another user', function(done){
    //     authenticatedSession
    //         .post('/')
    //         .
    // })

    // test('delete task okay', function(done){
    //     authenticatedSession
    //         .post('/')
    //         .
    // })

} )