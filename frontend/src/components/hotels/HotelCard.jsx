import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../../assets/assets.js';  

const HotelCard = ({ hotel, index }) => {
  return (
    <div>
      <Link 
        to={`/hotels/${hotel._id}`}  
        onClick={() => window.scrollTo(0, 0)} 
        key={hotel._id}
      >
        <img 
          src={hotel.images[0] || 'https://via.placeholder.com/300x200?text=Image+Chambre'}  // Fallback pour image
          alt={hotel.numero_chambre}
          className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'
        />
        {index % 2 === 0 && (
          <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white'>Bon vendeur</p>
        )}
        <div className='p-4 pt-5'>
          <div className='flex items-center justify-between'>
            <p className='font-pt-serif text-xl font-medium text-gray-800'>
              {hotel.hote?.name || 'Hôtel Inconnu'}  // Safe access
            </p>
            <div className='flex items-center gap-1'>
              <img src={assets.star} alt="star-icon" />
              4.5
            </div>
          </div>
          <div className='flex items-center gap-1 text-sm'>
            <img src={assets.location} alt="location" />
            <span>{hotel.hotel?.address || 'Adresse inconnue'}</span>
          </div>
          <div className='flex items-center justify-between mt-4'>
            <p>
              <span className='text-xl text-gray-800'>Ar{hotel.prix_base?.toLocaleString()}</span>/nuit
            </p>
            <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'>
              Book Now
            </button>
          </div>
          {/* Ajout : Afficher statut et numéro pour plus de détails */}
          <div className='mt-2 text-xs text-gray-500'>
            Chambre {hotel.numero_chambre} - Étage {hotel.etage} - Statut: {hotel.statut}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HotelCard;