import { useState } from 'react';
import api from '../api/axios';

export default function Board({ board, onUpdate }) {
  const [newTaskCol, setNewTaskCol] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const createTask = async (columnId) => {
    if (!newTaskTitle.trim()) return;
    await api.post('/tasks', { title: newTaskTitle, columnId, priority: newTaskPriority, order: 0 });
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setNewTaskCol(null);
    onUpdate();
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    onUpdate();
  };

  const moveTask = async (task, newColumnId) => {
    if (task.columnId === newColumnId) return;
    await api.patch(`/tasks/${task.id}`, { columnId: newColumnId });
    onUpdate();
  };

  const updatePriority = async (task, priority) => {
    await api.patch(`/tasks/${task.id}`, { priority });
    onUpdate();
  };

  const priorityColor = { low: 'bg-green-500', medium: 'bg-yellow-500', high: 'bg-red-500' };
  const priorityLabel = { low: 'Low', medium: 'Medium', high: 'High' };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">{board.name}</h2>
      </div>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {board.columns?.map(column => (
            <div key={column.id} className="w-72 bg-gray-900 rounded-xl border border-gray-800 flex flex-col">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold text-gray-200">{column.name}</h3>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{column.tasks?.length || 0}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {column.tasks?.map(task => (
                  <div key={task.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors group">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white text-sm font-medium">{task.title}</p>
                      <button onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs transition-all">✕</button>
                    </div>
                    {/* Priority selector */}
                    <div className="flex items-center gap-1 mt-2">
                      {['low', 'medium', 'high'].map(p => (
                        <button key={p} onClick={() => updatePriority(task, p)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all border ${task.priority === p ? 'border-gray-500 bg-gray-700 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityColor[p]}`} />
                          {priorityLabel[p]}
                        </button>
                      ))}
                    </div>
                    {/* Move buttons */}
                    <div className="flex gap-1 mt-2">
                      {board.columns.filter(c => c.id !== column.id).map(c => (
                        <button key={c.id} onClick={() => moveTask(task, c.id)}
                          className="text-xs bg-gray-700 hover:bg-indigo-600 text-gray-400 hover:text-white px-2 py-0.5 rounded transition-colors">
                          → {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-gray-800">
                {newTaskCol === column.id ? (
                  <div>
                    <input autoFocus value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && createTask(column.id)}
                      placeholder="Task title..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <div className="flex gap-1 mt-2">
                      {['low', 'medium', 'high'].map(p => (
                        <button key={p} onClick={() => setNewTaskPriority(p)}
                          className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-xs border transition-all ${newTaskPriority === p ? 'border-gray-500 bg-gray-700 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityColor[p]}`} />
                          {priorityLabel[p]}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => createTask(column.id)} className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded-lg">Add</button>
                      <button onClick={() => setNewTaskCol(null)} className="flex-1 bg-gray-700 text-white text-xs py-1.5 rounded-lg">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setNewTaskCol(column.id); setNewTaskTitle(''); setNewTaskPriority('medium'); }}
                    className="w-full text-gray-500 hover:text-gray-300 text-sm py-1 hover:bg-gray-800 rounded-lg transition-colors">
                    + Add task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}