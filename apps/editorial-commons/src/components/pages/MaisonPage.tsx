import { useEditorialBrand } from '../../portable/EditorialHost';
import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Award,
  Globe,
  ArrowRight,
  Send
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useEditorialData } from '../../portable/EditorialHost';
import { BeforeAfterSlider } from '../BeforeAfterSlider';

export const MaisonPage: React.FC = () => {
  const brand = useEditorialBrand();
  const { HERO_IMAGE, LOOKBOOK_IMAGE, SPLIT_COTTON_IMAGE, SPLIT_LEATHER_IMAGE, PDP_LEATHER_TEE_IMAGE } = useEditorialData();
  const ATELIERS = [
  {
    city: 'PARIS',
    address: '14 Rue Saint-Honoré, 75001 Paris, France',
    hours: 'Mon – Sat: 10:00 – 19:30',
    contact: '+33 1 42 68 00 15',
    image: HERO_IMAGE
  },
  {
    city: 'TOKYO',
    address: '5-7-22 Minami-Aoyama, Minato-ku, Tokyo 107-0062',
    hours: 'Tue – Sun: 11:00 – 20:00',
    contact: '+81 3 5468 1120',
    image: SPLIT_LEATHER_IMAGE
  },
  {
    city: 'NEW YORK',
    address: '92 Mercer Street, SoHo, New York, NY 10012',
    hours: 'Mon – Sat: 11:00 – 19:00, Sun: 12:00 – 18:00',
    contact: '+1 212 966 4500',
    image: LOOKBOOK_IMAGE
  },
  {
    city: 'LONDON',
    address: '38 Mount Street, Mayfair, London W1K 2RY',
    hours: 'Mon – Sat: 10:00 – 18:30',
    contact: '+44 20 7499 1500',
    image: SPLIT_COTTON_IMAGE
  },
  {
    city: 'MILAN',
    address: 'Via Montenapoleone 18, 20121 Milano, Italy',
    hours: 'Mon – Sat: 10:30 – 19:30',
    contact: '+39 02 7600 3210',
    image: PDP_LEATHER_TEE_IMAGE
  }
];

  const { navigateTo } = useCart();
  const [selectedAtelier, setSelectedAtelier] = useState(ATELIERS[0]);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingEmail.trim()) return;
    setIsBooked(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] pt-24 pb-28"><p role="note" className="px-6 pt-5 text-xs bg-black text-white/75">
   Concept showroom and booking mockups — these locations, contact details, and appointments are not verified or live.
 </p>
      {/* Hero Section */}
      <section className="border-b border-black/5 bg-[#faf8f5] py-16 sm:py-24 px-6 sm:px-10">
        <div className="max-w-[1440px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#8b181b] uppercase font-mono px-3 py-1 rounded-full bg-black/5 border border-black/5">
            <span>◆ MAISON & ATELIER PROVENANCE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#0a0a0a] uppercase max-w-4xl mx-auto leading-none">
            THE ARCHITECTURE OF SILHOUETTE
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-light leading-relaxed">
            Founded on the principle that true luxury exists at the intersection of architectural form, tactile materiality, and uncompromising small-batch craftsmanship.
          </p>
        </div>
      </section>

      {/* Philosophy Statement Grid */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#8b181b] uppercase">
              OUR ATELIER CODE
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight uppercase text-black">
              QUIET LUXURY BORN FROM PAINSTAKING STUDY
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              <p>
                Every {brand.name} garment begins as a 3D draped toile in our Florence studio. We do not design for temporary seasonal hype; rather, our patterns undergo hundreds of fitting iterations until shoulder-to-hem lines balance effortlessly against gravity.
              </p>
              <p>
                From 380gsm English wool crepe woven exclusively in Huddersfield to full-grain lambskin drum-dyed in small batches with vegetable extracts, our raw materials are selected to age gracefully and develop personal patina over decades.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10">
              <div className="space-y-1">
                <span className="text-2xl font-light font-mono text-black">120 PCS</span>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                  Limited batch cap per silhouette
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-light font-mono text-black">100%</span>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
                  Traceable European supply chain
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-neutral-100 shadow-md">
              <img
                src={SPLIT_LEATHER_IMAGE}
                alt="Florentine Leathercraft"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-neutral-100 shadow-md translate-y-6">
              <img
                src={HERO_IMAGE}
                alt="English Tailoring"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* S19 Interactive Before/After Craft Slider */}
      <section className="bg-[#0a0a0a] text-white py-16 sm:py-24 px-6 sm:px-10">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono tracking-[0.25em] text-[#e2a8aa] uppercase">
              TACTILE METAMORPHOSIS
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight uppercase text-white">
              THE RHYTHM OF CONTRAST
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light">
              Drag the interactive dividing line below to inspect raw unrefined organic twill versus drum-dyed full-grain lambskin.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <BeforeAfterSlider />
          </div>
        </div>
      </section>

      {/* Global Ateliers & Private Appointment Booking */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 py-16 sm:py-24">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 pb-8">
            <div className="space-y-2">
              <span className="text-[11px] font-mono tracking-[0.25em] text-[#8b181b] uppercase">
                GLOBAL FLAGSHIPS
              </span>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight uppercase text-black">
                VISIT THE MAISON
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md font-light">
              Experience the Autumn / Winter 26 collection in person with private concierge fitting suites across five global capitals.
            </p>
          </div>

          {/* Atelier City Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {ATELIERS.map(atelier => (
              <button
                key={atelier.city}
                onClick={() => setSelectedAtelier(atelier)}
                className={`p-4 rounded-sm border text-left transition-all cursor-pointer ${
                  selectedAtelier.city === atelier.city
                    ? 'border-black bg-black text-white shadow-md'
                    : 'border-black/10 bg-neutral-50 text-black hover:border-black/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold tracking-widest">{atelier.city}</span>
                  <MapPin className="w-3.5 h-3.5 opacity-60" />
                </div>
                <p className={`text-[10px] font-mono truncate ${
                  selectedAtelier.city === atelier.city ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  {atelier.address.split(',')[0]}
                </p>
              </button>
            ))}
          </div>

          {/* Selected Atelier Detail & Booking Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-neutral-50 p-6 sm:p-10 rounded-sm border border-black/10">
            <div className="lg:col-span-6 space-y-6">
              <div className="aspect-[16/9] w-full rounded-sm overflow-hidden bg-neutral-200">
                <img
                  src={selectedAtelier.image}
                  alt={selectedAtelier.city}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-light uppercase tracking-tight text-black">
                  {brand.name} CONCEPT · {selectedAtelier.city}
                </h3>
                <div className="space-y-1.5 text-xs text-neutral-600 font-mono">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8b181b]" />
                    <span>{selectedAtelier.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{selectedAtelier.hours}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-sm border border-black/5 shadow-xs space-y-6">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-black">
                  REQUEST PRIVATE APPOINTMENT
                </h4>
                <p className="text-[11px] text-neutral-500 font-light">
                  Enjoy complimentary champagne styling and custom tailoring fittings.
                </p>
              </div>

              {isBooked ? (
                <div className="p-6 bg-[#faf8f5] border border-black/10 rounded-sm text-center space-y-3 animate-[fadeIn_0.3s_ease-out]">
                  <CheckCircle2 className="w-8 h-8 text-[#8b181b] mx-auto" />
                  <h5 className="text-xs font-bold tracking-widest uppercase">
                    APPOINTMENT REQUEST CONFIRMED
                  </h5>
                  <p className="text-[11px] text-neutral-600 font-light">
                    Our {selectedAtelier.city} Maison Concierge will contact you at {bookingEmail} within 4 hours to finalize your suite reservation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amelia Vance"
                      value={bookingName}
                      onChange={e => setBookingName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-black/10 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="amelia@vance.com"
                      value={bookingEmail}
                      onChange={e => setBookingEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-black/10 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">
                      PREFERRED DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={e => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-black/10 rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>CONFIRM APPOINTMENT</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
