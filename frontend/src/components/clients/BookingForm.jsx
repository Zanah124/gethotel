import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reservationService from '../../services/client/reservationService';
import hotelService from '../../services/client/hotelService';
import { useAuth } from '../../context/useAuth';

export default function BookingForm({ hotel, onClose, onSuccess }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    chambre_id: '',
    date_arrivee: '',
    date_depart: '',
    nombre_adultes: 1,
    nombre_enfants: 0,
    demandes_speciales: ''
  });

  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Charger les chambres disponibles quand les dates changent
  useEffect(() => {
    if (formData.date_arrivee && formData.date_depart) {
      fetchAvailableRooms();
    }
  }, [formData.date_arrivee, formData.date_depart, formData.nombre_adultes, formData.nombre_enfants]);

  // Calculer le prix total quand une chambre est sélectionnée
  useEffect(() => {
    if (selectedRoom && formData.date_arrivee && formData.date_depart) {
      calculateTotalPrice();
    } else {
      setTotalPrice(0);
    }
  }, [selectedRoom, formData.date_arrivee, formData.date_depart]);

  const fetchAvailableRooms = async () => {
    try {
      setLoadingRooms(true);
      setError('');

      const filters = {
        date_arrivee: formData.date_arrivee,
        date_depart: formData.date_depart,
        nombre_adultes: formData.nombre_adultes,
        nombre_enfants: formData.nombre_enfants
      };

      const rooms = await hotelService.getAvailableRooms(hotel.id, filters);
      setAvailableRooms(rooms);

      // Reset la sélection de chambre si elle n'est plus disponible
      if (formData.chambre_id && !rooms.find(room => room.id === parseInt(formData.chambre_id))) {
        setFormData(prev => ({ ...prev, chambre_id: '' }));
        setSelectedRoom(null);
      }
    } catch (err) {
      setError('Erreur lors du chargement des chambres disponibles');
      console.error('Erreur fetchAvailableRooms:', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedRoom || !formData.date_arrivee || !formData.date_depart) return;

    const startDate = new Date(formData.date_arrivee);
    const endDate = new Date(formData.date_depart);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (nights > 0) {
      setTotalPrice(nights * selectedRoom.type_chambre.prix_par_nuit);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setFormData(prev => ({
      ...prev,
      chambre_id: room.id.toString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!user) {
      setError('Vous devez être connecté pour réserver');
      setLoading(false);
      navigate('/login');
      return;
    }

    if (!formData.chambre_id) {
      setError('Veuillez sélectionner une chambre');
      setLoading(false);
      return;
    }

    if (!formData.date_arrivee || !formData.date_depart) {
      setError('Veuillez sélectionner les dates d\'arrivée et de départ');
      setLoading(false);
      return;
    }

    const startDate = new Date(formData.date_arrivee);
    const endDate = new Date(formData.date_depart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      setError('La date d\'arrivée ne peut pas être dans le passé');
      setLoading(false);
      return;
    }

    if (endDate <= startDate) {
      setError('La date de départ doit être après la date d\'arrivée');
      setLoading(false);
      return;
    }

    try {
      const reservationData = {
        ...formData,
        hotel_id: hotel.id,
        chambre_id: parseInt(formData.chambre_id)
      };

      const response = await reservationService.createReservation(reservationData);

      if (response.success) {
        alert('Réservation créée avec succès !');
        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      } else {
        setError(response.message || 'Erreur lors de la création de la réservation');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la création de la réservation';
      setError(message);
      console.error('Erreur réservation:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'disponible': return 'text-green-600 bg-green-100';
      case 'occupee': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'disponible': return 'Disponible';
      case 'occupee': return 'Occupée';
      case 'maintenance': return 'Maintenance';
      default: return statut;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Réserver à {hotel?.nom}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'arrivée *
                </label>
                <input
                  type="date"
                  name="date_arrivee"
                  value={formData.date_arrivee}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de départ *
                </label>
                <input
                  type="date"
                  name="date_depart"
                  value={formData.date_depart}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Nombre de personnes */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adultes *
                </label>
                <select
                  name="nombre_adultes"
                  value={formData.nombre_adultes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enfants
                </label>
                <select
                  name="nombre_enfants"
                  value={formData.nombre_enfants}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none transition"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Liste des chambres disponibles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Chambres disponibles
              </label>

              {loadingRooms ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des chambres...</p>
                </div>
              ) : availableRooms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {formData.date_arrivee && formData.date_depart
                    ? "Aucune chambre disponible pour ces dates et ce nombre de personnes"
                    : "Veuillez sélectionner des dates pour voir les chambres disponibles"
                  }
                </div>
              ) : (
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedRoom?.id === room.id
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleRoomSelect(room)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              Chambre {room.numero_chambre}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.statut)}`}>
                              {getStatusText(room.statut)}
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Type:</span> {room.type_chambre.nom}
                            </div>
                            <div>
                              <span className="font-medium">Étage:</span> {room.etage || 'RDC'}
                            </div>
                            <div>
                              <span className="font-medium">Capacité:</span> {room.type_chambre.capacite} personnes
                            </div>
                            <div>
                              <span className="font-medium">Prix/nuit:</span> {room.type_chambre.prix_par_nuit}€
                            </div>
                          </div>

                          {room.type_chambre.description && (
                            <p className="text-sm text-gray-500 mt-2">
                              {room.type_chambre.description}
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            {room.type_chambre.prix_par_nuit}€
                          </div>
                          <div className="text-sm text-gray-500">par nuit</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Demandes spéciales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demandes spéciales
              </label>
              <textarea
                name="demandes_speciales"
                value={formData.demandes_speciales}
                onChange={handleInputChange}
                placeholder="Lit bébé, vue sur mer, etc."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none transition resize-none"
              />
            </div>

            {/* Résumé et prix */}
            {selectedRoom && formData.date_arrivee && formData.date_depart && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Résumé de la réservation</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Hôtel:</span> {hotel?.nom}</p>
                  <p><span className="font-medium">Chambre:</span> {selectedRoom.numero_chambre} - {selectedRoom.type_chambre.nom}</p>
                  <p><span className="font-medium">Prix par nuit:</span> {selectedRoom.type_chambre.prix_par_nuit}€</p>
                  <p><span className="font-medium">Nombre de nuits:</span> {
                    formData.date_arrivee && formData.date_depart
                      ? Math.ceil((new Date(formData.date_depart) - new Date(formData.date_arrivee)) / (1000 * 60 * 60 * 24))
                      : 0
                  }</p>
                  <p className="font-semibold text-lg text-gray-800 pt-2 border-t">
                    Total: {totalPrice}€
                  </p>
                </div>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !selectedRoom}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition ${
                  loading || !selectedRoom
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 