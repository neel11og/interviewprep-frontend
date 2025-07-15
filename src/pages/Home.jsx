export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <h1 className="text-4xl font-bold text-purple-700 mb-4">InterviewPrep.AI</h1>
      <p className="text-lg text-gray-600 mb-6">Your smart mock interview partner</p>
      <a
        href="/interview"
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Start Interview
      </a>
    </div>
  );
}
