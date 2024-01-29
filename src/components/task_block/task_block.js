export default class TaskBlock {
    constructor(parentEl, title) {
        this.parentEl = parentEl;
        this.title = title;
        this.tasks = [];

        this.onNewCardClick = this.onNewCardClick.bind(this);
        this.onCloseAddCardClick = this.onCloseAddCardClick.bind(this);
        this.onAddCardClick = this.onAddCardClick.bind(this);
        this.onremoveTaskClick = this.onremoveTaskClick.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onDragDropBlock = this.onDragDropBlock.bind(this);
        // this.onMouseDown = this.onMouseDown.bind(this);
        // this.onMouseUp = this.onMouseUp.bind(this);
        // this.onMouseOver = this.onMouseOver.bind(this);

    }
    render() {
        return `
        <div class="tasks">
            <h2>${this.title}</h2>
            <ul class="task_list">
            </ul>
            <div class="new_card">
                <button class="new_card_button" type="button">+ Add another card</button>
            </div>
            <div class="add_card hidden">
                <textarea class="input" placeholder="Enter a title for this card..."></textarea>
                <button class="btn_add" type="button">Add card</button>
                <button class="btn_close" type="button">x</button>
            </div>
        </div>
        `
    }
    static setCurrentTask(currentTask) {
        this.currentTask = currentTask;
    }
    static getCurrentTask() {
        return this.currentTask;
    }
    static setCurrentBlock(currentBlock) {
        this.currentBlock = currentBlock;
    }
    static getCurrentBlock() {
        return this.currentBlock;
    }

    bindToDOM() {
        const taskBlock = this.render();
        this.parentEl.insertAdjacentHTML('beforeend', taskBlock);
        this.dataFromLocalStorage();
        this.addEvents();

        const block = this.parentEl.querySelector('.tasks');

        block.addEventListener('dragover', this.onDragOverBlock);
        block.addEventListener('dragleave', this.onDragLeaveBlock);
        block.addEventListener('dragend', this.onDragEndBlock);
        block.addEventListener('drop', this.onDragDropBlock);
    }
    onDragOverBlock(e) {
        e.preventDefault();
        e.target.closest('.tasks').style.boxShadow = '0 4px 3px grey';
    }
    onDragLeaveBlock(e) {
        e.target.closest('.tasks').style.boxShadow = 'none';
    }
    onDragEndBlock(e) {
        e.target.closest('.tasks').style.boxShadow = 'none';
    }
    onDragDropBlock(e) {
        e.preventDefault();

        if (this.tasks.length !== 0) { return }

        const id = TaskBlock.getCurrentTask().id;
        const value = TaskBlock.getCurrentTask().querySelector('span').innerText;
        
        this.tasks.push({
            id: id,
            text: value,
        });

        this.removeLocalStorage();
        this.updateLocalStorage();

        const data = JSON.parse(localStorage.getItem(this.title));

        data.forEach(item => {
            const taskList = this.parentEl.querySelector('.task_list');
            const task = this.createTask(item.id, item.text);
            taskList.appendChild(task);

            // this.tasks.push({
            //     id: task.id,
            //     text: task.querySelector('span').innerText,
            // });

            const btnRemoveTask = task.querySelector('.remove_task');
            btnRemoveTask.addEventListener('click', this.onremoveTaskClick);

            const t = document.getElementById(task.id);
            t.addEventListener('dragstart', this.onDragStart);
            t.addEventListener('dragend', this.onDragEnd);
            t.addEventListener('dragover', this.onDragOver);
            t.addEventListener('dragenter', this.onDragEnter);
            t.addEventListener('drop', this.onDragDrop);
            t.addEventListener('dragleave', this.onDragLeave);
        });
    }

    dataFromLocalStorage() {
        const taskList = this.parentEl.querySelector('.task_list');
        if (!JSON.parse(localStorage.getItem(this.title)) ||
            JSON.parse(localStorage.getItem(this.title)).length === 0) {
            return;
        }
        const data = JSON.parse(localStorage.getItem(this.title));
        data.forEach(item => {
            const task = this.createTask(item.id, item.text);
            taskList.appendChild(task);

            this.tasks.push({
                id: task.id,
                text: task.querySelector('span').innerText,
            });

            const btnRemoveTask = task.querySelector('.remove_task');
            btnRemoveTask.addEventListener('click', this.onremoveTaskClick);

            const t = document.getElementById(task.id);
            t.addEventListener('dragstart', this.onDragStart);
            t.addEventListener('dragend', this.onDragEnd);
            t.addEventListener('dragover', this.onDragOver);
            t.addEventListener('dragenter', this.onDragEnter);
            t.addEventListener('drop', this.onDragDrop);
            t.addEventListener('dragleave', this.onDragLeave);
        });
    }

    addEvents() {
        this.newCardBtn = this.parentEl.querySelector('.new_card_button');
        this.closeAddBlock = this.parentEl.querySelector('.btn_close');
        this.addTask = this.parentEl.querySelector('.btn_add');

        this.newCardBtn.addEventListener('click', this.onNewCardClick);
        this.closeAddBlock.addEventListener('click', this.onCloseAddCardClick);
        this.addTask.addEventListener('click', this.onAddCardClick);
    }
    onNewCardClick() {
        this.addCardBlock = this.parentEl.querySelector('.add_card');
        this.newCardBlock = this.parentEl.querySelector('.new_card');

        this.addCardBlock.classList.remove('hidden');
        this.newCardBlock.classList.add('hidden');
    }
    onCloseAddCardClick() {
        const input = this.parentEl.querySelector('.input');
        input.value = '';
        this.addCardBlock.classList.add('hidden');
        this.newCardBlock.classList.remove('hidden');
    }
    onAddCardClick() {
        const taskList = this.parentEl.querySelector('.task_list');
        const input = this.parentEl.querySelector('.input');

        if (!input.value.trim()) { return }

        const id = performance.now();
        const task = this.createTask(id, input.value);

        taskList.appendChild(task);

        this.tasks.push({
            id: task.id,
            text: task.querySelector('span').innerText,
        });
        this.updateLocalStorage();
        input.value = '';

        const btnRemoveTask = task.querySelector('.remove_task');
        btnRemoveTask.addEventListener('click', this.onremoveTaskClick);

        const container = document.querySelector('.container');
        // container.addEventListener('mousedown', this.onMouseDown)

        const t = document.getElementById(id);
        t.addEventListener('dragstart', this.onDragStart);
        t.addEventListener('dragend', this.onDragEnd);
        t.addEventListener('dragover', this.onDragOver);
        t.addEventListener('dragenter', this.onDragEnter);
        t.addEventListener('drop', this.onDragDrop);
        t.addEventListener('dragleave', this.onDragLeave);

    }
    onDragStart(e) {
        this.tasks = this.tasks.filter(task => e.target.id !== task.id);

        TaskBlock.setCurrentTask(e.target);
        TaskBlock.setCurrentBlock(this.tasks);
        this.removeLocalStorage();
        this.updateLocalStorage();

        setTimeout(() => {
            const taskItems = Array.from(this.parentEl.querySelectorAll('.task_item'));
            taskItems.forEach(task => task.remove());
        }, 0);

        setTimeout(() => {
            const data = JSON.parse(localStorage.getItem(this.title));

            data.forEach(item => {
                const taskList = this.parentEl.querySelector('.task_list');

                const task = this.createTask(item.id, item.text);
                taskList.appendChild(task);

                const btnRemoveTask = task.querySelector('.remove_task');
                btnRemoveTask.addEventListener('click', this.onremoveTaskClick);

                const t = document.getElementById(task.id);
                t.addEventListener('dragstart', this.onDragStart);
                t.addEventListener('dragend', this.onDragEnd);
                t.addEventListener('dragover', this.onDragOver);
                t.addEventListener('dragenter', this.onDragEnter);
                t.addEventListener('drop', this.onDragDrop);
                t.addEventListener('dragleave', this.onDragLeave);
            });
        }, 100);
    }
    onDragEnd(e) {
        e.target.style.boxShadow = 'none';
        e.target.classList.remove('hidden');
    }
    onDragOver(e) {
        e.preventDefault();
        // console.log('over')
        if (e.target.classList.contains('task_item')) {
            e.target.style.boxShadow = '0 4px 3px grey';
        }
    }
    onDragLeave(e) {
        // console.log('leave')
        e.target.style.boxShadow = 'none';
    }
    onDragEnter() {
        // console.log('enter')
    }
    onDragDrop(e) {
        e.preventDefault();

        const id = TaskBlock.getCurrentTask().id;
        const value = TaskBlock.getCurrentTask().querySelector('span').innerText;

        const dropElementIndex = this.tasks.findIndex(task => e.target.id === task.id);

        this.tasks.splice((dropElementIndex + 1), 0, { id: id, text: value });

        const taskItems = Array.from(this.parentEl.querySelectorAll('.task_item'));
        taskItems.forEach(task => task.remove());

        this.removeLocalStorage();
        this.updateLocalStorage();

        const data = JSON.parse(localStorage.getItem(this.title));

        data.forEach(item => {
            const taskList = this.parentEl.querySelector('.task_list');
            const task = this.createTask(item.id, item.text);
            taskList.appendChild(task);

            // this.tasks.push({
            //     id: task.id,
            //     text: task.querySelector('span').innerText,
            // });

            const btnRemoveTask = task.querySelector('.remove_task');
            btnRemoveTask.addEventListener('click', this.onremoveTaskClick);

            const t = document.getElementById(task.id);
            t.addEventListener('dragstart', this.onDragStart);
            t.addEventListener('dragend', this.onDragEnd);
            t.addEventListener('dragover', this.onDragOver);
            t.addEventListener('dragenter', this.onDragEnter);
            t.addEventListener('drop', this.onDragDrop);
            t.addEventListener('dragleave', this.onDragLeave);
        });

        // this.dataFromLocalStorage();
    }

    onremoveTaskClick(e) {
        const item = e.currentTarget.closest('.task_item');
        this.tasks = this.tasks.filter(task => item.id !== task.id);
        item.remove();
        this.removeLocalStorage();
        this.updateLocalStorage();
    }
    createTask(id, value) {
        const li = document.createElement('li');
        li.className = 'task_item';
        li.id = id;
        li.draggable = true;

        const span = document.createElement('span');
        span.innerText = value;

        const button = document.createElement('button');
        button.className = 'remove_task';
        button.innerText = 'x';

        li.appendChild(span);
        li.appendChild(button);

        return li;
    }
    updateLocalStorage() {
        localStorage.setItem(this.title, JSON.stringify(this.tasks));
    }
    removeLocalStorage() {
        localStorage.removeItem(this.title);
    }
}