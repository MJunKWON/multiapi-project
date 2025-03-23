import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    const newMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');

    try {
      const response = await fetch('https://multiapi-project-backend.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage.content }),
      });

      if (!response.ok) {
        throw new Error('서버 응답에 문제가 있습니다.');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        isError: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen py-6 flex flex-col justify-center transition-colors duration-200
      ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="fixed top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'
          }`}
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 
          shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-75
          ${darkMode ? 'from-blue-600 to-purple-600' : ''}`}>
        </div>
        <div className={`relative px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20
          ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className={`py-8 text-base leading-6 space-y-4 sm:text-lg sm:leading-7
                ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="chat-history h-96 overflow-auto mb-4 pr-4">
                  {chatHistory.map((msg, index) => (
                    <div key={index} 
                      className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}
                        animate-fade-in`}>
                      <div className={`inline-block p-2 rounded-lg max-w-[80%] break-words
                        ${msg.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : msg.isError
                            ? 'bg-red-500 text-white'
                            : darkMode 
                              ? 'bg-gray-700 text-white' 
                              : 'bg-gray-200 text-gray-700'
                        }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className={`flex items-center border-b py-2
                    ${darkMode ? 'border-gray-600' : 'border-teal-500'}`}>
                    <input
                      className={`appearance-none bg-transparent border-none w-full mr-3 py-1 px-2 leading-tight focus:outline-none
                        ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'}`}
                      type="text"
                      placeholder="메시지를 입력하세요..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      className={`flex-shrink-0 text-sm border-4 rounded transition-colors duration-200
                        ${loading 
                          ? 'bg-gray-400 border-gray-400 cursor-not-allowed' 
                          : darkMode
                            ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700'
                            : 'bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700'
                        } text-white py-1 px-2`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? '전송 중...' : '전송'}
                    </button>
                  </div>
                </form>
                {error && (
                  <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;