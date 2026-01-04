import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invitation from "@/models/Invitation";

const STAFF_PINS = {
  "1234": "Waiter A",
  "5678": "Waiter B",
  "9012": "Security"
};

export async function POST(req) {
  try {
    await connectDB();
    const { code, pin } = await req.json();

    // Validate PIN
    if (!STAFF_PINS[pin]) {
      return NextResponse.json(
        { error: "Invalid PIN" },
        { status: 401 }
      );
    }

    const invite = await Invitation.findOne({ code });

    if (!invite) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 404 }
      );
    }

    if (invite.used) {
      return NextResponse.json(
        { error: "Invitation already used" },
        { status: 400 }
      );
    }

    invite.used = true;
    invite.usedAt = new Date();
    invite.checkedInBy = STAFF_PINS[pin];

    await invite.save();

    return NextResponse.json({
      success: true,
      checkedInBy: STAFF_PINS[pin]
    });

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
