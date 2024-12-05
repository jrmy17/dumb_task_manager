const { User } = require("../models/user");
const Task = require("../models/task");
const dotenv = require("dotenv").config();

jest.mock("../models/user");
jest.mock("../models/task");

describe("Tests des tâches", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Création d'une task", (done) => {
    const fakeUser = {
      id: 1,
      username: "david",
      password: "0123456789aA$",
      email: "test@test.com",
    };

    const fakeTask = {
      id: 1,
      title: "task-test",
      description: "task de test",
      completed: false,
      userId: fakeUser.id,
    };

    User.create.mockImplementation((userData, callback) => {
      callback(null, fakeUser);
    });

    Task.create.mockImplementation((taskData, callback) => {
      callback(null, fakeTask);
    });

    User.create(fakeUser, (err, user) => {
      expect(err).toBeNull();

      const taskToCreate = {
        title: "task-test",
        description: "task de test",
        completed: "off",
        userId: user.id,
      };

      Task.create(taskToCreate, (error, task) => {
        expect(error).toBeNull();
        expect(task).toHaveProperty("id");
        expect(task.title).toBe(fakeTask.title);
        expect(task.description).toBe(fakeTask.description);
        done();
      });
    });
  }, 10000);
});
