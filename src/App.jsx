import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, deleteTask, updateTask, reorderTasks } from './script/TasksSlice';
import CreateForm from './script/CreateForm';
import TaskList from './script/TaskList';
import Notification from './script/Notification';
import DeleteModal from './script/DeleteModal';
import EditModal from './script/EditModal';
import ShareModal from './script/ShareModal';
import { DragDropContext } from 'react-beautiful-dnd';
import './styles/main.css';
import './styles/modals.css';

function App() {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const [notification, setNotification] = useState('');
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');

  function handleCreateTask(title, about) {
    dispatch(createTask({ title, about }));
    showNotification('Task created');
  }

  function handleDeleteTask() {
    dispatch(deleteTask(currentTaskId));
    showNotification('Task deleted');
    setDeleteModalOpen(false);
  }

  function handleUpdateTask(title, about) {
    dispatch(updateTask({ id: currentTaskId, title, about }));
    showNotification('Changes saved');
    setEditModalOpen(false);
  }

  function copyTask() {
    const task = tasks.find(task => task.id === currentTaskId);
    const textToCopy = `Title: ${task.title}\nAbout: ${task.about}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => showNotification('Copied to clipboard'))
      .catch(() => showNotification('Failed to copy'));
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    dispatch(reorderTasks(reorderedTasks));
  }

  function showNotification(message) {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  }

  return (
    <div>
      <CreateForm onCreate={handleCreateTask} showNotification={showNotification} />
      <DragDropContext onDragEnd={onDragEnd}>
        <TaskList 
          tasks={tasks}
          onDelete={(id) => {
            setCurrentTaskId(id);
            setDeleteModalOpen(true);
          }}
          onEdit={(id) => {
            const task = tasks.find(t => t.id === id);
            setTitle(task.title);
            setAbout(task.about);
            setCurrentTaskId(id);
            setEditModalOpen(true);
          }}
          onShare={(id) => {
            setCurrentTaskId(id);
            setShareModalOpen(true);
          }}
        />
      </DragDropContext>
      <Notification message={notification} />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
      />
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdateTask}
        title={title}
        about={about}
        showNotification={showNotification}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onCopy={copyTask}
      />
    </div>
  );
}

export default App;