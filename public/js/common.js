document.addEventListener('DOMContentLoaded', async function() {
    const form = document.getElementById('myForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        
        const inputValue = taskInput.value.trim(); // Trim leading and trailing spaces
        if (inputValue === '') {
            // If input is empty, display error message and prevent form submission
            errorMessage.textContent = 'Please enter a task.';
            errorMessage.style.display = 'block';
        } else {
            // Otherwise, clear error message and send data to the server
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
            
            try {
                const response = await fetch('/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: inputValue })
                });

                if (response.ok) {
                    // Refresh the task list upon successful submission
                    getTasks();
                } else {
                    throw new Error('Failed to submit task');
                }
            } catch (error) {
                console.error(error);
                // Handle error here
            }
        }
    });

    // Function to fetch tasks from the server
    async function getTasks() {
        try {
            const response = await fetch('/api/tasks');
            
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const tasks = await response.json();
            
            // Clear existing tasks
            taskList.innerHTML = '';
    
            // Render fetched tasks
            tasks.forEach(task => {
                const taskElement = document.createElement('li');
                taskElement.textContent = task.name;
                
    
                // Add line-through style if task is completed
                if (task.completed) {
                    taskElement.style.textDecoration = 'line-through';
                }
    
                // Create a div to contain all icons
                const iconContainer = document.createElement('div');
                iconContainer.classList.add('icon-container');
    
                // Create icons for remove, edit, and completed
                const removeIcon = document.createElement('i');
                removeIcon.className = 'fas fa-trash-alt';
                removeIcon.addEventListener('click', async () => {
                    await removeTask(task._id);
                });
    
                const editIcon = document.createElement('i');
                editIcon.className = 'fas fa-edit '
                editIcon.id = `${task._id}`;
                console.log(editIcon);
                editIcon.addEventListener('click', () => {
                     const editPageUrl = `api/tasks/edit/?id=${task._id}`;
                    //  console.log(task._id);
                    // // Redirect the user to the edit page
                     window.location.href = editPageUrl;
                });
    
                const completeIcon = document.createElement('i');
                completeIcon.className = 'fas fa-check';
                completeIcon.addEventListener('click', async () => {
                    await markTaskAsCompleted(task._id);
                });
    
                // Append icons to the icon container
                iconContainer.appendChild(removeIcon);
                iconContainer.appendChild(editIcon);
                iconContainer.appendChild(completeIcon);
    
                // Append the icon container to the task element
                taskElement.appendChild(iconContainer);
    
                taskList.appendChild(taskElement);
            });
        } catch (error) {
            console.error(error);
            // Handle error here
        }
    }

    async function removeTask(taskId) {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Refresh the task list upon successful removal
                getTasks();
            } else {
                throw new Error('Failed to remove task');
            }
        } catch (error) {
            console.error(error);
            // Handle error here
        }
    }

    // Function to mark a task as completed
    async function markTaskAsCompleted(taskId) {
        try {
            const response = await fetch(`/api/tasks/${taskId}/complete`, {
                method: 'PUT'
            });

            if (response.ok) {
                // Refresh the task list upon successful update
                getTasks();
            } else {
                throw new Error('Failed to mark task as completed');
            }
        } catch (error) {
            console.error(error);
            // Handle error here
        }
    }
    // Fetch tasks when the page loads
   await getTasks();
});