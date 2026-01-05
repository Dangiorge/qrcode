"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { 
  PlusCircle, Send, Copy, Check, User, MapPin, 
  Users, Phone, Globe, ExternalLink, QrCode as QrIcon,
  Lock, ShieldCheck, X
} from "lucide-react";

// 🔐 HARDCODED PIN - Change this to your preferred secret
const ADMIN_PIN = "1234"; 

export default function GeneratePage() {
  const [form, setForm] = useState({
    guestName: "",
    phone: "",
    allowedPeople: 1,
    venueName: "Bilos Pastry",
    venueAddress: "Ethipia Addis Abeba Lancha ",
    mapLink: "https://maps.app.goo.gl/jYUVN1WcFbGEvuTS9"
  });

  const [invite, setInvite] = useState(null);
  const [qr, setQr] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  // PIN MODAL STATES
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 1. Initial Trigger
  const handleTriggerGenerate = () => {
    setIsPinModalOpen(true);
  };

  // 2. PIN Verification & Final Generation
  const verifyAndGenerate = async () => {
    if (enteredPin === ADMIN_PIN) {
      setPinError(false);
      setIsPinModalOpen(false);
      setEnteredPin(""); // Clear for security
      await generateInvite();
    } else {
      setPinError(true);
      setEnteredPin("");
    }
  };

  const generateInvite = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invitations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setInvite(data);
      const linkorigen = "https://qrcode-mauve-psi.vercel.app"

      // const link = `${window.location.origin}/invite/${data.code}`;
      const link = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${data.code}`;
      const qrImg = await QRCode.toDataURL(link, { 
        width: 600,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" }
      });
      setQr(qrImg);
    } catch (err) {
      alert("Failed to create invitation");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // const inviteLink = invite ? `${window.location.origin}/invite/${invite.code}` : "";
  const inviteLink = invite ? `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${invite.code}` : "";

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 relative">
      
      {/* 🔐 PIN MODAL POPUP */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-indigo-100 p-2 rounded-xl">
                <Lock className="text-indigo-600" size={20} />
              </div>
              <button onClick={() => setIsPinModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Security Check</h3>
            <p className="text-slate-500 text-sm mb-6">Please enter the administrator PIN to authorize this invitation.</p>

            <div className="space-y-4">
              <input 
                type="password" 
                autoFocus
                placeholder="••••" 
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifyAndGenerate()}
                className={`w-full text-center text-2xl tracking-[0.5em] py-3 bg-slate-50 border ${pinError ? 'border-red-500 ring-red-100' : 'border-slate-200 focus:ring-indigo-500'} rounded-2xl outline-none focus:ring-4 transition-all`}
              />
              
              {pinError && (
                <p className="text-red-500 text-xs text-center font-medium animate-bounce">Incorrect PIN. Please try again.</p>
              )}

              <button
                onClick={verifyAndGenerate}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
              >
                Verify & Generate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Event Management
          </h1>
          <p className="text-slate-500 mt-2">Generate secure, personalized one-scan invitations.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FORM SECTION */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <ShieldCheck className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-slate-800">New Invitation</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Guest Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input name="guestName" placeholder="John Doe" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input name="phone" placeholder="123456789" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Allowed Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="number" name="allowedPeople" min="1" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div>
                {/* <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Venue Name</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input name="venueName" placeholder="Grand Ballroom" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </div> */}
              </div>

              {/* <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Venue Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input name="venueAddress" placeholder="123 Luxury St, New York" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div> */}

              {/* <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Google Maps Link</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input name="mapLink" placeholder="http://googleusercontent.com/..." onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div> */}

              <button
                onClick={handleTriggerGenerate}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:bg-indigo-300"
              >
                {loading ? "Generating Secure Link..." : "Create Invitation"}
              </button>
            </div>
          </div>

          {/* RIGHT: PREVIEW/RESULT SECTION */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {invite ? (
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <QrIcon size={120} />
                </div>
                
                <h3 className="text-indigo-400 uppercase text-xs font-bold tracking-[0.2em] mb-4">Preview & Share</h3>
                
                <div className="bg-white rounded-2xl p-4 mb-6 inline-block">
                  <img src={qr} alt="QR Code" className="w-48 h-48" />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Guest Link</p>
                    <div className="flex gap-2 mt-1">
                      <input readOnly value={inviteLink} className="bg-slate-800 border-none text-slate-300 text-xs p-3 rounded-lg flex-1 outline-none" />
                      <button onClick={() => copyToClipboard(inviteLink)} className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                        {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${invite.phone}?text=${encodeURIComponent(
                      `Hello ${invite.guestName}!\n\nWe are excited to invite you to our event. View your pass here:\n\n${inviteLink}`
                    )}`}
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all"
                  >
                    <Send size={18} />
                    Send via WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <QrIcon className="text-slate-300" size={32} />
                </div>
                <h3 className="text-slate-900 font-bold">No invitation yet</h3>
                <p className="text-slate-500 text-sm max-w-[200px] mt-1">Fill out the form and verify PIN to generate pass.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}