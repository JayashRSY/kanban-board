var demo = document.getElementById("demo");
var newTask = document.createElement("p");

function getData() {
    url = "https://api.github.com/users";

    fetch(url).then(res => {
        return res.json();
    }).then(data => {
        console.log(data.length)
        data.forEach(element => {
            newTask = createTask(element.login);
            demo.append(newTask);
        });
    })
}


function createTask(ele) {
    var newTask = document.createElement("p");
    newTask.innerHTML = ele;
    return newTask;
}

function postData() {
    myData = {
        "name": "jayash",
        "salary": "1234",
        "age": "25"
    }
    url = "https://dummy.restapiexample.com/api/v1/create";
    params = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myData)
    }
    fetch(url, params).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
    })
}

postData();
