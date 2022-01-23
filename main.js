// Get all Selectors
const todoInput = document.querySelector(".todo-input");
const addbtn = document.querySelector("#addbtn");
const delbtn = document.querySelector("#delbtn");
const todoList = document.querySelector(".todo-list");

editIconClass = "fa-edit";
saveIconClass = "fa-save";

// Create Event Listeners
addbtn.addEventListener("click", addTodo);

delbtn.addEventListener("click", () => {
  setTodos([]);
  todoList.innerHTML = "";
});

let id =
  getTodos().length > 0 ? getTodos().reduce((a, b) => Math.max(a.id, b.id)) : 0;

function load() {
  getTodos().forEach((t) => {
    addTodo(null, t);
  });
}
load();

function createIcon(iconClass) {
  let icon = document.createElement("icon");
  icon.classList.add("fas");
  icon.classList.add(iconClass);
  return icon;
}

function createButton(iconClass, buttonClass, handler) {
  let button = document.createElement("button");
  button.classList.add(buttonClass);
  button.addEventListener("click", (e) => handler(e, button, icon));
  let icon = createIcon(iconClass);
  button.append(icon);
  return button;
}

// Add function to add the todo
function addTodo(e, todo) {
  console.log(todo);
  if (e) e.preventDefault();
  let value = todoInput.value;

  if (!todo) {
    todos = getTodos();
    todos.push({ value, id });
    setTodos(todos);
  }

  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  todoDiv.dataset.id = todo ? todo.id : id;
  if (!todo) id++;

  // add an li element
  const newTodo = document.createElement("li");
  newTodo.innerText = todo ? todo.value : todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);

  todoDiv.appendChild(createButton("fa-check", "completed-btn", toggleChecked));
  todoDiv.appendChild(createButton("fa-trash-alt", "remove-btn", del));
  todoDiv.appendChild(createButton(editIconClass, "edit-btn", editTask));

  // Now Append to list ,the Div we created
  todoList.appendChild(todoDiv);
  // to clear the input filed after add a task
  if (!todo) todoInput.value = "";
}

function getTodo(parent) {
  return getTodos().find((t) => t.id === Number(parent.dataset.id));
}

function setTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  stored = localStorage.getItem("todos");
  return stored ? JSON.parse(stored) : [];
}

function setTodoAttr(parent, attr, value) {
  let todos = getTodos();
  try {
    todos.find((t) => t.id === Number(parent.dataset.id))[attr] = value;
    setTodos(todos);
  } catch {
    return;
  }
}

function editTask(e, button, icon) {
  let parent = e.target.parentElement;
  Boolean(parent.dataset.editing) ? save(parent, button) : edit(parent, button);
}

function edit(parent, button) {
  let child = parent.firstChild;
  let form = document.createElement("form");
  let input = document.createElement("input");
  input.classList.add("todo-input");
  input.value = child.innerText;
  input.focus()
  form.appendChild(input);
  parent.firstElementChild.replaceWith(form);
  parent.dataset.editing = "true";
  button.innerHTML = "";
  button.append(createIcon(saveIconClass));
}

function save(parent, button) {
  let value = parent.firstElementChild.firstElementChild.value;
  setTodoAttr(parent, "value", value);
  let display = document.createElement("li");
  display.innerText = value;
  display.classList.add("todo-item");
  parent.firstElementChild.replaceWith(display);
  parent.dataset.editing = "";
  button.innerHTML = ''
  button.append(createIcon(editIconClass))
}

function toggleChecked(e) {
  parent = e.target.parentElement;
  setTodoAttr(parent, "done", e.target.classList.toggle("checked"));
}

function del(e) {
  parent = e.target.parentElement;
  todos = getTodos();
  todos = todos.filter((t) => t.id !== Number(parent.dataset.id));
  setTodos(todos);
  parent.remove();
}

function findChild(el, criterion, include = true) {
  if (criterion(el) && include) return el;
  for (child of el.children) {
    if (criterion(child)) return child;
    findChild(child, criterion);
  }
}
