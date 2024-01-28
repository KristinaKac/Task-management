import TaskBlock from "../components/task_block/task_block";

const todoContainer = document.querySelector('.todo');
const inProgressContainer = document.querySelector('.in-progress');
const doneContainer = document.querySelector('.done');

const todo = new TaskBlock(todoContainer, 'Todo');
todo.bindToDOM();
const inProgress = new TaskBlock(inProgressContainer, 'In Progress');
inProgress.bindToDOM();
const done = new TaskBlock(doneContainer, 'Done');
done.bindToDOM();