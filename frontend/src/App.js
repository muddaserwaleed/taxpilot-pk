import React, { useState } from 'react';

function App() {
  const [page, setPage] = useState('home');
  const [result, setResult] = useState(null);
  const [income, setIncome] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    if (!income) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/calculate?income_usd=${income}`);
      const data = await res.json();
      setResult(data);
      setPage('result');
    } catch (err) {
      alert('Backend not running! Start your Python server first.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          TaxPilot <span className="text-green-300">PK</span>
        </div>
        <div className="flex gap-6 text-sm">
          <button onClick={() => setPage('home')} className={page === 'home' ? 'text-green-300 font-bold' : 'text-green-100'}>Calculator</button>
          <button onClick={() => setPage('chat')} className={page === 'chat' ? 'text-green-300 font-bold' : 'text-green-100'}>Chat</button>
        </div>
      </nav>

      {page === 'home' && (
        <div className="max-w-xl mx-auto mt-16 px-4">
          <div className="text-center mb-8">
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">FBR 2024-25 · Section 100D</span>
            <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Calculate your freelancer tax</h1>
            <p className="text-gray-500">Built for Pakistani freelancers on Upwork, Fiverr & Payoneer</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center mb-6 bg-green-50">
              <div className="text-3xl mb-2">📄</div>
              <p className="font-semibold text-gray-700">Upload Payoneer or Upwork CSV</p>
              <p className="text-sm text-gray-400 mt-1">Coming soon — use manual input below</p>
            </div>
            <div className="flex gap-3 mb-4">
              <input
                type="number"
                placeholder="Annual income e.g. 5000"
                value={income}
                onChange={e => setIncome(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-400"
              />
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <button
              onClick={calculate}
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              {loading ? 'Calculating...' : 'Calculate my tax'}
            </button>
          </div>
        </div>
      )}

      {page === 'result' && result && (
        <div className="max-w-xl mx-auto mt-10 px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Your tax breakdown</h2>
          <p className="text-gray-400 text-sm mb-6">Income: ${income} · Exchange rate: PKR 278</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-800">Total income</p>
              <p className="text-xl font-bold text-blue-900 mt-1">PKR {result.income_pkr?.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs font-bold text-red-800">Tax before exemption</p>
              <p className="text-xl font-bold text-red-900 mt-1">PKR {result.tax_before_exemption?.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs font-bold text-green-800">Section 100D savings</p>
              <p className="text-xl font-bold text-green-900 mt-1">PKR {result.section_100d_savings?.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-800">Final tax owed</p>
              <p className="text-xl font-bold text-amber-900 mt-1">PKR {result.tax_after_exemption?.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Effective tax rate</span>
              <span className="font-bold text-green-700">{result.effective_rate}%</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min(result.effective_rate * 3, 100)}%`}}></div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-bold text-green-700">AI EXPLANATION</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.explanation}</p>
          </div>
          <button onClick={() => setPage('chat')} className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition">
            Ask a tax question →
          </button>
          <button onClick={() => setPage('home')} className="w-full mt-3 border border-gray-200 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Calculate again
          </button>
        </div>
      )}

      {page === 'chat' && (
        <div className="max-w-xl mx-auto mt-10 px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Ask your tax advisor</h2>
          <p className="text-gray-400 text-sm mb-6">Powered by Google Gemini AI</p>
          <ChatPage income={result?.income_pkr || 0} />
        </div>
      )}
    </div>
  );
}

function ChatPage({ income }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI tax advisor. Ask me anything about your FBR tax return, Section 100D exemption, or freelancer tax in Pakistan.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggested = ['Am I a filer?', 'What is Section 100D?', 'Do I pay advance tax?', 'How to register on IRIS?'];

  const send = async (question) => {
    const q = question || input;
    if (!q) return;
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/chat?question=${encodeURIComponent(q)}&income_pkr=${income}`, { method: 'POST' });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Backend not reachable. Please start the Python server.' }]);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 min-h-64 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-green-700 text-white self-end rounded-br-sm' : 'bg-green-50 text-gray-700 self-start rounded-bl-sm border border-green-100'}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="bg-green-50 text-gray-400 self-start px-4 py-2 rounded-2xl text-sm">Thinking...</div>}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {suggested.map(s => (
          <button key={s} onClick={() => send(s)} className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 hover:bg-gray-50">{s}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type your tax question..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-400"
        />
        <button onClick={() => send()} className="bg-green-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-800">Send</button>
      </div>
    </div>
  );
}

export default App;