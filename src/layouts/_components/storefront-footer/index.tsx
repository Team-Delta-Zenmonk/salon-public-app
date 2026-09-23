import { Box, Typography } from "@mui/material";
import { useStorefront } from "../../../providers/storefront-provider";

export default function StorefrontFooter() {
  const { salon } = useStorefront();

  const salonName = salon?.name?.toUpperCase() || "CRIMSON & SHEAR";

  return (
    <footer className="mt-auto bg-[var(--app-surface)] border-t border-[var(--app-border)] pt-16 pb-20 md:pb-12 text-[var(--app-text)]">
      <div className="px-4 md:px-12 max-w-[1440px] mx-auto">
        {/* Top Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[var(--app-border)]">
          {/* Atelier Brand Intro */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--app-surface-alt)] p-0.5 shrink-0 border border-[var(--app-border)]">
                <img
                  alt="Scissors & Comb Sparkle Brand Icon"
                  className="w-full h-full object-cover rounded-md"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XYBNkbZmqEwkR3adhjz9QTOyWbaMxUk-gfuu_Mge1ZI579t29IMLyeogxRK2lexlZXOkzRqxVeSVLaaGoLBAe9cRHHB9JMnXg9N0hIqs_TGliGBA4Yfpq7vXPs9LsvA_EY0trF4-zxLyEM8Z-R_Ns_Z7QtVvmTVwqR8x54ElH1DUCaGNI5ufS5JuyYytDDZQ8UXnNQpj4jWA1XwMCvOb_CIzGfbxU9apPJ2Yf2dx3sbB9Gj2A2Lt3-8UY"
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

          {/* Hours of Ceremony */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-[var(--app-primary)] tracking-widest uppercase">
              Hours of Ceremony
            </span>
            <ul className="text-xs text-[var(--app-muted)] space-y-1.5 list-none p-0 m-0">
              <li className="flex justify-between">
                <span>Mon - Thu</span> <span className="text-[var(--app-text)]">10:00 AM – 8:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Fri - Sat</span> <span className="text-[var(--app-text)]">9:00 AM – 9:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span> <span className="text-[var(--app-text)]">11:00 AM – 6:00 PM</span>
              </li>
            </ul>
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
