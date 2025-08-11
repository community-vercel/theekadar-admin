// app/admin/dashboard/page.jsx
import AdminLayout from '../../../components/AdminLayout';

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
        <p className="text-gray-600">Welcome to the Theekadar admin panel. Use the navigation to manage users, verifications, and search by location.</p>
      </div>
    </AdminLayout>
  );
}