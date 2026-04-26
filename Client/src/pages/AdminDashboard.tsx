import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold text-blue-700 mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* USERS PANEL */}
        <div
          onClick={() => navigate("/admin/users")}
          className="cursor-pointer bg-blue-500 text-white p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-2">Users Panel</h2>
          <p>Manage all registered users</p>
        </div>

        {/* HOTELS PANEL */}
        <div
          onClick={() => navigate("/admin/hotels")}
          className="cursor-pointer bg-green-500 text-white p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-2">Hotels Panel</h2>
          <p>Manage hotel listings</p>
        </div>

        {/* BOOKINGS PANEL */}
        <div
          onClick={() => navigate("/admin/bookings")}
          className="cursor-pointer bg-purple-500 text-white p-8 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <h2 className="text-2xl font-bold mb-2">Bookings Panel</h2>
          <p>Manage hotel bookings</p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;