
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var taskToRemove = ele.parentElement.parentElement.parentElement;
    var id = taskToRemove.parentElement.querySelector(".task-id").innerHTML.split(" ")[1];
    var tableName = taskToRemove.parentElement.getAttribute("class").split(" ")[0];
    deleteOnServer(tableName, id);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    taskToRemove.remove();
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        holdingData["id"] = holdingItem.querySelector(".task-id").innerHTML.split(" ")[1];
        holdingData["name"] = holdingItem.querySelector(".name").innerHTML;
        holdingData["deadline"] = holdingItem.querySelector(".deadline").innerHTML;
        holdingData["assignee"] = holdingItem.querySelector(".assignee").innerHTML;
        holdingData["description"] = holdingItem.querySelector(".description").innerHTML;
        deleteOnServer(holdingItem.parentElement.getAttribute("class").split(" ")[0], holdingData["id"])
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        <p class='task-id'>#TaskId: ${modalData.id}</p>
        <p class='task-btns'>
            <img src='/img/edit.png' onclick='editBtn(this)' id='edit-icon'>
            <img src='/img/bin.png' onclick='deleteBtn(this)' id ='delete-icon'>
        </p> 
    </div>
    <p class='name'>${modalData.name}</p>
    <p class='description'>${modalData.description}<p>
    <p class='displayFlex'>
        <span class='assignee'>${modalData.assignee}</span>
        <span class='deadline'>${modalData.deadline}</span>
    </p>
    `;
    changeId();
    return newTask;
}
//TRACKING WHICH TASK IS IN HOLD
var holdingItem = "";
var holdingData = {};
//DRAG EVENTS ON CARDS
var cards = document.getElementsByClassName("card");
for (cardItem of cards) {
    cardItem.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    cardItem.addEventListener("drop", (e) => {
        e.target.append(holdingItem);
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        createOnServer(holdingData, e.target.getAttribute("class").split(" ")[0]);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    modalData["id"] = taskId;
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    createOnServer(modalData, "todo");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//HANDLING DATA ON SERVER
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//LOADING ALL TASK FROM SERVER ON DOCUMENT LOAD
loadData();
function loadData() {
    loadFromServer("todo");
    loadFromServer("backlogs");
    loadFromServer("progress");
    loadFromServer("testing");
    loadFromServer("done");
}
function loadFromServer(tableName) {
    url = "https://sheetdb.io/api/v1/aagqonwp9i71p?sheet="+tableName;
    fetch(url).then(res => {
        return res.json();
    }).then(data => {
        data.forEach(element => {
            document.querySelector("."+tableName).append(createTask(element));            
        });
    })
}
//CREATING NEWTASK ON SERVER
function createOnServer(modalData, tableName) {
    url = "https://sheetdb.io/api/v1/aagqonwp9i71p?sheet="+tableName;
    params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(modalData)
    }
    fetch(url, params).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
    })
}
//DELETING ON SERVER
function deleteOnServer(tableName, id) {
    url = "https://sheetdb.io/api/v1/aagqonwp9i71p/id/"+id+"?sheet="+tableName;
    params = {
        method: "DELETE",
        headers: {
            "Content-Type": "apllication/json"
        }
    }
    fetch(url, params).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
    })
}