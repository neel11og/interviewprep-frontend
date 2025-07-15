export default function Feedback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold mb-4 text-purple-700">✅ Feedback</h2>
      <p className="text-gray-800 mb-2">Thanks for your answer!</p>
      <p className="text-gray-600">AI-based feedback will appear here in the future.</p>
      <a
        href="/"
        className="mt-6 text-blue-600 hover:underline"
      >
        Go back to Home
      </a>
    </div>
  );
}
