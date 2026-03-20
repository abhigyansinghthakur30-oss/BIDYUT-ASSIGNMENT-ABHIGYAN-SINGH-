"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ChatPanel({ user }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          // Add a small delay to ensure the foreign key data is available/refreshed
          const { data, error } = await supabase
            .from("messages")
            .select("*, users!sender_id(email, role)")
            .eq("id", payload.new.id)
            .single();

          if (data && !error) {
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.find(m => m.id === data.id)) return prev;
              return [...prev, data];
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime messages');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      setContent("");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight italic">Live Feed</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" />
              Real-time collaboration
            </p>
          </div>
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#12121a] bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400`}>
                    #{i}
                </div>
            ))}
          </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border border-emerald-500/20 border-t-emerald-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 font-bold uppercase tracking-widest text-xs gap-4 opacity-50">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.855-1.246L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            No transmissions yet
          </div>
        ) : (
          messages.map((msg, i) => {
            const isOwn = msg.sender_id === user?.id;
            const isAdmin = msg.users?.role === 'admin';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isOwn ? "items-end" : "items-start"} animate-slide-in`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-center gap-2 mb-1 px-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'text-purple-400' : 'text-emerald-400'}`}>
                        {isOwn ? "You" : msg.users?.email.split('@')[0]}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">{formatTime(msg.created_at)}</span>
                </div>
                
                <div
                  className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    isOwn 
                      ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-xl shadow-purple-600/20 rounded-tr-none" 
                      : "bg-[#1a1a2e] border border-white/5 text-slate-200 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-6 bg-[#0a0a14]/60 backdrop-blur-2xl border-t border-white/5">
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            type="text"
            className="input-field !rounded-2xl !bg-white/5 !border-white/10 focus:!bg-white/10"
            placeholder="Broadcast a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-all hover:scale-105 disabled:opacity-20"
          >
            {sending ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : (
                <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
