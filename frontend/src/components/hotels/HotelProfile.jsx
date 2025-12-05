import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Star, Wifi, Car, Coffee, Shield, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const HotelProfile = () => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);   

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await api.get('/admin/hotel'); // ou '/api/admin/hotel' selon ta config
        setHotel(res.data.data);
      } catch (err) {
        console.error("Erreur chargement hôtel:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!hotel) {
    return <div className="text-center py-20 text-red-600 text-2xl">Impossible de charger l'hôtel</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Bannière */}
        <div className="bg-gradient-to-r from-blue-600 to-white-700 h-64 rounded-2xl overflow-hidden relative shadow-2xl">
          {hotel.photos?.[0] ? (
            <img src={`http://localhost:3000${hotel.photos[0]}`} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-black opacity-40"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>

        <div className="relative -mt-20 px-8">
          {/* Logo / Photo principale */}
          <div className="inline-block bg-white p-4 rounded-2xl shadow-2xl">
            <div className="w-40 h-40 bg-Rust-200 rounded-full overflow-hidden border-8 border-white">
              {hotel.photos?.[1] ? (
                <img src={`http://localhost:3000${hotel.photos[1]}`} alt={hotel.nom} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-teal-600">
                  <Building2 size={70} className="text-white" />
                </div>
              )}
            </div>
          </div>
          <Link to="/admin/hotel/edit" className="bg-[#49B9FF] text-black font-bold py-3 px-6 rounded-full">
                Modifier les informations
          </Link>
          {/* Infos principales */}
          <div className="mt-8 text-black">
            <h1 className="text-5xl font-bold drop-shadow-lg">
              {hotel.nom}
              <span className="ml-4">
                {[...Array(hotel.nombre_etoiles)].map((_, i) => (
                  <Star key={i} size={36} className="inline fill-yellow-400 text-yellow-400 drop-shadow" />
                ))}
              </span>
            </h1>

            <div className="flex items-center gap-8 mt-4 text-lg">
              <div className="flex items-center gap-3">
                <MapPin size={28} />
                <span>{hotel.adresse}, {hotel.ville}, {hotel.pays}</span>
              </div>
              {hotel.telephone && (
                <div className="flex items-center gap-3">
                  <Phone size={28} />
                  <span>{hotel.telephone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mt-12">
          {/* Colonne gauche - Infos & Abonnement */}
          <div className="space-y-8">
            {/* Description */}
            {hotel.description && (
              <div className="bg-white rounded-100 p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">À propos</h2>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </div>
            )}

            {/* Abonnement actif */}
            {hotel.subscription && (
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 rounded-2xl shadow-2xl">
                <h3 className="text-xl font-bold mb-3">Abonnement actif</h3>
                <p className="text-4xl font-black">{hotel.subscription.plan.name}</p>
                <p className="mt-3 opacity-90">
                  Valable jusqu'au{' '}
                  {new Date(hotel.subscription.current_period_end).toLocaleDateString('fr-FR')}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {hotel.subscription.plan.features.map((f, i) => (
                    <span key={i} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite - Équipements & Services */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Équipements */}
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Shield className="text-blue-600" size={32} />
                  Équipements
                </h3>
                <div className="space-y-3">
                  {hotel.equipements?.map((eq, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="text-green-600" size={22} />
                      <span className="text-gray-700">{eq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Coffee className="text-amber-600" size={32} />
                  Services
                </h3>
                <div className="space-y-3">
                  {hotel.services?.map((srv, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="text-green-600" size={22} />
                      <span className="text-gray-700">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelProfile;