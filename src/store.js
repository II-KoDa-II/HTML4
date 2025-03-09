import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './script/TasksSlice';

export default configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});