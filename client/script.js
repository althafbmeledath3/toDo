//store the current editing id
current_id = null

document.getElementById('form').addEventListener('submit', async (e)=>{
    e.preventDefault()
    let task = document.getElementById("task_input").value
    //now call the api to send data using post
    if(current_id){
        await updateTask(current_id,task)
    }
    else{
        await addTask(task)
    }
})

//function to edit Tasks
async function editTask(id,upTask) {
    document.getElementById('task_input').value = upTask
    document.getElementById('sbmt').innerHTML = "Update"
    current_id = id
    
}

//function to update Task
async function updateTask(id,updated_task) {
    try{
        const response = await fetch(`/edit/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: updated_task }),
        });
        if (response.ok) {
            alert("Task Updated");
            loadData();
        } 
    }
    catch(error){
        console.log(error)
    }
}


//fucntion to addTasks
async function addTask(task){
    try{

        const response = await fetch('/send-data',{
            method:"POST",
            headers:{'Content-Type':"application/json"},
            body:JSON.stringify({task})
        })
        const data = await response.json()
        if(response.status==201){
            loadData()
            alert("Task Added")
        }
        else{
            alert(data.error)
        }
    }
    catch(error){
        console.log(error)
    }
}

async function loadData() {
    let todo = document.getElementById("test");
    let response = await fetch("/tasks");
    let data = await response.json();
    let str = "";
    data.forEach((element) => {
      str += `  <div class="todos" id="todos">
        <h1>${element.task}</h1>
        <div class="btn">
            <button onClick='editTask("${element._id}","${element.task}")'>Edit</button>
            <button onClick='deleteTask("${element._id}")'>Delete</button>
            </div>
        </div>
    </div>`;
    });
    todo.innerHTML = str;
  }

  //function to delete task
  async function deleteTask(id) {
    
    const response = await fetch(`/delete/${id}`)
    
    if(response.ok){
        window.location.reload()
    }
  }



  window.onload = function () {
    loadData();
  };








