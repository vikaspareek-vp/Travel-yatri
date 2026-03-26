import nodemailer from "nodemailer";

export const sendBookingEmail = async (
  userEmail: string,
  booking: any,
  hotel: any
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Hotel Booking Confirmation",
      html: `
        <h2>Booking Confirmed ✅</h2>
        <p><b>Hotel:</b> ${hotel.name}</p>
        <p><b>Check-in:</b> ${booking.checkIn}</p>
        <p><b>Check-out:</b> ${booking.checkOut}</p>
      `,
    });

    console.log("✅ Email sent via Gmail");
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};