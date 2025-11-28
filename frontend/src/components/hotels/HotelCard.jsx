import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Wifi, Car } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  // Sécurité si données manquantes
  const name = hotel.nom || 'Hôtel sans nom';
  const city = hotel.ville || 'Ville inconnue';
  const address = hotel.adresse || '';
  const stars = hotel.etoiles || 0;
  const photos = hotel.photos || [];
  const mainPhoto = photos[0] || 'https://via.placeholder.com/400x300?text=Hôtel';
  const rating = hotel.rating || 4.5;
  const totalReviews = hotel.totalReviews || 128;

  return (
    <Link 
      to={`/hotels/${hotel._id}`} 
      className="block group"
      onClick={() => window.scrollTo(0, 0)}
    >
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        {/* Image principale */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={mainPhoto} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-[#49B9FF] text-black text-xs font-bold px-3 py-1 rounded-full">
              Populaire
            </span>
          </div>
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
            {photos.length} photos
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#49B9FF] transition">
              {name}
            </h3>
            <div className="flex items-center gap-1 bg-[#f4B34C] text-black px-2 py-1 rounded-md text-sm font-bold">
              <Star size={14} className="fill-current" />
              {rating}
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin size={16} />
            <span className="text-sm">
              {city} • {address.substring(0, 40)}{address.length > 40 ? '...' : ''}
            </span>
          </div>

          {/* Étoiles */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={i < stars ? 'text-[#f4B34C] fill-current' : 'text-gray-300'}
              />
            ))}
            <span className="text-xs text-gray-500 ml-2">({totalReviews} avis)</span>
          </div>

          {/* Équipements rapides */}
          <div className="flex gap-4 text-gray-600 text-xs">
            {hotel.equipements?.includes('Wi-Fi') && <Wifi size={18} />}
            {hotel.equipements?.includes('Parking') && <Car size={18} />}
            {hotel.services?.includes('Petit-déjeuner') && <Coffee size={18} />}
            {hotel.equipements?.length > 3 && (
              <span className="text-gray-500">+{hotel.equipements.length - 3} autres</span>
            )}
          </div>

          {/* Prix de départ (optionnel plus tard) */}
          {/* <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-gray-900">Ar 250 000</span>
              <span className="text-sm text-gray-500">/nuit</span>
            </div>
            <button className="bg-[#49B9FF] hover:bg-[#3aa8ee] text-black font-bold px-6 py-2 rounded-full text-sm transition">
              Voir l'hôtel
            </button>
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;