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

function createTodo(title) {
  return {
    order: todoCounter++,
    title: title,
    completed: false
  }
}
function renderTodos() {
  list.innerHTML = '';
  var filter = filters.querySelector('.selected').dataset.filter;
  todos.forEach(function(todo) {
    if (checkFilter(todo, filter)){
      var clone = emptyItem.cloneNode(true);
      clone.querySelector("label").textContent = todo.title;
      clone.dataset.order = todo.order;
      if (todo.completed) {
        clone.classList.toggle('completed');
      }
      list.appendChild(clone);
    }
  });
  updateCounter();
}

function checkFilter(todo, filter){
  return filter == 'all'||(filter == 'active' && !todo.completed)||(filter == 'completed' && todo.completed);
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

    //DELETE
    var request = getXMLHttpRequest();
    request.open("DELETE", endpoint + "/" + todos[event.target.closest("li").dataset.order].id, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send();

    delete todos[event.target.closest("li").dataset.order];
    renderTodos();
  }
  if (event.target.classList.contains("toggle")){
    todos[event.target.closest("li").dataset.order].completed = !todos[event.target.closest("li").dataset.order].completed;
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
    if (todo.completed) delete todos[todo.order];
  });
  renderTodos();
};






var endpoint = "https://todo-backend-modern-js.herokuapp.com/todos";

function getXMLHttpRequest () {
  if (window.XMLHttpRequest){
    return new XMLHttpRequest();
  }else{
    return new ActiveXObject('Microsoft.XMLHTTP');//for IE<8
  }
}
//GET
window.addEventListener("DOMContentLoaded", function () {
  var request = getXMLHttpRequest();
  request.open("GET", endpoint, true);
  request.setRequestHeader("Content-type", "application/json");
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      var data = JSON.parse(request.responseText);
      data.forEach(function (item) {
        todos.push({
          order: todoCounter++,
          id: item.id,
          title: item.title,
          completed: item.completed
        });
      });
      renderTodos();
    }
  };
  request.send(null);
});

// POST
inputField.addEventListener("keyup",
    function (event) {
      if (event.keyCode === 13 ) {
        var request = getXMLHttpRequest();
        request.open('POST', endpoint, true);
        request.setRequestHeader("Content-type", "application/json; charset=utf-8 ");
        for (var i=0; i<todos.length; i++){
          var data = JSON.stringify(todos[i]);
        }
        request.send(data);
        request.onerror = function () {
          alert("error: "+ request.status);
        };
        request.onloadend = function () {
          todos[todos.length-1].id = JSON.parse(request.responseText).id;
        };
      }
    }, false);