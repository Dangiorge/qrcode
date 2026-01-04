import { connectDB } from "@/lib/mongodb";
import Invitation from "@/models/Invitation";
import CheckInClient from "./checkin-client";
import { MapPin, Users, Phone, CalendarDays, ExternalLink } from "lucide-react";

export default async function InvitePage({ params }) {
  const { code } = await params;

  await connectDB();
  const invite = await Invitation.findOne({ code }).lean();

  if (!invite) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-slate-900 text-2xl font-bold">Invalid Invite</h1>
          <p className="text-slate-500 mt-2">This link appears to be broken or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Decorative Background Blur */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-amber-100 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-100 rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="w-full max-w-md relative">
        {/* THE TICKET DESIGN */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-white">
          
          {/* Header Section */}
          <div className="bg-slate-900 px-8 pt-12 pb-16 text-center relative">
            <div className="uppercase tracking-[0.3em] text-amber-400 text-[10px] font-bold mb-4">
              Official Invitation
            </div>
            <h1 className="text-white text-3xl font-serif italic italic mb-2 leading-tight">
              {invite.guestName}
            </h1>
            <p className="text-slate-400 text-sm font-light uppercase tracking-widest">
              Exclusive Entry Pass
            </p>
            
            {/* Ticket Notch Decor */}
            <div className="absolute bottom-[-15px] left-[-15px] w-8 h-8 bg-[#FDFCFB] rounded-full border-r border-slate-100 shadow-inner" />
            <div className="absolute bottom-[-15px] right-[-15px] w-8 h-8 bg-[#FDFCFB] rounded-full border-l border-slate-100 shadow-inner" />
          </div>

          {/* Details Section */}
          <div className="px-8 pt-10 pb-8 space-y-8">
            
            {/* Guest Count & Status Component (Your Client Component) */}
            <div className="relative z-10">
               <CheckInClient code={invite.code} used={invite.used} />
            </div>

            {/* Event Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="text-indigo-600 bg-white p-2 rounded-xl shadow-sm">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Admits</p>
                  <p className="text-slate-900 font-bold">{invite.allowedPeople} People</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="text-amber-600 bg-white p-2 rounded-xl shadow-sm">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Event</p>
                  <p className="text-slate-900 font-bold">RSVP Only</p>
                </div>
              </div>
            </div>

            {/* Venue & Maps Section */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{invite.venueName}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {invite.venueAddress}
                  </p>
                </div>
              </div>

              {/* GOOGLE MAPS LINK */}
              <a 
                href={invite.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98]"
              >
                <ExternalLink size={18} />
                Open in Google Maps
              </a>
            </div>

            {/* Footer Contact */}
            <div className="pt-6 border-t border-dashed border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Phone size={14} />
                {invite.phone}
              </div>
              <div className="text-[10px] font-mono text-slate-300 uppercase tracking-tighter">
                Ref: {invite.code}
              </div>
            </div>
          </div>
        </div>
        
        {/* Branding/Note */}
        <p className="text-center mt-8 text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
          Please present this at the entrance
        </p>
      </div>
    </div>
  );
}