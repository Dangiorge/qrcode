"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function GeneratePage() {
  const [form, setForm] = useState({
    guestName: "",
    phone: "",
    allowedPeople: 1,
    venueName: "",
    venueAddress: "",
    mapLink: ""
  });

  const [invite, setInvite] = useState(null);
  const [qr, setQr] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateInvite = async () => {
    const res = await fetch("/api/invitations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setInvite(data);

    const link = `${window.location.origin}/invite/${data.code}`;
    const qrImg = await QRCode.toDataURL(link, { width: 600 });
    setQr(qrImg);
  };

  const link = invite
    ? `${window.location.origin}/invite/${invite.code}`
    : "";

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Invitation</h1>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          onChange={handleChange}
          className="w-full mb-2 border p-2"
        />
      ))}

      <button
        onClick={generateInvite}
        className="bg-black text-white px-4 py-2 mt-2"
      >
        Generate
      </button>

      {invite && (
        <div className="mt-6 space-y-3">
          <input value={link} readOnly className="w-full border p-2" />

          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="border px-4 py-2"
          >
            Copy Link
          </button>

          <a
            href={`https://wa.me/${invite.phone}?text=${encodeURIComponent(
              `🎉 You are invited!\n\n${link}`
            )}`}
            target="_blank"
            className="block bg-green-600 text-white px-4 py-2 text-center"
          >
            Send via WhatsApp
          </a>

          <img src={qr} alt="QR Code" className="mx-auto" />
        </div>
      )}
    </div>
  );
}
