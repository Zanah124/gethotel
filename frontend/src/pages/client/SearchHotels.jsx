import React, { useState, useEffect } from "react";
import { getHotels } from "../../services/client/hotelService";
import "./SearchHotels.css"; // optionnel pour styliser un peu

export default function SearchHotels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHotels = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHotels(searchTerm);
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
                  src={hotel.photo_principale || "/assets/images/hotel-placeholder.jpg"}
                  alt={hotel.nom}
                />
                <div className="hotel-info">
                  <h2>{hotel.nom}</h2>
                  <p>{hotel.ville}, {hotel.pays}</p>
                  <p>{hotel.description?.substring(0, 100)}...</p>
                  <p>⭐ {hotel.nombre_etoiles || "Non classé"}</p>
                  <button className="btn-reserver">Réserver</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


