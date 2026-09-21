import { useState } from 'react';

function App() {
  const [notesText, setNotesText] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState('');
  const [flashcards, setFlashcards] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:8000/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setNotesText(data.text);
  };

  const askQuestion = async () => {
    setLoading(true);
    const response = await fetch('http://127.0.0.1:8000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context: notesText }),
    });
    const data = await response.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  const summarize = async () => {
    setLoading(true);
    const response = await fetch('http://127.0.0.1:8000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: notesText }),
    });
    const data = await response.json();
    setSummary(data.summary);
    setLoading(false);
  };

  const generateQuiz = async () => {
    setLoading(true);
    const response = await fetch('http://127.0.0.1:8000/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: notesText }),
    });
    const data = await response.json();
    setQuiz(data.quiz);
    setLoading(false);
  };

  const generateFlashcards = async () => {
    setLoading(true);
    const response = await fetch('http://127.0.0.1:8000/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: notesText }),
    });
    const data = await response.json();
    setFlashcards(data.flashcards);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">AI Study Assistant</h1>

      <div className="bg-white p-4 rounded-lg shadow border">
        <label className="block text-sm font-medium mb-2">Upload notes (.txt or .pdf)</label>
        <input type="file" accept=".txt,.pdf" onChange={handleFileUpload} />
        {notesText && (
          <p className="text-sm text-gray-500 mt-2">
            Loaded {notesText.length} characters of notes.
          </p>
        )}
      </div>

      {notesText && (
        <>
          <div className="bg-white p-4 rounded-lg shadow border space-y-2">
            <label className="block text-sm font-medium">Ask a question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Explain deadlock in simple terms"
            />
            <button
              onClick={askQuestion}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              Ask AI
            </button>
            {answer && <p className="mt-2 whitespace-pre-wrap">{answer}</p>}
          </div>

          <div className="bg-white p-4 rounded-lg shadow border space-y-2">
            <button
              onClick={summarize}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              Summarize Notes
            </button>
            {summary && <p className="mt-2 whitespace-pre-wrap">{summary}</p>}
          </div>

          <div className="bg-white p-4 rounded-lg shadow border space-y-2">
            <button
              onClick={generateQuiz}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              Generate Quiz
            </button>
            {quiz && <p className="mt-2 whitespace-pre-wrap">{quiz}</p>}
          </div>

          <div className="bg-white p-4 rounded-lg shadow border space-y-2">
            <button
              onClick={generateFlashcards}
              disabled={loading}
              className="bg-orange-600 text-white px-4 py-2 rounded font-semibold hover:bg-orange-700 disabled:opacity-50"
            >
              Generate Flashcards
            </button>
            {flashcards && <p className="mt-2 whitespace-pre-wrap">{flashcards}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default App;