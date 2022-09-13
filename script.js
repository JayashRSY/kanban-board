
//GENERATING RANDOM 5 DIGIT TASK ID
var taskId = Math.floor(Math.random() * 90000) + 10000;
function changeId() {
    taskId = Math.floor(Math.random() * 90000) + 10000;
}

//HANDLING TASK EDIT BTN
function editBtn(ele) {
    var taskElement = ele.parentElement.parentElement.parentElement;
    var name = taskElement.querySelector(".name").innerHTML;
    var deadline = taskElement.querySelector(".deadline").innerHTML;
    var assignee = taskElement.querySelector(".assignee").innerHTML;
    var description = taskElement.querySelector(".description").innerHTML;
    //LOADING TASK DATA IN MODAL
    document.getElementById("task-name").value = name;
    document.getElementById("task-deadline").value = deadline;
    document.getElementById("task-assignee").value = assignee;
    document.getElementById("task-description").value = description;

    trackingTask = taskElement;
    openModalForSave();
}
//HANDLING DELETE BTN
function deleteBtn(ele) {
    ele.parentElement.parentElement.parentElement.remove();
}
//TRACKING TASK FOR EDITING AND UPDATING
var trackingTask = "";
//CREATING TASK IN TODOLIST
function createTask(modalData) {
    var newTask = document.createElement("div");
    newTask.setAttribute("class", "task");
    newTask.setAttribute("draggable", "true");

    //ADDING HOLDING AND UNHOLDING EVENTS IN NEWTASK
    newTask.addEventListener("dragstart", (e) => {
        holdingItem = e.target;
        e.target.classList.add("hold");
        setTimeout(() => {
            e.target.classList.add("unhold");
        }, 0);
    });

    newTask.addEventListener("dragend", (e) => {
        e.target.classList.remove("hold");
        e.target.classList.remove("unhold");
        holdingItem = e.target;
    });

    newTask.innerHTML = `
    <div class='task-bar'>
        <p class='task-id'>#TaskId: `+ taskId + `</p>
        <p class='task-btns'>
            <img src='./img/edit.png' onclick='editBtn(this)' id='edit-icon'>
            <img src='./img/bin.png' onclick='deleteBtn(this)' id ='delete-icon'>
        </p> 
    </div>
    <p class='name'>`+ modalData.name + `</p>
    <p class='description'>`+ modalData.description + `<p>
    <p class='displayFlex'>
        <span class='assignee'>`+ modalData.assignee + `</span>
        <span class='deadline'>`+ modalData.deadline + `</span>
    </p>
    `;
    changeId();
    return newTask;
}
//TRACKING WHICK TASK IS IN HOLD
var holdingItem = "";
//DRAG EVENTS ON CARDS
var cards = document.getElementsByClassName("card");
for (cardItem of cards) {
    cardItem.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    cardItem.addEventListener("drop", (e) => {
        e.target.append(holdingItem);
    });
};
//HANDLING MODAL FORM ADD TASK BUTTON
function openModalForAdd() {
    document.querySelector(".modal-bg").classList.add("view-modal");
    document.querySelector(".add-btn").classList.remove("hide-btn");
    document.querySelector(".save-btn").classList.add("hide-btn");
}
function openModalForSave() {
    document.querySelector(".modal-bg").classList.add("view-modal");
    document.querySelector(".add-btn").classList.add("hide-btn");
    document.querySelector(".save-btn").classList.remove("hide-btn");
}
//CREATING MODAL DATA OBJECT
function createModalDataObject() {
    var name = document.getElementById("task-name").value;
    var deadline = document.getElementById("task-deadline").value;
    var assignee = document.getElementById("task-assignee").value;
    var description = document.getElementById("task-description").value;

    var modalData = {};
    modalData["name"] = name;
    modalData["deadline"] = deadline; closeBtn
    modalData["assignee"] = assignee;
    modalData["description"] = description;

    return modalData;
}
//MODAL ADD BTN
function addBtn() {
    var modalData = createModalDataObject();
    var newTask = createTask(modalData);
    document.querySelector(".todo").append(newTask);

    closeBtn();
}
//MODAL SAVE BTN
function saveBtn(ele) {
    var modalData = createModalDataObject();
    trackingTask.querySelector(".name").innerHTML = modalData.name;
    trackingTask.querySelector(".deadline").innerHTML = modalData.deadline;
    trackingTask.querySelector(".assignee").innerHTML = modalData.assignee;
    trackingTask.querySelector(".description").innerHTML = modalData.description;

    closeBtn();
}
//MODAL CLOSE BTN
function closeBtn() {
    document.getElementById("task-name").value = "";
    document.getElementById("task-deadline").value = "";
    document.getElementById("task-assignee").value = "";
    document.getElementById("task-description").value = "";

    document.querySelector(".modal-bg").classList.remove("view-modal");
}



