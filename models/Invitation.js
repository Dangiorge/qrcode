import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    guestName: String,
    phone: String,
    allowedPeople: Number,
    venueName: String,
    venueAddress: String,
    mapLink: String,
    used: { type: Boolean, default: false },
    usedAt: Date
  },
  { timestamps: true }
);

export default mongoose.models.Invitation ||
  mongoose.model("Invitation", InvitationSchema);
