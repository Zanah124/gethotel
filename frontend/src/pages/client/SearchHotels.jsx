import React, { useState, useEffect } from "react";
import hotelService from "../../services/client/hotelService";
import BookingForm from "../../components/clients/BookingForm";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { getHotelImageUrl } from "../../utils/imageUtils";
import { Search, MapPin, Star, Loader2 } from "lucide-react";

export default function SearchHotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchHotels = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await hotelService.getHotels(searchTerm);
      setHotels(data);
    } catch (error) {
      console.error("Erreur lors du chargement des hôtels :", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleBookHotel = (hotel) => {
    if (!user) {
      alert("Vous devez être connecté pour réserver un hôtel");
      navigate("/login");
      return;
    }
    setSelectedHotel(hotel);
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedHotel(null);
  };

  const handleBookingSuccess = (reservation) => {
    alert(
      `Réservation confirmée ! Numéro de réservation: ${reservation.numero_reservation}`
    );
  };

  return (
    <div className="min-h-screen bg-[#A48374] text-white pt-24 md:pt-28 pb-16">
      {/* En-tête */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 mb-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white">
            Trouver un <span className="text-[#f4e4bc]">hôtel</span>
          </h1>
          <p className="text-white/90 text-lg">
            Recherchez par ville ou nom d'hôtel
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Ville ou nom d'hôtel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchHotels()}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-[#49B9FF] focus:ring-2 focus:ring-[#49B9FF]/20 outline-none transition"
            />
          </div>
          <button
            onClick={fetchHotels}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#49B9FF] hover:bg-[#3aa8ee] text-black font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                Rechercher
              </>
            )}
          </button>
        </div>
      </section>

      {/* Liste des hôtels */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
            <p className="text-white/90">Chargement des hôtels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/30 bg-white/10">
            <p className="text-white text-lg">Aucun hôtel trouvé.</p>
            <p className="text-white/80 text-sm mt-2">
              Essayez un autre terme de recherche.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <article
                key={hotel.id}
                className="group rounded-2xl overflow-hidden border border-white/20 bg-white hover:border-[#49B9FF]/60 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      hotel.photo_principale
                        ? getHotelImageUrl(hotel.photo_principale)
                        : "/assets/images/hotel-placeholder.jpg"
                    }
                    alt={hotel.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[#f4B34C] font-medium drop-shadow">
                      <Star className="w-4 h-4 fill-current" />
                      {hotel.nombre_etoiles || "—"} étoiles
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {hotel.nom}
                  </h2>
                  <p className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 text-[#49B9FF] flex-shrink-0" />
                    {hotel.ville}, {hotel.pays}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {hotel.description
                      ? `${hotel.description.substring(0, 100)}${hotel.description.length > 100 ? "…" : ""}`
                      : "Aucune description."}
                  </p>
                  <button
                    onClick={() => handleBookHotel(hotel)}
                    className="w-full py-3 rounded-xl bg-[#49B9FF] hover:bg-[#3aa8ee] text-black font-semibold transition"
                  >
                    Réserver
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showBookingForm && selectedHotel && (
        <BookingForm
          hotel={selectedHotel}
          onClose={handleCloseBookingForm}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
