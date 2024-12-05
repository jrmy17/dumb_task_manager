const { User } = require("../models/user");
const Task = require("../models/task");
const dotenv = require("dotenv").config();

jest.mock("../models/user");
jest.mock("../models/task");

test('Création d\'une task',  done => {
    const fakeUser = {
        username: "david",
        password: "0123456789aA$",
        email: 'test@test.com'
    }
    Users.create(fakeUser, (err, res) => {
        if(err){
            done(err);
            return;
        }
        console.log(res)
        const fakeTask = {
            title: "task-test",
            description: "task de test",
            completed: "off",
            userId: res.id
        }
        Tasks.create(fakeTask, function(error, data){
            if(error){
                done(error);
                return;
            }
            try {
                expect(data).toHaveProperty('id');
                done();
            }catch(error){
                done(error)
            }
        })
    })
    
})