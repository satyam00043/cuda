chrome.runtime.onInstalled.addListener(() => {
    // Set an alarm to check scheduled tasks every minute
    chrome.alarms.create("checkTasks", { periodInMinutes: 1 });
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkTasks") {
      chrome.storage.local.get("tasks", (result) => {
        const tasks = result.tasks || [];
        const now = new Date();
        tasks.forEach((task, index) => {
          const taskTime = new Date();
          const [hours, minutes] = task.time.split(":");
          taskTime.setHours(hours, minutes, 0, 0);
  
          if (taskTime <= now && task.status !== "notified") {
            // Update task status
            task.status = "notified";
            chrome.storage.local.set({ tasks: tasks });
  
            // Send notification
            chrome.notifications.create({
              type: "basic",
              iconUrl: "icons/icon48.png",
              title: "Task Reminder",
              message: `It's time for: ${task.description}`,
              priority: 2,
            });
          }
        });
      });
    }
  });
  