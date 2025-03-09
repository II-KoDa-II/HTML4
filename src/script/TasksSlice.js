import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  tasks: JSON.parse(localStorage.getItem('taskList')) || [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    createTask: (state, action) => {
      const newTask = {
        id: uuidv4(),
        title: action.payload.title,
        about: action.payload.about,
      };
      state.tasks.push(newTask);
      localStorage.setItem('taskList', JSON.stringify(state.tasks));
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('taskList', JSON.stringify(state.tasks));
    },
    updateTask: (state, action) => {
      const { id, title, about } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], title, about };
      }
      localStorage.setItem('taskList', JSON.stringify(state.tasks));
    },
    reorderTasks: (state, action) => {
      state.tasks = action.payload;
      localStorage.setItem('taskList', JSON.stringify(state.tasks));
    },
  },
});

export const { createTask, deleteTask, updateTask, reorderTasks } = tasksSlice.actions;
export default tasksSlice.reducer;