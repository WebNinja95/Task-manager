

const inputValue = document.querySelector('#editedTaskInput');
const editForm = document.querySelector('#editForm');


document.addEventListener('DOMContentLoaded', async function() {
    editForm.addEventListener('submit', async function(){
        event.preventDefault();
        const formData = new FormData(editForm);
        const name = formData.get('name');
        const urlParams = new URLSearchParams(window.location.search);
        const taskId = urlParams.get('id');
        try{
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name })
            });
            const updatedTask = await response.json();
            if (response.ok) {
                window.location.href = '/';
            } else {
                throw new Error('Failed to submit task');
            }
        }
        catch(error){
            console.log(error);
        }

    })
    
    

})