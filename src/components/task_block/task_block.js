export default class TaskBlock {
    constructor(parentEl, title) {
        this.parentEl = parentEl;
        this.title = title;
        this.tasks = [];

        this.onNewCardClick = this.onNewCardClick.bind(this);
        this.onCloseAddCardClick = this.onCloseAddCardClick.bind(this);
        this.onAddCardClick = this.onAddCardClick.bind(this);
        this.onremoveTaskClick = this.onremoveTaskClick.bind(this);
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
    bindToDOM() {
        const taskBlock = this.render();
        this.parentEl.insertAdjacentHTML('beforeend', taskBlock);
        this.dataFromLocalStorage();
        this.addEvents();
    }

    dataFromLocalStorage() {
        const taskList = this.parentEl.querySelector('.task_list');

        if (JSON.parse(localStorage.getItem(this.title)).length === 0) {
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