// Code goes here
var list = document.getElementsByClassName("todo-list")[0];
var inputField = document.getElementsByClassName("new-todo")[0];
var emptyItem = document.getElementsByClassName("empty-item")[0].children[0];
var counter = document.getElementsByClassName("todo-count")[0];
var filters = document.getElementsByClassName("filters")[0];
var clear = document.getElementsByClassName("clear-completed")[0];
var todos = [];
var todoCounter = 0;

var updateCounter = function(){
  counter.querySelector("strong").innerHTML = list.children.length+"";
};
updateCounter();

function createTodo(text) {
  return {
    id: todoCounter++,
    text: text,
    isCompleted: false
  }
}

function renderTodos() {
  list.innerHTML = '';
  var filter = filters.querySelector('.selected').dataset.filter;
  todos.forEach(function(todo) {
    if (checkFilter(todo, filter)){
      var clone = emptyItem.cloneNode(true);
      clone.querySelector("label").textContent = todo.text;
      clone.dataset.id = todo.id;
      if (todo.isCompleted) {
        clone.classList.toggle('completed');
      }
      list.appendChild(clone);
    }
  });
  updateCounter();
}

function checkFilter(todo, filter){
  return filter=='all'||(filter == 'active' && !todo.isCompleted)||(filter=='completed'&&todo.isCompleted);
}
inputField.onkeyup = function addTask(event) {
  if (event.keyCode === 13) {
    var task = inputField.value;
    todos.push(createTodo(task));
    renderTodos();
    inputField.value = "";
  }
};
list.onclick = function taskStatus(event){
  if (event.target.classList.contains("destroy")) {
    delete todos[event.target.closest("li").dataset.id];
    renderTodos();
  }
  if (event.target.classList.contains("toggle")){
    todos[event.target.closest("li").dataset.id].isCompleted = !todos[event.target.closest("li").dataset.id].isCompleted;
    event.target.closest("li").classList.toggle("completed");
  }
};

filters.onclick = function changeFilter(event) {
  filters.querySelector('.selected').classList.remove('selected');
  event.target.classList.add('selected');
  renderTodos();
};

clear.onclick = function clearCompleted(){
  todos.forEach(function(todo) {
    if (todo.isCompleted) delete todos[todo.id];
  });
  renderTodos();
};
