// src/pages/admin/HotelSettings.jsx  (ou HotelProfile.jsx)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Phone, Mail, Star, Edit3, Globe, Shield, 
  Wifi, Car, Coffee, Dumbbell, Upload, X, Camera, CheckCircle 
} from 'lucide-react';
 import api from '../../services/api';
import {useAuth} from '../../context/AuthContext';

const HotelProfile = () => {
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMyHotel();
  }, []);

  const fetchMyHotel = async () => {
    try {
      const res = await api.get('/api/admin/hotel');
      setHotel(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file); // ou 'photo' selon ta route

    setUploading(true);
    try {
      await api.post('/api/admin/hotel/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchMyHotel(); // rafraîchir
    } catch (err) {
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoUrl) => {
    if (!window.confirm('Supprimer cette photo ?')) return;

    try {
      await api.delete('/api/admin/hotel/photos', { data: { photoUrl } });
      fetchMyHotel();
    } catch (err) {
      alert('Erreur suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#49B9FF]"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">Aucun hôtel trouvé. Commencez par créer votre hôtel.</p>
        <Link to="/admin/hotel/create" className="mt-4 inline-block px-6 py-3 bg-[#49B9FF] text-black rounded-full font-bold">
          Créer mon hôtel
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#49B9FF] to-[#7238D4] h-40 relative">
            {/* Photo de couverture (optionnel) */}
            {hotel.photos?.[0] && (
              <img 
                src={hotel.photos[0]} 
                alt="Couverture" 
                className="w-full h-full object-cover opacity-50"
              />
            )}
          </div>

          <div className="relative px-8 pb-8 -mt-20">
            <div className="bg-white rounded-2xl shadow-xl p FR-6 inline-block">
              <div className="w-32 h-32 bg-gray-200 border-4 border-white rounded-full overflow-hidden">
                {hotel.photos?.[1] ? (
                  <img src={hotel.photos[1]} alt={hotel.nom} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <Building2 size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  {hotel.nom}
                  <span className="flex">
                    {[...Array(hotel.etoiles || 0)].map((_, i) => (
                      <Star key={i} size={20} className="text-[#f4B34C] fill-current" />
                    ))}
                  </span>
                </h1>
                <div className="flex items-center gap-6 mt-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{hotel.adresse}, {hotel.ville}, {hotel.pays}</span>
                  </div>
                  {hotel.telephone && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} />
                      <span>{hotel.telephone}</span>
                    </div>
                  )}
                </div>
              </div>

              <Link 
                to="/admin/hotel/edit"
                className="flex items-center gap-2 bg-[#49B9FF] hover:bg-[#3aa8ee] text-black font-bold px-6 py-3 rounded-full transition"
              >
                <Edit3 size={18} />
                Modifier l'hôtel
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            {hotel.description && (
              <div className="bg-white rounded-2xl shadow p-8">
                <h2 className="text-2xl font-bold mb-4">À propos de nous</h2>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </div>
            )}

            {/* Galerie photos */}
            <div className="bg-white rounded-2xl shadow p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Galerie photos</h2>
                <label className="flex items-center gap-2 cursor-pointer bg-[#f4B34C] hover:bg-[#e0a33b] text-black font-medium px-5 py-3 rounded-full transition">
                  <Upload size={18} />
                  Ajouter une photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.photos && hotel.photos.length > 0 ? (
                  hotel.photos.map((photo, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden shadow-md">
                      <img src={photo} alt={`Photo ${i+1}`} className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button 
                          onClick={() => removePhoto(photo)}
                          className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition"
                        >
                          <X size={20} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-12">
                    Aucune photo pour le moment
                  </p>
                )}
              </div>
            </div>

            {/* Équipements & Services */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Shield className="text-[#49B9FF]" />
                  Équipements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {hotel.equipements?.map((eq, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-green-500" />
                      <span>{eq}</span>
                    </div>
                  )) || <p className="text-gray-500">Non renseigné</p>}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Coffee className="text-[#f4B34C]" />
                  Services
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {hotel.services?.map((srv, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={18} className="text-green-500" />
                      <span>{srv}</span>
                    </div>
                  )) || <p className="text-gray-500">Non renseigné</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Infos rapides */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-bold text-lg mb-4">Informations légales</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{hotel.email || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Site web</span>
                  <a href={hotel.siteWeb} className="text-[#49B9FF] flex items-center gap-1">
                    <Globe size={14} />
                    Voir le site
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Code postal</span>
                  <span>{hotel.codePostal}</span>
                </div>
              </div>
            </div>

            {hotel.subscription && (
              <div className="bg-gradient-to-br from-[#49B9FF] to-[#7238D4] text-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-3">Abonnement actif</h3>
                <p className="text-2xl font-bold">{hotel.subscription.plan.nom}</p>
                <p className="text-sm opacity-90 mt-2">
                  Valable jusqu'au {new Date(hotel.subscription.dateFin).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelProfile;