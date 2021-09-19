'use strict'

import TaskList from './task-list.js'
customElements.define('task-list', TaskList)

import TaskBox from './task-box.js'
customElements.define('task-box', TaskBox)

const tasklist = document.querySelector("task-list");
const taskbox = document.querySelector("task-box");

const initialize = async () => {
	await getTasksAndStatuses()
	
	tasklist.enableaddtask()
	
	tasklist.addtaskCallback(() => taskbox.show())
	
	tasklist.changestatusCallback((id, status) => {
        console.log(`Task ${id} was updated with new status ${status}.`)
        updateTask(id, status)
	})
	
	tasklist.deletetaskCallback((id) => {
        console.log(`Task ${id} was deleted.`)
        deleteTask(id)
	})
	
	taskbox.newtaskCallback((task) => {
    	console.log(`Task ${task.title} (${task.status}) was added.`);
    	addTask(task);
	})
	
	taskbox.close()
}

const getTasksAndStatuses = async () => {
	const tasks = await fetch('/TaskServices/api/services/tasklist')
	const statuses = await fetch('/TaskServices/api/services/allstatuses')
	
	if(tasks.status === 200 && statuses.status === 200) {
		const allTasks = await tasks.json()
		const allStatuses = await statuses.json()
		
		if(allTasks.responseStatus && allStatuses.responseStatus) {
			tasklist.createTasks(allTasks.tasks, allStatuses.allstatuses)
		}
	}	
}

const addTask = async (task) => {
	const response = await fetch('/TaskServices/api/services/task', {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json; charset=utf-8'
	    },
	    body: JSON.stringify(task)
	});
	
	if(response.status === 200) {
		const json = await response.json()
		
		if(json.responseStatus) {
			await getTasksAndStatuses()
		}
	}
}

const updateTask = async (id, status) => {
	const response = await fetch(`/TaskServices/api/services/task/${id}`, {
	    method: 'PUT',
	    headers: {
	      'Content-Type': 'application/json; charset=utf-8'
	    },
	    body: JSON.stringify({status})
	});
	
	if(response.status === 200) {
		const json = await response.json()
		
		if(json.responseStatus) {
			tasklist.updateTask(json)
		}
	}
}

const deleteTask = async (id) => {
	const response = await fetch(`/TaskServices/api/services/task/${id}`, {
	    method: 'DELETE'
	});
	
	if(response.status === 200) {
		const json = await response.json()
		
		if(json.responseStatus) {
			tasklist.deleteTaskById(json.id)
		}
	}
}

initialize()