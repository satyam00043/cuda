document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const timeInput = document.getElementById('time-input');
    const taskList = document.getElementById('task-list');
  
    // Load tasks from local storage
    chrome.storage.local.get('tasks', (result) => {
      const tasks = result.tasks || [];
      tasks.forEach(task => displayTask(task));
    });
  
    // Add task
    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const task = {
        description: taskInput.value,
        time: timeInput.value,
        status: 'scheduled', // track status
      };
  
      chrome.storage.local.get('tasks', (result) => {
        const tasks = result.tasks || [];
        tasks.push(task);
        chrome.storage.local.set({ tasks: tasks }, () => {
          displayTask(task);
          taskInput.value = '';
          timeInput.value = '';
        });
      });
    });
  
    // Display task
    function displayTask(task) {
      const li = document.createElement('li');
      li.classList.add('task');
      li.innerHTML = `
        <span>${task.description} at ${task.time}</span>
        <span id="timer-${task.time}" class="timer">Waiting...</span>
        <label>
          <input type="checkbox" id="complete-${task.time}" class="complete-checkbox" ${task.status === 'completed' ? 'checked' : ''} />
          Completed
        </label>
      `;
      taskList.appendChild(li);
  
      // Set a timer for the task
      startTimer(task);
  
      // Add event listener to checkbox to mark as completed
      const checkbox = document.getElementById(`complete-${task.time}`);
      checkbox.addEventListener('change', () => handleCheckboxChange(task, checkbox, li));
    }
  
    // Start timer and notify when time is up
    function startTimer(task) {
      const taskTime = new Date();
      const [hours, minutes] = task.time.split(":");
      taskTime.setHours(hours, minutes, 0, 0);
  
      const currentTime = new Date();
      const timeDifference = taskTime - currentTime;
  
      // If the task time is in the future
      if (timeDifference > 0) {
        const timerElement = document.getElementById(`timer-${task.time}`);
        
        const countdownInterval = setInterval(() => {
          const remainingTime = taskTime - new Date();
          
          if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            timerElement.textContent = 'Time is up!';
            completeTask(task, li); // Automatically complete and delete the task
          } else {
            const minutesLeft = Math.floor(remainingTime / 60000);
            const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
            timerElement.textContent = `${minutesLeft}m ${secondsLeft}s left`;
          }
        }, 1000);
      }
    }
  
    // Handle checkbox change (mark as completed)
    function handleCheckboxChange(task, checkbox, taskElement) {
      if (checkbox.checked) {
        // Confirm completion
        const isConfirmed = confirm("Are you sure you've completed this task?");
        if (isConfirmed) {
          task.status = 'completed';
          chrome.storage.local.set({ tasks: removeTaskFromList(task) });
          alert(`Task "${task.description}" marked as completed and will be deleted.`);
          taskElement.remove(); // Remove from UI
        } else {
          checkbox.checked = false; // Uncheck if not confirmed
        }
      }
    }
  
    // Complete the task automatically after time is up
    function completeTask(task, taskElement) {
      task.status = 'completed';
      chrome.storage.local.set({ tasks: removeTaskFromList(task) });
      const checkbox = document.getElementById(`complete-${task.time}`);
      checkbox.checked = true; // Mark the checkbox as checked
      alert(`Task "${task.description}" has been automatically marked as completed and will be deleted.`);
      taskElement.remove(); // Remove from UI
    }
  
    // Remove the completed task from the task list in storage
    function removeTaskFromList(task) {
      chrome.storage.local.get('tasks', (result) => {
        let tasks = result.tasks || [];
        tasks = tasks.filter(t => t.time !== task.time); // Remove task by its time
        chrome.storage.local.set({ tasks: tasks });
      });
    }
  });
  taskElement.classList.add('removed');  // Add removal class with fade-out effect
  setTimeout(() => {
    taskElement.remove(); // Remove task from DOM after fade-out animation
  }, 300);
    