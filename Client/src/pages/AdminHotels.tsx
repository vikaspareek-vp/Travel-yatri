import { useEffect, useState } from "react";
import axios from "axios";

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem("session_id");

      const response = await axios.get(
        "http://localhost:5000/api/admin/hotels",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setHotels(response.data);
    } catch (error) {
      console.log("Fetch hotels error:", error);
    }
  };

  const deleteHotel = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hotel?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("session_id");

      await axios.delete(
        `http://localhost:5000/api/admin/hotels/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      fetchHotels();
    } catch (error) {
      console.log("Delete hotel error:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Admin Hotels Panel
      </h1>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-4 text-left">Hotel Name</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {hotels.map((hotel: any) => (
              <tr
                key={hotel._id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">{hotel.name}</td>
                <td className="p-4">{hotel.city}</td>
                <td className="p-4">₹{hotel.pricePerNight}</td>
                <td className="p-4">
                  <button
                    onClick={() => deleteHotel(hotel._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hotels.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No hotels found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHotels;