import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-pink-50 font-soft flex flex-col items-center justify-start py-10 px-4">
      <div className="bg-white shadow-md border-2 border-rose-200 rounded-2xl px-6 py-4 mb-8 relative max-w-md w-full">
        <h1 className="text-3xl font-handwriting text-rose-600 text-center mb-2">
          Heartboard 💌
        </h1>
        <p className="text-center text-rose-500 font-soft text-sm">
          A scrapbook for the ones you love ✿
        </p>
        <div className="absolute -top-2 left-4 w-16 h-2 bg-rose-200 rotate-[-10deg] rounded-sm shadow-sm"></div>
        <div className="absolute -top-2 right-4 w-16 h-2 bg-rose-300 rotate-[8deg] rounded-sm shadow-sm"></div>
      </div>

      <div className="bg-white rounded-xl border border-rose-200 shadow-lg p-4 max-w-sm w-full mb-4">
        <h2 className="text-lg font-semibold text-rose-700 mb-1">🎁 Gift Idea</h2>
        <p className="text-sm text-rose-600">DIY photo album with our favorite memories and pressed flowers 🌸</p>
      </div>

      <div className="bg-white rounded-xl border border-rose-200 shadow-lg p-4 max-w-sm w-full">
        <h2 className="text-lg font-semibold text-rose-700 mb-1">💌 12AM Letter</h2>
        <p className="text-sm text-rose-600">“I hope this year brings you more hugs, less overthinking, and the softest mornings.”</p>
      </div>
    </div>
  );
}

export default App;