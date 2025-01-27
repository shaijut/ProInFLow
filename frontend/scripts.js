// Fetch the existing todo list from the API (replace with actual API)  
const apiUrl = 'http://localhost:5083/api/Todo'; // Example API URL

// DOM elements
const todoListContainer = document.getElementById('todoList');
const addTodoBtn = document.getElementById('addTodoBtn');
const newTodoInput = document.getElementById('newTodo');
const focusTodoTitle = document.getElementById('focusTodoTitle');
const closePopup = document.getElementById('closePopup');
const startPomodoroBtn = document.getElementById('startPomodoroBtn');
const pageWrapper = document.getElementById('pageWrapper');

// Event listener to add a new todo
addTodoBtn.addEventListener('click', async () => {
    const newTodoText = newTodoInput.value.trim();
    if (newTodoText === '') return;

    // Add the new todo to the list (send it to the API)
    const newTodo = { title: newTodoText, isCompleted: false };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        });

        const addedTodo = await response.json();
        newTodoInput.value = '';
        renderTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
    }
});

// Function to fetch and render todos
async function renderTodos() {
    try {
        const response = await fetch(apiUrl);
        const todos = await response.json();

        todoListContainer.innerHTML = ''; // Clear the list first

        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.innerHTML = `
                <div class="input-group mb-3">
                    <input type="text" class="form-control form-control-lg todo-text" value="${todo.title}" ${todo.isCompleted ? 'disabled' : ''}>
                    <button class="btn btn-outline-secondary btn-focus" data-todo-id="${todo.id}"><i class="fa fa-eye" aria-hidden="true"></i></button>
                    <button class="btn btn-outline-primary btn-edit" data-id="${todo.id}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                    <button class="btn btn-outline-danger btn-delete" data-id="${todo.id}"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    <button class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#agentModal"><i class="fa fa-plus" aria-hidden="true"></i> Delegate </button>
                    </div>
            `;
            todoListContainer.appendChild(todoItem);

            // Focus button event listener
            todoItem.querySelector('.btn-focus').addEventListener('click', () => {
                focusTodoTitle.textContent = todo.title;
                const todoId = todo.id; // Capture the todo ID

                // Show the Bootstrap modal
                const focusModal = new bootstrap.Modal(document.getElementById('focusModal'));
                focusModal.show();

                // Blur the rest of the page
                pageWrapper.classList.add('blurred');

  
            });

            startPomodoroBtn.addEventListener('click', () => {
                
                const focusModal = bootstrap.Modal.getInstance(document.getElementById('focusModal'));
                focusModal.hide();

                focusTodoTitle.textContent = todo.title;
                const todoId = todo.id; // Capture the todo ID
                
            // Start Pomodoro with the specific todo ID
                startPomodoro(todoId, todo.title);
            });

            // Edit button event listener
            todoItem.querySelector('.btn-edit').addEventListener('click', async () => {
                const updatedText = todoItem.querySelector('.todo-text').value;
                if (updatedText !== todo.title) {
                    const updatedTodo = { title: updatedText, isCompleted: todo.isCompleted };

                    try {
                        await fetch(`${apiUrl}/${todo.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedTodo),
                        });

                        renderTodos(); // Re-render the list after editing
                    } catch (error) {
                        console.error('Error updating todo:', error);
                    }
                }
            });

            // Delete button event listener
            todoItem.querySelector('.btn-delete').addEventListener('click', async () => {
                try {
                    await fetch(`${apiUrl}/${todo.id}`, {
                        method: 'DELETE',
                    });
                    renderTodos(); // Re-render the list after deleting
                } catch (error) {
                    console.error('Error deleting todo:', error);
                }
            });



             // Add event listener to the button inside each todo item
  const delegateButton = document.querySelector(`[data-todo-id='${todo.id}']`);
  
  delegateButton.addEventListener("click", function () {
    // Set task-specific details in the modal when clicked
    const taskId = todo.id;
    const taskName = todo.title;

    // Set TaskId and TaskName into hidden input fields in modal (or dynamically if needed)
    document.getElementById("userInput").value = ''; // Clear any previous value
    // You can dynamically display TaskId and TaskName inside the modal if needed
    const modalHeader = document.querySelector(".modal-title");
    modalHeader.innerText = `Delegate Task: ${taskName}`; // Example to show the task name in modal title
    
    // Setup agent checkboxes dynamically
    const agentCheckboxesContainer = document.getElementById("agentCheckboxes");
    agentCheckboxesContainer.innerHTML = ''; // Clear previous checkboxes if any

    // You can dynamically populate agents here (for example, you could have an array of agent names)
    const agentNames = ['Agent1', 'Agent2', 'Agent3'];  // Example list of agents
    agentNames.forEach(agent => {
      const checkboxDiv = document.createElement('div');
      checkboxDiv.classList.add('form-check');
      checkboxDiv.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${agent}" id="agent-${agent}">
        <label class="form-check-label" for="agent-${agent}">${agent}</label>
      `;
      agentCheckboxesContainer.appendChild(checkboxDiv);
    });
  });
  
  // Add event listener for the form submission inside the modal
  document.getElementById("agentForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

        // Disable the submit button to prevent multiple submissions
        const submitButton = e.target.querySelector("button[type='submit']");
        if (submitButton.disabled) return;

    // Get user input and selected agents
    const userInput = document.getElementById("userInput").value;
    const agentCheckboxes = document.querySelectorAll("#agentCheckboxes input[type='checkbox']");
    let selectedAgents = Array.from(agentCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    // Check if "Do all end to end" is selected
    const doAllEndToEnd = document.getElementById("doAllEndToEnd").checked;



    if (!doAllEndToEnd && selectedAgents.length === 0) {
        alert("Please select at least one agent.");
        submitButton.disabled = false; // Re-enable button
        return;
      }

      if (doAllEndToEnd) {
        // Hardcode agent names if "Do All End-to-End" is selected
        selectedAgents = [
          "Requirements Planner", 
          "Code Writing Agent",
          "Code Review Agent",
          "Unit Test Generation Agent",
          "Bug Detection Agent"
        ];
      }

    // Prepare the payload with TaskId, TaskName, UserInput, and selected Agent Names
    const payload = {
        TaskId: todo.id,        // TaskId from the todo object
        TaskName: todo.title,   // TaskName from the todo object
        UserInput: userInput,   // User input from modal input field
        AgentNames: selectedAgents, // Selected agents
        DoAllEndToEnd: doAllEndToEnd // Whether to process end-to-end
    };

    submitButton.disabled = true;

    // Call the API
    fetch("http://localhost:5083/AutoAgents/invoke-agents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        console.log("Immediate response:", data);


    const successMessage = data.message;

    // Find the modal body using ID
    const modalBody = document.querySelector("#agentModal .modal-body");

    // Create a new div element for the success alert
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-success";  // Green success alert
    alertDiv.role = "alert";  // Add the 'role' attribute for accessibility
    alertDiv.innerText = successMessage;  // Set the message to display
    alertDiv.classList.add("mt-3"); // Add margin-top for spacing
 
    // Append the alert to the modal body
    modalBody.appendChild(alertDiv);


      })
      .catch(error => {
        console.error("Error:", error);
        alert("Failed to submit the task.");
        submitButton.disabled = false; // Re-enable the submit button
      });
  });




        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}


// Add an event listener for the "Do All End-to-End" checkbox
document.getElementById("doAllEndToEnd").addEventListener("change", function() {
    const agentCheckboxes = document.querySelectorAll("#agentCheckboxes input[type='checkbox']");
    
    if (this.checked) {
      // Disable all other checkboxes when "Do All End-to-End" is checked
      agentCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
          checkbox.disabled = true;
        }
      });
    } else {
      // Enable all checkboxes when "Do All End-to-End" is unchecked
      agentCheckboxes.forEach(checkbox => {
        checkbox.disabled = false;
      });
    }
  });