// AJAX CALLS AND SAVING DATA IN LOCAL STORAGE

// LOADING DATA FROM LOCAL AND ADDING IN DOM
// window.onload = function showTasks() {
//     var todoData = JSON.parse(localStorage.getItem("todo"));
//     var backlogsData = JSON.parse(localStorage.getItem("backlogs"));
//     var progressData = JSON.parse(localStorage.getItem("progress"));
//     var testingData = JSON.parse(localStorage.getItem("testing"));
//     var doneData = JSON.parse(localStorage.getItem("done"));

//     if (todoData != null && Object.keys(todoData).length != 0) loadTasksList(todoData, "backlogs");
//     if (backlogsData != null && Object.keys(backlogsData).length != 0) loadTasksList(backlogsData, "progress");
//     if (progressData != null && Object.keys(progressData).length != 0) loadTasksList(progressData, "testing");
//     if (testingData != null && Object.keys(testingData).length != 0) loadTasksList(testingData, "done");
//     if (doneData != null && Object.keys(doneData).length != 0) loadTasksList(doneData, "done");

// }
// function loadTasksList(localData, taskListName) {

//     for (k of Object.keys(localData)) {
//         console.log();
//         createTask(localData, taskListName, k);
//     }
// }
// // SAVING MODAL DATA TO LOCAL
// function saveToLocal(modalData, whereToAdd, taskId) {
//     var localData = JSON.parse(localStorage.getItem(whereToAdd));
//     if (localData == null) {
//         localData = {};
//     }
//     localData[taskId] = modalData;
//     localStorage.setItem(whereToAdd, JSON.stringify(localData));
// }
//SAVING DATA TO SERVER USING AJAX
// sample modal data
// modalData = {
//     taskId : {
//         "name": "Create kanban board",
//         "deadine": "11/12/22",
//         "assignee": "john doe",
//         "description": "1. create tasks, 2. create todo list"
//     }
// }
// whereToAdd = todo, backlogs, progress, testing, done
// function saveToServer(modalData, whereToAdd, taskId) {
//     var localData = {};
//     //GETTING DATA TO SERVER
//     var xhrLocal = new XMLHttpRequest();
//     xhrLocal.open("GET", whereToAdd + ".txt", true);
//     xhrLocal.send();
//     xhrLocal.onload = () => {
//         if (this.readyState == 4 && this.status == 200) {
//             localData = JSON.parse(this.responseText);
//             // console.log(localData)
//             alert("Success!");
//         } else {
//             alert("Some error occured!");
//         }
//     }

//     localData[taskId] = modalData;
//     // console.log(localData)
//     //SENDING DATA TO SERVER
//     var xhr = new XMLHttpRequest();
//     xhr.open("post", whereToAdd + ".txt", true);
//     xhr.send(JSON.stringify(localData));

//     xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

// }

//HANDLING TASK DELETE BTN
// var isEditingModal = false;
// var editingTask = "";

// DELETING TASK OF GIVEN ID FROM LOCAL STORAGE
// function deleteInLocal(idDelete, taskListName) {
//     var localData = JSON.parse(localStorage.getItem(taskListName));
//     delete localData[idDelete];
//     localStorage.setItem(taskListName, JSON.stringify(localData));
// }
