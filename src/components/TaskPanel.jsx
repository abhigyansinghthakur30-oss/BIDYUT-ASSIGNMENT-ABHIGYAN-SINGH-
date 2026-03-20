"use client";

import { useState, useEffect } from "react";

export default function TaskPanel({ user }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchTasks();
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          assigned_to: assignedTo || null,
        }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks([data.task, ...tasks]);
        setTitle("");
        setDescription("");
        setAssignedTo("");
        setIsAdding(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.task) {
        setTasks(tasks.map((t) => (t.id === task.id ? data.task : t)));
      }
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setTasks(tasks.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-xl">
      {/* Search & Header Section */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-purple-500/5 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">Assignment Pool</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              {tasks.length} Total Tasks • {pendingCount} Pending
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className={`p-3 rounded-2xl transition-all duration-300 transform group ${
                isAdding ? "bg-red-500/20 text-red-400 rotate-45" : "bg-purple-600 text-white hover:scale-105 shadow-lg shadow-purple-600/30"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        {/* Task Creation Form (Admin Only) */}
        {isAdding && isAdmin && (
          <form onSubmit={createTask} className="mt-4 space-y-4 animate-slide-in">
            <input
              type="text"
              placeholder="What needs to be done?"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Add details (optional)"
              className="input-field min-h-[80px] py-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 relative">
                <label className="absolute left-4 -top-2 px-1 bg-[#10101a] text-[10px] uppercase font-black text-purple-400 tracking-wider">
                  Assignee
                </label>
                <select
                  className="input-field appearance-none"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Open for anyone</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.email} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="btn-primary !py-2 sm:!w-40 disabled:opacity-30"
              >
                {submitting ? "Deploying..." : "Assign Task"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">Gathering Tasks</span>
            </div>
        ) : tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 space-y-4 py-20">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-bold text-lg">No tasks assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {tasks.map((task, i) => (
              <div
                key={task.id}
                className="group p-5 bg-[#1a1a2e]/50 border border-white/5 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleStatus(task)}
                    className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      task.status === "completed" 
                        ? "bg-emerald-500 shadow-lg shadow-emerald-500/40 text-white" 
                        : "bg-slate-700/50 border border-white/10 text-transparent group-hover:text-slate-500"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-bold text-lg truncate ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.title}
                      </h3>
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest ${
                        task.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {task.status}
                      </span>
                      
                      <div className="flex items-center gap-2 px-2 py-0.5 bg-slate-800/50 rounded-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        <span className="text-[10px] font-bold text-slate-400">
                          {task.users?.email || 'Open Task'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
