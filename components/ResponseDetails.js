// app/admin/components/ResponseDetails.js
export default function ResponseDetails({ response }) {
  if (!response) return null;

  return (
    <div className="bg-gray-100 rounded-2xl p-6 border-l-4 border-[#667eea]">
      <h4 className="text-xl font-semibold text-gray-800 mb-3">📊 Last Response Details</h4>
      <pre className="bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto text-sm">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}