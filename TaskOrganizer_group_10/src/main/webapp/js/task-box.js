'use strict'

class TaskBox extends HTMLElement {
	constructor() {
		super()
		
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
            <div id="new-task-modal" class="modal">
			  <div class="modal-content">
			    <span id="close-new-task-modal" class="close-button">x</span>
				<h2>New task</h2>
				<div class="mt-1">
					<label for="task-title">Title</label>
					<input id="task-title" type="text" />
				</div>
			
				<div class="mt-1">
					<label for="task-status">Status</label>
					<select name="task-status" id="task-status">
					  	<option value="ACTIVE" selected="selected">ACTIVE</option>
	            		<option value="WAITING">WAITING</option>
	            		<option value="DONE">DONE</option>
					</select>
				</div>
				
				<button id="task-submit-form" type="button" class="d-block mt-1">Add task</button>
			  </div>
			</div>
        `;
        const wrapper = document.createElement('div');
        wrapper.insertAdjacentHTML('beforeend', content);
        this._shadow.appendChild(wrapper);
        return wrapper;
	}
	
	show() {
		const modal = this._shadow.querySelector("#new-task-modal")
		modal.classList.toggle("show-modal");
	}
	
	newtaskCallback(callback) {
		const availableStatuses = ['ACTIVE', 'WAITING', 'DONE']
		this._shadow.querySelector("#task-submit-form").addEventListener('click', () => {
			const title = this._shadow.querySelector("#task-title");
            const status = this._shadow.querySelector("#task-status");

			//* Checks if empty title or status exists
			if(title.value === '' || !availableStatuses.some(as => as === status.value)) return

			callback({ title: title.value, status: status.value })
			
			//* Reset input fields to initial value
			title.value = ''
			status.value = ''

			const modal = this._shadow.querySelector("#new-task-modal")
			modal.classList.toggle("show-modal");
		})
	}
	
	close() {	
		this._shadow.querySelector("#close-new-task-modal").addEventListener('click', () => {
			const modal = this._shadow.querySelector("#new-task-modal")
			modal.classList.toggle("show-modal");
		})
	}
}

export default TaskBox