// Close modal event listener
closePopup.addEventListener('click', () => {
    // Remove the blur effect from the page wrapper
    pageWrapper.classList.remove('blurred');
});

// Default Pomodoro configuration
let pomodoroConfig = {
    workTime: 25, // Work time in minutes
    breakTime: 5, // Break time in minutes
    cycles: 5,    // Number of work-break cycles
};

// Helper function to get the latest Pomodoro configuration
function getPomodoroConfig() {
    const savedConfig = localStorage.getItem('pomodoroConfig');
    return savedConfig ? JSON.parse(savedConfig) : pomodoroConfig;
}

// Function to post Pomodoro details to API
async function postPomodoroDetails(todoId, todoTitle, type, startTime, endTime) {
    const pomodoroDetails = {
        todoId: todoId, // Include todoId
        title: todoTitle,
        type: type,
        startTime: startTime,
        endTime: endTime,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    };

    try {
        const response = await fetch('http://localhost:5083/api/Todo/SavePomodoroSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pomodoroDetails),
        });

        if (!response.ok) {
            console.error('Failed to post Pomodoro details:', response.statusText);
        }
    } catch (error) {
        console.error('Error while posting Pomodoro details:', error);
    }
}

// Function to start the Pomodoro timer
function startPomodoro(todoId, todoTitle) {
    const focusModal = bootstrap.Modal.getInstance(document.getElementById('focusModal'));
    focusModal.hide();
    pageWrapper.classList.add('blurred');
    document.getElementById('pomodoroTodoTitle').textContent = todoTitle;

    currentCycle = 0;
    isWorkPhase = true;

    // Post initial details
    postPomodoroDetails(todoId, todoTitle, 'work', new Date().toISOString(), null);

    startPomodoroCycle(todoId, todoTitle);

    const pomodoroModal = new bootstrap.Modal(document.getElementById('pomodoroModal'));
    pomodoroModal.show();
}

