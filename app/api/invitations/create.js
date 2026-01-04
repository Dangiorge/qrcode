import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invitation from "@/models/Invitation";

function generateCode() {
  return "INV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const invite = await Invitation.create({
      code: generateCode(),
      ...body
    });

    return NextResponse.json(invite, { status: 201 });

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
