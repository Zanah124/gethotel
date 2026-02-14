import React, { useState, useEffect } from "react";
import hotelService from "../../services/client/hotelService";
import BookingForm from "../../components/clients/BookingForm";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { getHotelImageUrl } from "../../utils/imageUtils";
import "./SearchHotels.css"; // optionnel pour styliser un peu

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
      alert('Vous devez être connecté pour réserver un hôtel');
      navigate('/login');
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
    alert(`Réservation confirmée ! Numéro de réservation: ${reservation.numero_reservation}`);
    // Optionnel: rediriger vers une page de confirmation ou vers les réservations de l'utilisateur
    // navigate('/client/reservations');
  };

  return (
    <div className="search-hotels-page">
      <h1>🔍 Trouver un hôtel</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par ville ou nom d’hôtel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={fetchHotels}>Rechercher</button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="hotel-list">
          {hotels.length === 0 ? (
            <p>Aucun hôtel trouvé.</p>
          ) : (
            hotels.map((hotel) => (
              <div key={hotel.id} className="hotel-card">
                <img
                  src={hotel.photo_principale
                    ? getHotelImageUrl(hotel.photo_principale)
                    : "/assets/images/hotel-placeholder.jpg"
                  }
                  alt={hotel.nom}
                  className="hotel-image"
                />
                <div className="hotel-info">
                  <h2>{hotel.nom}</h2>
                  <p>{hotel.ville}, {hotel.pays}</p>
                  <p>{hotel.description?.substring(0, 100)}...</p>
                  <p>⭐ {hotel.nombre_etoiles || "Non classé"}</p>
                  <button
                    className="btn-reserver"
                    onClick={() => handleBookHotel(hotel)}
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal de réservation */}
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


