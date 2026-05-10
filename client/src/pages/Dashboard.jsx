import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import Board from '../components/Board';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => { fetchWorkspaces(); }, []);
  useEffect(() => { if (activeWorkspace) fetchBoards(); }, [activeWorkspace]);

  const fetchWorkspaces = async () => {
    const { data } = await api.get('/workspaces');
    setWorkspaces(data);
    if (data.length > 0) setActiveWorkspace(data[0]);
  };

  const fetchBoards = async () => {
    const { data } = await api.get(`/boards/${activeWorkspace.id}`);
    setBoards(data);
    if (data.length > 0) setActiveBoard(data[0]);
  };

  const createWorkspace = async () => {
    if (!newName.trim()) return;
    const { data } = await api.post('/workspaces', { name: newName });
    setWorkspaces([...workspaces, data]);
    setActiveWorkspace(data);
    setNewName('');
    setShowNewWorkspace(false);
  };

  const createBoard = async () => {
    if (!newName.trim()) return;
    const { data } = await api.post('/boards', { name: newName, workspaceId: activeWorkspace.id });
    setBoards([...boards, data]);
    setActiveBoard(data);
    setNewName('');
    setShowNewBoard(false);
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">TaskFlow</h1>
          <p className="text-gray-400 text-sm mt-1">{user?.name}</p>
        </div>

        {/* Workspaces */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Workspaces</span>
            <button onClick={() => setShowNewWorkspace(true)} className="text-gray-400 hover:text-white text-lg leading-none">+</button>
          </div>
          {workspaces.map(ws => (
            <button key={ws.id} onClick={() => setActiveWorkspace(ws)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${activeWorkspace?.id === ws.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              {ws.name}
            </button>
          ))}
          {showNewWorkspace && (
            <div className="mt-2">
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createWorkspace()}
                placeholder="Workspace name"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="flex gap-2 mt-2">
                <button onClick={createWorkspace} className="flex-1 bg-indigo-600 text-white text-xs py-1 rounded">Create</button>
                <button onClick={() => setShowNewWorkspace(false)} className="flex-1 bg-gray-700 text-white text-xs py-1 rounded">Cancel</button>
              </div>
            </div>
          )}

          {/* Boards */}
          {activeWorkspace && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Boards</span>
                <button onClick={() => setShowNewBoard(true)} className="text-gray-400 hover:text-white text-lg leading-none">+</button>
              </div>
              {boards.map(board => (
                <button key={board.id} onClick={() => setActiveBoard(board)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${activeBoard?.id === board.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                  📋 {board.name}
                </button>
              ))}
              {showNewBoard && (
                <div className="mt-2">
                  <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && createBoard()}
                    placeholder="Board name"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <div className="flex gap-2 mt-2">
                    <button onClick={createBoard} className="flex-1 bg-indigo-600 text-white text-xs py-1 rounded">Create</button>
                    <button onClick={() => setShowNewBoard(false)} className="flex-1 bg-gray-700 text-white text-xs py-1 rounded">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full text-left text-gray-400 hover:text-white text-sm transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeBoard ? (
          <Board board={activeBoard} onUpdate={fetchBoards} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 text-lg">
                {activeWorkspace ? 'Create a board to get started' : 'Create a workspace to get started'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}