import express from "express";
import User from "../models/user";
import verifyToken from "../middleware/verifyToken";
import { verifyAdmin } from "../middleware/admin";
import Hotel from "../models/hotel";
import Booking from "../models/booking";

const router = express.Router();

//
// ================= USERS =================
//

// GET ALL USERS
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// DELETE USER
router.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// CHANGE ROLE
router.put("/users/:id/role", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating role" });
  }
});

//
// ================= HOTELS =================
//

// GET ALL HOTELS
router.get("/hotels", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// DELETE HOTEL
router.delete("/hotels/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hotel" });
  }
});

//
// ================= BOOKINGS =================
//

// GET ALL BOOKINGS
router.get("/bookings", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find();

    const users = await User.find();
    const hotels = await Hotel.find();

    const formattedBookings = bookings.map((booking) => {
      const user = users.find(
        (u) => u._id.toString() === booking.userId
      );

      const hotel = hotels.find(
        (h) => h._id.toString() === booking.hotelId
      );

      return {
        ...booking.toObject(),
        userEmail: user?.email || "Unknown User",
        hotelName: hotel?.name || "Unknown Hotel",
      };
    });

    res.json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// DELETE BOOKING
router.delete("/bookings/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});

export default router;