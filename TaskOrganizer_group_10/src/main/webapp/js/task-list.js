'use strict'

class TaskList extends HTMLElement {
	constructor() {
		super()
		
		this._tasks = []
		
		this._shadow = this.attachShadow({ mode: 'closed' })
		this._addStyleLink()
		this._render()
	}
	
	
	_addStyleLink() {
		const link = document.createElement('link');
        const path = import.meta.url.match(/.*\//)[0];
        link.href = path.concat("../css/main.css");
        link.rel = "stylesheet";
        this._shadow.appendChild(link);
	}

  	_render() {
		const content = `
            <p id="status-text">Waiting for server data.</p>
			<button id="btn-new-task" disabled>New task</button>
        `;
        const wrapper = document.createElement('div');
		wrapper.setAttribute('id', 'task-section')
        wrapper.insertAdjacentHTML('beforeend', content);
        this._shadow.appendChild(wrapper);
	}
	
	changestatusCallback(callback) {
		const tasks = this._shadow.querySelectorAll("table tbody tr")
		
		for(let task of tasks) {
			const select = task.querySelector('select')
			
			select.addEventListener('change', (event) => {
				for(let option of select.options) {
					if(option.selected) {
						const tempTask = this._tasks.find(t => t.id === parseInt(task.id))
						if(option.value !== 'Modify' && tempTask && window.confirm(`Set '${tempTask.title}' to ${option.value}?`)) {
							callback(task.id, option.value)
							
							//* Update locally stored value
							tempTask.status = option.value
						}
					}
				}
			})
		}
	}
	
	deletetaskCallback(callback) {
		const tasks = this._shadow.querySelectorAll("table tbody tr")
		
		for(let task of tasks) {
			task.querySelector("button").addEventListener('click', () => {
				const tempTask = this._tasks.find(t => t.id === parseInt(task.id))
				if(window.confirm(`Delete task '${tempTask.title}'?`)) {
					callback(task.id)
				}
			})
		}
	}
	
	
	addtaskCallback(callback) {
        this._shadow.querySelector("#btn-new-task")
					.addEventListener("click", callback);
	}
	
	enableaddtask() {
		console.log(this._tasks)
		if(this._shadow.querySelector("#task-section table")) {
			this._shadow.querySelector("#btn-new-task").disabled = false;
		} else if (this._tasks.length === 0) {
			const statusText = this._shadow.querySelector("#status-text")
			statusText.innerHTML = 'Found no tasks.'
		}
    }

	setStatusText() {
		const statusText = this._shadow.querySelector("#status-text")
		statusText.innerHTML = `Found ${this._tasks.length} tasks`
	}

	createTasks(tasks, statuses) {
		this._tasks = tasks
		
		const wrapper = this._shadow.querySelector("#task-section")
		
		this.setStatusText()
		
		//* Delete table if it already exists
		let table = this._shadow.querySelector("table")
		table && table.parentNode.removeChild(table)
		
		table = document.createElement('table')
		
		let content = '<thead><tr><th>Task</th><th>Status</th></tr><tbody>'
		
		for(let task of tasks) {
			content += `<tr id='${task.id}'>
						<td>${task.title}</td>
						<td>${task.status}</td>
						<td>
							<select id='task-select-${task.id}'>
                                <option selected="${task.status}">Modify</option>`

		for(let status of statuses) {
			content += `<option value=${status}>${status}</option>`
		}
		
			content += '</select></td><td><button>Remove</button></td></tr>'
		}
		
		content += '</body>'
		
		table.insertAdjacentHTML("beforeend", content);
		
		wrapper.appendChild(table)
	}
	
	updateTask(updatedTask) {
		//* Need to use unicode to escape any numeric characters (\\3)
		let task = this._shadow.querySelector(`#\\3${updatedTask.id}`)
		if(task) {
			task.children[1].innerHTML = updatedTask.status
			console.log('Updated task')
			console.log(updatedTask)
		}
	}
	
	deleteTaskById(id) {
		const task = this._shadow.querySelector(`#\\3${id}`)
		if(task) {
			task.parentNode.removeChild(task)
			
			//* Filter out element from list of all tasks
			this._tasks = this._tasks.filter(t => t.id !== id)
			
			//* Update status text
			this.setStatusText()
		}
	}
}

export default TaskList