const { JSDOM } = require("jsdom");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

describe("Task Display Tests", () => {
  let dom;
  const templatePath = path.join(__dirname, "../views/pages/dashboard.ejs");
  const template = fs.readFileSync(templatePath, "utf8");

  beforeEach(() => {
    dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    global.document = dom.window.document;
  });

  test("completed task should have green border and strikethrough title", async () => {
    const data = [
      {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        completed: true,
      },
    ];

    const contentFor = () => {};

    const html = await ejs.render(
      template,
      {
        data,
        contentFor,
      },
      { async: true }
    );

    const taskHtml = html
      .split('<div class="grid gap-4">')[1]
      .split("</div>")[0];
    dom.window.document.body.innerHTML = `<div class="grid gap-4">${taskHtml}</div>`;

    const taskElement = dom.window.document.querySelector(".bg-white");
    const titleElement = taskElement.querySelector("h3");

    expect(taskElement.classList.contains("border-l-4")).toBeTruthy();
    expect(taskElement.classList.contains("border-green-500")).toBeTruthy();
    expect(titleElement.classList.contains("line-through")).toBeTruthy();
    expect(titleElement.classList.contains("text-gray-500")).toBeTruthy();
  });

  test("uncompleted task should not have green border or strikethrough", async () => {
    const data = [
      {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        completed: false,
      },
    ];

    const contentFor = () => {};

    const html = await ejs.render(
      template,
      {
        data,
        contentFor,
      },
      { async: true }
    );

    const taskHtml = html
      .split('<div class="grid gap-4">')[1]
      .split("</div>")[0];
    dom.window.document.body.innerHTML = `<div class="grid gap-4">${taskHtml}</div>`;

    const taskElement = dom.window.document.querySelector(".bg-white");
    const titleElement = taskElement.querySelector("h3");

    expect(taskElement.classList.contains("border-l-4")).toBeFalsy();
    expect(taskElement.classList.contains("border-green-500")).toBeFalsy();
    expect(titleElement.classList.contains("line-through")).toBeFalsy();
    expect(titleElement.classList.contains("text-gray-500")).toBeFalsy();
  });
});
