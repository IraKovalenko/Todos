// Code goes here
var list = document.getElementsByClassName("todo-list")[0];
var inputField = document.getElementsByClassName("new-todo")[0];
var emptyItem = document.getElementsByClassName("empty-item")[0].children[0];
var counter = document.getElementsByClassName("todo-count")[0];
var footer = document.getElementsByClassName("footer")[0];

var updateCounter = function(){
  counter.querySelector("strong").innerHTML = list.children.length;
}
updateCounter();
var todos = [];
var todoCounter = 0;

function createTodo(text) {
  return {
    id: todoCounter++,
    text: text, 
    isCompleted: false
  }
}

function taskStatus(event){
  if (event.target.classList.contains("destroy")) {
      event.target.closest("li").remove();
// delete element from array
//     todos.splice(parseInt(event.target.closest("li").id));
    updateCounter();
  } else {
    event.target.closest("li").classList.toggle("completed");
    todos.forEach(function(todo){
      if(todo.id + "-todo" === event.target.closest("li").id) {
        todo.isCompleted = true;
      }
    });
  }
}

function renderTodos(filter) {
  list.innerHTML = '';

  function cloneEl(todo) {
    var cloned = emptyItem.cloneNode(true);
    cloned.querySelector("label").textContent = todo.text;
    cloned.setAttribute("id", todo.id + "-todo");
    cloned.onclick = taskStatus;

    if(todo.isCompleted) {
      cloned.classList.add("completed");
    }
    list.appendChild(cloned);
  }

  if (!filter) {
    todos.forEach(function(todo) {
      cloneEl(todo);
    })
  } else if (filter === 'completed') {
    todos.forEach(function(todo) {
      if (todo.isCompleted) {
        cloneEl(todo);
      }
    })
  } else if (filter === 'active') {
    todos.forEach(function(todo) {
      if (!todo.isCompleted) {
        cloneEl(todo);
      }
    })
  }
  updateCounter();
}

inputField.onkeyup = function addTask(event) {
  if (event.keyCode === 13 ) {
    var task = inputField.value;
    todos.push(createTodo(task));
    renderTodos();
    inputField.value = "";
  }
  updateCounter();
}


footer.onclick = function filterList(event){
  var filters = footer.querySelectorAll('a');
  function changeFilter() {
    for (var i = 0; i < filters.length;  i++){
      if (event.target === filters[i]) {
        filters[i].classList.add('selected');
      } else {
        filters[i].classList.remove('selected');
      }
    }
  }
  if (event.target.dataset.filter === "all"){
    changeFilter();
    renderTodos();
  } else if (event.target.dataset.filter === "active"){
    changeFilter()
    renderTodos("active");
  } else if (event.target.dataset.filter === "completed"){
    changeFilter()
    renderTodos("completed");
  }
}
