import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import BookingForm from "../../components/BookingForm"; // Ton modal actuel

const HotelRoomsList = () => {
  const { id } = useParams(); // ID de l'hôtel
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [typesChambres, setTypesChambres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null); // Pour ouvrir le modal
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await api.get(`/client/hotels/${id}`);
        const hotelData = response.data.data;

        setHotel(hotelData);

        // Extraire les types de chambres depuis les chambres incluses
        const types = hotelData.chambres.reduce((acc, chambre) => {
          const type = chambre.type_chambre;
          if (type && !acc.find(t => t.id === type.id)) {
            // Ajouter le statut global du type (ex: nb disponibles)
            const chambresDuType = hotelData.chambres.filter(c => c.type_chambre.id === type.id);
            const disponibles = chambresDuType.filter(c => c.statut === "disponible").length;

            acc.push({
              ...type,
              nombreDisponibles: disponibles,
              totalChambres: chambresDuType.length
            });
          }
          return acc;
        }, []);

        setTypesChambres(types);
        setLoading(false);
      } catch (error) {
        console.error("Erreur chargement hôtel", error);
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleReserve = (typeChambre) => {
    if (!checkIn || !checkOut) {
      alert("Veuillez d'abord sélectionner vos dates d'arrivée et de départ.");
      return;
    }
    setSelectedType(typeChambre);
  };

  const handleCloseModal = () => {
    setSelectedType(null);
  };

  const handleSuccess = (reservation) => {
    alert(`Réservation confirmée ! Numéro : ${reservation.numero_reservation}`);
    navigate("/client/my-reservations"); // ou une page de confirmation
  };

  if (loading) return <div className="text-center">Chargement de l'hôtel...</div>;
  if (!hotel) return <div>Hôtel non trouvé</div>;

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-[#861D1D] hover:underline"
      >
        ← Retour à la fiche hôtel
      </button>

      <h1 className="text-3xl font-bold text-[#861D1D] mb-2">
        Chambres disponibles à {hotel.nom}
      </h1>
      <p className="text-gray-600 mb-8">
        {hotel.ville}, {hotel.pays} • ⭐ {hotel.nombre_etoiles || "Non classé"}
      </p>

      {/* Sélecteur de dates */}
      <div className="bg-gray-50 p-6 rounded-lg mb-10 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-semibold mb-2">Date d'arrivée</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block font-semibold mb-2">Date de départ</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
            min={checkIn || new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">
            Sélectionnez vos dates pour réserver
          </p>
        </div>
      </div>

      {/* Liste des types de chambres */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {typesChambres.map((type) => (
          <div key={type.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Photo principale */}
            <div className="h-64 overflow-hidden">
              <img
                src={
                  type.photos && type.photos.length > 0
                    ? `http://localhost:5000${JSON.parse(type.photos)[0]}`
                    : "/placeholder-room.jpg"
                }
                alt={type.nom}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/placeholder-room.jpg")}
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#081F5C] mb-2">{type.nom}</h3>

              <p className="text-3xl font-bold text-[#861D1D] mb-4">
                {type.prix_par_nuit} Ar <span className="text-sm font-normal text-gray-600">/ nuit</span>
              </p>

              <div className="space-y-2 text-gray-700 mb-4">
                <p>👥 Capacité : {type.capacite ?? 2} personne(s)</p>
                <p>
                  📊 Statut :{" "}
                  <span className={type.nombreDisponibles > 0 ? "text-green-600" : "text-red-600"}>
                    {type.nombreDisponibles} / {type.totalChambres} disponibles
                  </span>
                </p>
              </div>

              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {type.description || "Chambre confortable avec tous les équipements nécessaires."}
              </p>

              <button
                onClick={() => handleReserve(type)}
                disabled={type.nombreDisponibles === 0 || !checkIn || !checkOut}
                className={`w-full py-4 rounded-lg font-bold text-white transition ${
                  type.nombreDisponibles > 0 && checkIn && checkOut
                    ? "bg-[#861D1D] hover:bg-[#681515]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {type.nombreDisponibles === 0
                  ? "Indisponible"
                  : "Réserver cette chambre"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de réservation */}
      {selectedType && (
        <BookingForm
          hotel={hotel}
          typeChambre={selectedType} // Tu peux l'utiliser dans le formulaire si besoin
          checkInDefault={checkIn}
          checkOutDefault={checkOut}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default HotelRoomsList;