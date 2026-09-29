import { Box, Typography } from "@mui/material";
import { useStorefront } from "../../../providers/storefront-provider";

export default function StorefrontFooter() {
  const { salon } = useStorefront();

  const salonName = salon?.name?.toUpperCase() || "CRIMSON & SHEAR";
  return (
    <footer className="mt-auto bg-[var(--app-surface)] border-t border-[var(--app-border)] pt-16 pb-20 md:pb-12 text-[var(--app-text)]">
      <div className="px-4 md:px-12 max-w-[1440px] mx-auto">
        {/* Top Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-[var(--app-border)]">
          {/* Atelier Brand Intro */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--app-surface-alt)] p-0.5 shrink-0 border border-[var(--app-border)]">
                <img
                  className="w-full h-full object-cover rounded-md"
                  src={salon?.logo}
                  alt={salonName}
                />
              </div>
              <span className="font-editorial text-lg text-[var(--app-text)] font-semibold tracking-wide">
                {salonName}
              </span>
            </div>
            <p className="text-xs text-[var(--app-muted)] leading-relaxed">
              {salon?.about ||
                "The epicenter of luxury coiffure and bespoke dermal treatments. Where master craftsmanship meets sensory relaxation."}
            </p>
          </div>

          {/* Etiquette Charter */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-[var(--app-primary)] tracking-widest uppercase">
              Etiquette Charter
            </span>
            <p className="text-xs text-[var(--app-muted)] leading-relaxed">
              We preserve a tranquil sanctuary. Devices must remain on silent mode. 24-hour advance cancellation requested for private VIP suites.
            </p>
          </div>

          {/* Private Salon Location */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-[var(--app-primary)] tracking-widest uppercase">
              Sanctuary Location
            </span>
            <p className="text-xs text-[var(--app-muted)] leading-relaxed">
              {salon?.address || "484 Avenue Montaigne, Flagship Studio"}
              <br />
              {salon?.phone ? `Concierge: ${salon.phone}` : "concierge@crimsonandshear.com"}
            </p>
          </div>
        </div>

        {/* Bottom Bar Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full py-6 gap-4">
          <span className="text-xs text-[var(--app-muted)] text-center md:text-left">
            © {new Date().getFullYear()} {salonName} Haute Coiffure. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <a className="text-[var(--app-muted)] hover:text-[var(--app-primary)] tracking-wider uppercase transition-colors" href="#">
              Editorial Lookbook
            </a>
            <a className="text-[var(--app-muted)] hover:text-[var(--app-primary)] tracking-wider uppercase transition-colors" href="#">
              Master Artists
            </a>
            <a className="text-[var(--app-muted)] hover:text-[var(--app-primary)] tracking-wider uppercase transition-colors" href="#">
              Private Consultations
            </a>
            <a className="text-[var(--app-muted)] hover:text-[var(--app-primary)] tracking-wider uppercase transition-colors" href="#">
              Terms & Etiquette
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
