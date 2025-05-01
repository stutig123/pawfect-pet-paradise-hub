
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-display font-bold mb-2">Pet Management</h2>
            <p className="text-gray-600 mb-4">Manage adoptable pets in the system.</p>
            <p className="text-sm text-gray-500">6 pets available</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-display font-bold mb-2">Product Inventory</h2>
            <p className="text-gray-600 mb-4">Update product stock and details.</p>
            <p className="text-sm text-gray-500">24 products in inventory</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-display font-bold mb-2">User Management</h2>
            <p className="text-gray-600 mb-4">Manage user accounts and permissions.</p>
            <p className="text-sm text-gray-500">12 registered users</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-display font-bold mb-4">Recent Adoption Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Pet</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#ADO-001</td>
                  <td className="py-3 px-4">Max (Golden Retriever)</td>
                  <td className="py-3 px-4">John Doe</td>
                  <td className="py-3 px-4">2023-05-01</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#ADO-002</td>
                  <td className="py-3 px-4">Luna (Persian)</td>
                  <td className="py-3 px-4">Sarah Johnson</td>
                  <td className="py-3 px-4">2023-04-28</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Approved</span></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#ADO-003</td>
                  <td className="py-3 px-4">Charlie (Cockatiel)</td>
                  <td className="py-3 px-4">Mike Smith</td>
                  <td className="py-3 px-4">2023-04-25</td>
                  <td className="py-3 px-4"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejected</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
