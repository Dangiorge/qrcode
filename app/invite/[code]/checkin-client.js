"use client";

import { useState } from "react";

export default function CheckInClient({ code, used }) {
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState(null);

  if (used) {
    return (
      <div className="text-red-600 font-bold mt-4">
        ❌ Already Checked In
      </div>
    );
  }

  const checkIn = async () => {
    const res = await fetch("/api/invitations/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, pin })
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error);
      return;
    }

    setStatus(`✅ Checked in by ${data.checkedInBy}`);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Check In
      </button>

      {status && <p className="mt-3 font-bold">{status}</p>}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded space-y-3 w-64">
            <h2 className="font-bold">Enter PIN</h2>

            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="border w-full p-2"
              placeholder="PIN"
            />

            <button
              onClick={checkIn}
              className="bg-black text-white w-full py-2"
            >
              Confirm
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="text-sm text-gray-500 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
