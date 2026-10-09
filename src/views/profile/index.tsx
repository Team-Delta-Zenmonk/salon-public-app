"use client";
import { Box, Typography, Avatar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { logout } from "../../features/auth/auth.slice";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const { customer, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <Box className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-20 text-center text-[#1C1C18] bg-[#FCF9F3]">
        <div className="max-w-md mx-auto p-8 rounded-[2px] bg-[#FCFAF7] border border-[#E5DFD5] space-y-4">
          <span className="material-symbols-outlined text-[48px] text-[#A88B64]">account_circle</span>
          <h2 className="font-serif text-2xl text-[#1C1A17] font-medium">Member Sanctuary Required</h2>
          <p className="font-sans text-xs text-[#766A5E] leading-relaxed">
            Please sign in or create an atelier dossier to access your personalized treatments and bookings history.
          </p>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full bg-[#1C1A17] hover:bg-[#2E2A25] text-[#FCFAF7] rounded-[2px] py-3 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-0 cursor-pointer transition-all"
          >
            SIGN IN / CREATE DOSSIER
          </button>
        </div>
      </Box>
    );
  }

  const fullName = `${customer?.first_name || customer?.name || "Private"} ${customer?.last_name || "Client"}`.trim();

  return (
    <Box className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-10 text-[#1C1C18] bg-[#FCF9F3] min-h-screen font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-8 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[10px] font-semibold text-[#A88B64] tracking-[0.14em] uppercase">MEMBER SANCTUARY</span>
          <span className="text-[#E5DFD5] text-xs">/</span>
          <span className="font-sans text-[10px] font-semibold text-[#766A5E] tracking-[0.1em] uppercase">CLIENT DOSSIER</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-sans text-[10px] font-semibold text-[#766A5E] uppercase tracking-[0.12em]">CLIENT ID #{customer?.uuid?.slice(0, 8) || "8924"}</span>
          <div className="h-3 w-px bg-[#E5DFD5]" />
          <span className="font-sans text-[10px] font-semibold text-[#1C1A17] uppercase tracking-[0.12em]">PRIVATE SALON PATRON</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <aside className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-[2px] overflow-hidden bg-[#FCFAF7] border border-[#E5DFD5]">
            <div className="p-6 bg-[#F6F3ED] border-b border-[#E5DFD5] flex items-center gap-4">
              <Avatar className="w-14 h-14 rounded-[2px] bg-[#1C1A17] text-[#FCFAF7] font-serif text-xl border border-[#E5DFD5]">
                {fullName[0]}
              </Avatar>
              <div>
                <h3 className="font-serif text-2xl text-[#1C1A17] font-medium capitalize">{fullName}</h3>
                <p className="font-sans text-xs text-[#766A5E]">{customer?.email}</p>
                {customer?.phone && (
                  <p className="font-sans text-[11px] text-[#A88B64] mt-0.5">{customer.phone}</p>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]/60">
                <span className="font-sans text-xs text-[#766A5E]">ACCOUNT STATUS</span>
                <span className="font-sans text-xs font-semibold text-[#5A6B5C] uppercase tracking-wider">ACTIVE PATRON</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs text-[#766A5E]">DOSSIER VERIFICATION</span>
                <span className="font-sans text-xs font-semibold text-[#1C1A17] uppercase tracking-wider">AUTHENTICATED</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#FCFAF7] rounded-[2px] p-6 sm:p-8 border border-[#E5DFD5] space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-4">
              <div>
                <span className="font-sans text-[10px] font-semibold text-[#A88B64] uppercase tracking-[0.14em]">PATRON DOSSIER</span>
                <h2 className="font-serif text-2xl font-medium text-[#1C1A17]">Client Specifications</h2>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-[2px] bg-[#FCFAF7] text-[#8F4D47] hover:bg-[#F2EEE7] font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-[#E5DFD5] cursor-pointer transition-colors"
              >
                SIGN OUT
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[2px] bg-[#F6F3ED] border border-[#E5DFD5]/60">
                <span className="font-sans text-[10px] font-semibold text-[#766A5E] block uppercase tracking-[0.1em] mb-1">FIRST NAME</span>
                <span className="font-sans text-sm text-[#1C1A17] font-semibold capitalize">
                  {customer?.first_name || customer?.name || "Not provided"}
                </span>
              </div>
              <div className="p-4 rounded-[2px] bg-[#F6F3ED] border border-[#E5DFD5]/60">
                <span className="font-sans text-[10px] font-semibold text-[#766A5E] block uppercase tracking-[0.1em] mb-1">LAST NAME</span>
                <span className="font-sans text-sm text-[#1C1A17] font-semibold capitalize">
                  {customer?.last_name || "—"}
                </span>
              </div>
              <div className="p-4 rounded-[2px] bg-[#F6F3ED] border border-[#E5DFD5]/60">
                <span className="font-sans text-[10px] font-semibold text-[#766A5E] block uppercase tracking-[0.1em] mb-1">EMAIL ADDRESS</span>
                <span className="font-sans text-sm text-[#1C1A17] font-semibold">{customer?.email || "—"}</span>
              </div>
              <div className="p-4 rounded-[2px] bg-[#F6F3ED] border border-[#E5DFD5]/60">
                <span className="font-sans text-[10px] font-semibold text-[#766A5E] block uppercase tracking-[0.1em] mb-1">PHONE NUMBER</span>
                <span className="font-sans text-sm text-[#1C1A17] font-semibold">{customer?.phone || "—"}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="px-6 py-3 rounded-[2px] bg-[#1C1A17] text-[#FCFAF7] font-sans text-xs font-semibold uppercase tracking-[0.1em] border-0 cursor-pointer flex items-center gap-2"
              >
                <span>VIEW CEREMONIES & BOOKINGS</span>
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </Box>
  );
}

