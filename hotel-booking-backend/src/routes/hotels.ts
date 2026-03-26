import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import User from "../models/user";
import { BookingType } from "../../../shared/types";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";
import { sendBookingEmail } from "../utils/sendEmail";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const router = express.Router();

// ================= SEARCH =================
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    const hotels = await Hotel.find(query);
    const total = await Hotel.countDocuments(query);

    res.json({
      data: hotels,
      pagination: {
        total,
        page: 1,
        pages: 1,
      },
    });
  } catch (error) {
    console.log("❌ Search Error:", error);
    res.status(500).json({ message: "Error" });
  }
});

// ================= GET ALL =================
router.get("/", async (_req: Request, res: Response) => {
  const hotels = await Hotel.find().sort("-lastUpdated");
  res.json(hotels);
});

// ================= GET ONE =================
router.get("/:id", async (req: Request, res: Response) => {
  const hotel = await Hotel.findById(req.params.id);
  res.json(hotel);
});

// ================= PAYMENT =================
router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const hotel = await Hotel.findById(req.params.hotelId);
      if (!hotel) return res.status(400).json({ message: "Hotel not found" });

      const totalCost = hotel.pricePerNight * req.body.numberOfNights;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "gbp",
        metadata: {
          hotelId: req.params.hotelId,
          userId: req.userId,
        },
      });

      res.send({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        totalCost,
      });
    } catch (error) {
      console.log("❌ Payment Error:", error);
      res.status(500).json({ message: "Payment Error" });
    }
  }
);

// ================= BOOKING + EMAIL =================
router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        req.body.paymentIntentId
      );

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment failed" });
      }

      // CREATE BOOKING OBJECT
      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
        hotelId: req.params.hotelId,
        createdAt: new Date(),
        status: "confirmed",
        paymentStatus: "paid",
      };

      // SAVE BOOKING
      const booking = new Booking(newBooking);
      await booking.save();
      console.log("✅ Booking saved");

      // GET USER + HOTEL
      const user = await User.findById(req.userId);
      const hotel = await Hotel.findById(req.params.hotelId);

      console.log("👤 User:", user?.email);
      console.log("🏨 Hotel:", hotel?.name);

      // ================= EMAIL =================
      if (hotel && user?.email) {
        console.log("🔥 EMAIL FUNCTION CALLED");
        console.log("📧 Sending to:", user.email);

        try {
          await sendBookingEmail(user.email, newBooking, hotel);
          console.log("✅ Email sent successfully");
        } catch (err) {
          console.log("❌ Email failed:", err);
        }
      } else {
        console.log("⚠️ Email not sent - missing user or hotel");
      }

      // ================= ANALYTICS =================
      await Hotel.findByIdAndUpdate(req.params.hotelId, {
        $inc: { totalBookings: 1 },
      });

      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalBookings: 1 },
      });

      res.status(200).json({
        success: true,
        message: "Booking successful",
      });
    } catch (error) {
      console.log("❌ Booking Error:", error);
      res.status(500).json({ message: "Booking failed" });
    }
  }
);

// ================= QUERY BUILDER =================
const constructSearchQuery = (queryParams: any) => {
  let query: any = {};

  if (queryParams.destination) {
    query.$or = [
      { city: { $regex: queryParams.destination, $options: "i" } },
      { country: { $regex: queryParams.destination, $options: "i" } },
    ];
  }

  return query;
};

export default router;