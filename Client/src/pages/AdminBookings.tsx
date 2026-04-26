import { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("session_id");

      const response = await axios.get(
        "http://localhost:5000/api/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setBookings(response.data);
    } catch (error) {
      console.log("Fetch bookings error:", error);
    }
  };

  const deleteBooking = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("session_id");

      await axios.delete(
        `http://localhost:5000/api/admin/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchBookings();
    } catch (error) {
      console.log("Delete booking error:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Admin Bookings Panel
      </h1>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">User Email</th>
              <th className="p-4 text-left">Hotel Name</th>
              <th className="p-4 text-left">Check In</th>
              <th className="p-4 text-left">Check Out</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking: any) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{booking.userEmail}</td>
                <td className="p-4">{booking.hotelName}</td>
                <td className="p-4">
                  {new Date(booking.checkIn).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {new Date(booking.checkOut).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => deleteBooking(booking._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;