function startPomodoroCycle(todoId, todoTitle) {
    pomodoroConfig = getPomodoroConfig();

    if (currentCycle >= pomodoroConfig.cycles) {
        alert('Pomodoro sessions complete! Great job!');
        resetPomodoroModal(todoId, todoTitle);
        return;
    }

    const duration = isWorkPhase ? pomodoroConfig.workTime : pomodoroConfig.breakTime;
    displayCountdown(duration, () => {
        const startTime = new Date().toISOString();
        const endTime = new Date().toISOString();
        const phaseType = isWorkPhase ? 'work' : 'break';

        // Post details about each phase
        postPomodoroDetails(todoId, todoTitle, phaseType, startTime, endTime);

        if (isWorkPhase) {
            alert('Work session complete! Time for a break.');
        } else {
            alert('Break time over! Get back to work.');
            currentCycle++;
        }

        isWorkPhase = !isWorkPhase;
        startPomodoroCycle(todoId, todoTitle); // Start next phase
    });
}

function displayCountdown(duration, callback) {
    let remainingTime = duration * 60;
    const timerElement = document.getElementById('pomodoroTimer');
    const phaseText = document.getElementById('pomodoroPhaseText');

    timerInterval = setInterval(() => {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            callback();
        }

        remainingTime--;
    }, 1000);

    phaseText.textContent = isWorkPhase ? 'Focus on your work!' : 'Take a short break!';
}

function resetPomodoroModal(todoId, todoTitle) {
    clearInterval(timerInterval);
    pageWrapper.classList.remove('blurred');

    const pomodoroModal = bootstrap.Modal.getInstance(document.getElementById('pomodoroModal'));
    pomodoroModal.hide();

    // Post session end details
    postPomodoroDetails(todoId, todoTitle, 'end', null, new Date().toISOString());
}



// Initial render
renderTodos();
