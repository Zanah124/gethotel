// src/pages/employee/EmployeeCreateReservation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import employeeReservationService from '../../services/employee/reservationService';
import employeeChambreService from '../../services/employee/chambreService';
import employeeClientService from '../../services/employee/clientService';

import { ArrowLeft, ArrowRight, Save, AlertCircle } from 'lucide-react';

export default function EmployeeCreateReservation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Données du formulaire
  const [formData, setFormData] = useState({
    // Étape 1 – Client
    client_id: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',

    // Étape 2 – Séjour
    date_arrivee: '',
    date_depart: '',
    nombre_adultes: 1,
    nombre_enfants: 0,

    // Étape 3 – Chambre & notes
    chambre_id: '',
    notes: '',
  });

  // Liste des chambres disponibles et clients existants
  const [chambresDisponibles, setChambresDisponibles] = useState([]);
  const [clientsExistants, setClientsExistants] = useState([]);

  // ─── Chargement initial ─────────────────────────────────────
  useEffect(() => {
    if (!user || user.role !== 'employee') {
      navigate('/login');
    }
    loadClients();
  }, [user, navigate]);

  // Charger les chambres disponibles quand dates sont saisies
  useEffect(() => {
    if (formData.date_arrivee && formData.date_depart && step >= 3) {
      loadAvailableChambres();
    }
  }, [formData.date_arrivee, formData.date_depart, step]);

  const loadClients = async () => {
    try {
      const res = await employeeClientService.getClients({ limit: 100 });
      setClientsExistants(res.data || []);
    } catch (err) {
      console.error('Erreur loadClients:', err);
    }
  };

  const loadAvailableChambres = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        date_debut: formData.date_arrivee,
        date_fin: formData.date_depart,
      };
      const res = await employeeChambreService.getAvailableChambres(params);
      console.log('Chambres disponibles:', res.data);
      setChambresDisponibles(res.data || []);
    } catch (err) {
      setError('Impossible de charger les chambres disponibles');
      console.error('Erreur getAvailableChambres:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    // Validation avant de passer à l'étape suivante
    if (step === 1) {
      if (!formData.client_id && (!formData.nom || !formData.prenom || !formData.email)) {
        setError('Veuillez sélectionner un client ou remplir tous les champs obligatoires');
        return;
      }
    }
    if (step === 2) {
      if (!formData.date_arrivee || !formData.date_depart) {
        setError('Les dates sont obligatoires');
        return;
      }
      const dateArrivee = new Date(formData.date_arrivee);
      const dateDepart = new Date(formData.date_depart);
      if (dateDepart <= dateArrivee) {
        setError('La date de départ doit être après la date d\'arrivée');
        return;
      }
    }
    setError('');
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Préparation payload
      const payload = {
        client_id: formData.client_id || undefined,
        // Si nouveau client → envoyer les infos
        client: !formData.client_id ? {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
        } : undefined,
        date_arrivee: formData.date_arrivee,
        date_depart: formData.date_depart,
        chambre_id: formData.chambre_id,
        nombre_adultes: Number(formData.nombre_adultes),
        nombre_enfants: Number(formData.nombre_enfants),
        notes: formData.notes,
      };

      console.log('📤 Payload envoyé:', payload);
      
      const response = await employeeReservationService.createReservation(payload);
      console.log('✅ Réponse serveur:', response);
      
      setSuccess(true);
      setTimeout(() => navigate('/employee/reservations'), 2000);
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      console.error('❌ Réponse erreur:', err.response?.data);
      
      // Afficher un message d'erreur plus détaillé
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error
        || err.message 
        || 'Erreur lors de la création';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calcul du prix total pour l'affichage
  const calculatePriceInfo = () => {
    if (!formData.chambre_id || !formData.date_arrivee || !formData.date_depart) {
      return { nombreNuits: 0, prixParNuit: 0, prixTotal: 0 };
    }

    const chambre = chambresDisponibles.find(c => c.id === Number(formData.chambre_id));
    const prixParNuit = chambre?.typeChambre?.prix_par_nuit || 0;
    const dateArrivee = new Date(formData.date_arrivee);
    const dateDepart = new Date(formData.date_depart);
    const nombreNuits = Math.ceil((dateDepart - dateArrivee) / (1000 * 60 * 60 * 24));
    const prixTotal = nombreNuits * prixParNuit;

    return { nombreNuits, prixParNuit, prixTotal };
  };

  const StepIndicator = () => (
    <div className="flex justify-between mb-8">
      {['Client', 'Dates', 'Chambre', 'Confirmation'].map((label, i) => (
        <div
          key={i}
          className={`flex-1 text-center py-2 border-t-4 ${
            step > i + 1 ? 'border-green-500' :
            step === i + 1 ? 'border-[#081F5C]' : 'border-gray-300'
          }`}
        >
          <span className={step === i + 1 ? 'font-bold text-[#081F5C]' : 'text-gray-600'}>
            {i + 1}. {label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Nouvelle réservation
          </h1>
          <div className="w-24"></div> {/* Spacer pour centrer le titre */}
        </div>

        <StepIndicator />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Réservation créée avec succès !
            </h2>
            <p className="text-gray-600">Redirection vers la liste...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* ─── Étape 1 : Client ──────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">1. Informations Client</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client existant
                  </label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={(e) => {
                      handleChange(e);
                      // Si on sélectionne un client existant, vider les champs nouveau client
                      if (e.target.value) {
                        setFormData(prev => ({
                          ...prev,
                          client_id: e.target.value,
                          nom: '',
                          prenom: '',
                          email: '',
                          telephone: '',
                        }));
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent"
                  >
                    <option value="">-- Sélectionner un client existant --</option>
                    {clientsExistants.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nom} {c.prenom} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Ou créer un nouveau client :
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        disabled={!!formData.client_id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent disabled:bg-gray-100"
                        placeholder="Nom du client"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        disabled={!!formData.client_id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent disabled:bg-gray-100"
                        placeholder="Prénom du client"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!!formData.client_id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent disabled:bg-gray-100"
                        placeholder="email@exemple.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        disabled={!!formData.client_id}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent disabled:bg-gray-100"
                        placeholder="+261 34 00 000 00"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-[#081F5C] text-white rounded-lg hover:bg-[#06173d] transition flex items-center"
                  >
                    Suivant <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── Étape 2 : Dates et occupants ─────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">2. Dates et occupants</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'arrivée *
                    </label>
                    <input
                      type="date"
                      name="date_arrivee"
                      value={formData.date_arrivee}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de départ *
                    </label>
                    <input
                      type="date"
                      name="date_depart"
                      value={formData.date_depart}
                      onChange={handleChange}
                      required
                      min={formData.date_arrivee || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre d'adultes *
                    </label>
                    <input
                      type="number"
                      name="nombre_adultes"
                      value={formData.nombre_adultes}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre d'enfants
                    </label>
                    <input
                      type="number"
                      name="nombre_enfants"
                      value={formData.nombre_enfants}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Précédent
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-[#081F5C] text-white rounded-lg hover:bg-[#06173d] transition flex items-center"
                  >
                    Suivant <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── Étape 3 : Chambre ─────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">3. Choix de la chambre</h2>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#081F5C] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Recherche des chambres disponibles...</p>
                  </div>
                ) : chambresDisponibles.length === 0 ? (
                  <div className="text-center py-12 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                    <p className="text-amber-800 font-medium">
                      Aucune chambre disponible pour ces dates.
                    </p>
                    <p className="text-amber-600 text-sm mt-2">
                      Veuillez modifier les dates ou contacter l'administration.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chambresDisponibles.map(ch => (
                      <label
                        key={ch.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          formData.chambre_id === String(ch.id)
                            ? 'border-[#081F5C] bg-blue-50 ring-2 ring-[#081F5C] shadow-lg'
                            : 'border-gray-200 hover:border-[#081F5C] hover:shadow-md'
                        }`}
                      >
                        <input
                          type="radio"
                          name="chambre_id"
                          value={ch.id}
                          checked={formData.chambre_id === String(ch.id)}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="font-bold text-lg text-gray-900">
                          Chambre {ch.numero_chambre}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          {ch.typeChambre?.nom || 'Type non spécifié'}
                          {ch.etage && ` • Étage ${ch.etage}`}
                        </div>
                        {ch.typeChambre?.capacite && (
                          <div className="text-sm text-gray-500 mt-1">
                            Capacité : {ch.typeChambre.capacite} pers.
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="font-bold text-[#861D1D] text-xl">
                            {ch.typeChambre?.prix_par_nuit ? 
                              `${ch.typeChambre.prix_par_nuit.toLocaleString()} Ar` : 
                              'Prix non défini'}
                          </div>
                          <div className="text-xs text-gray-500">par nuit</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes / demandes spéciales
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#081F5C] focus:border-transparent"
                    placeholder="Ex: lit bébé, chambre non-fumeur, étage élevé, allergies alimentaires..."
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Précédent
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.chambre_id}
                    className="px-6 py-2 bg-[#081F5C] text-white rounded-lg hover:bg-[#06173d] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center"
                  >
                    Vérifier & Confirmer <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── Étape 4 : Récapitulatif ──────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">4. Récapitulatif</h2>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {/* Client */}
                  <div className="pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2">Client</h3>
                    <p className="text-gray-900">
                      {formData.client_id
                        ? (() => {
                            const client = clientsExistants.find(c => c.id === formData.client_id);
                            return client ? `${client.nom} ${client.prenom}` : 'Client inconnu';
                          })()
                        : `${formData.nom} ${formData.prenom}`}
                    </p>
                    {!formData.client_id && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.email} {formData.telephone && `• ${formData.telephone}`}
                      </p>
                    )}
                  </div>

                  {/* Séjour */}
                  <div className="pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2">Séjour</h3>
                    <p className="text-gray-900">
                      Du {new Date(formData.date_arrivee).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-gray-900">
                      Au {new Date(formData.date_depart).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.nombre_adultes} adulte{formData.nombre_adultes > 1 ? 's' : ''}
                      {formData.nombre_enfants > 0 && ` • ${formData.nombre_enfants} enfant${formData.nombre_enfants > 1 ? 's' : ''}`}
                    </p>
                  </div>

                  {/* Chambre */}
                  <div className="pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2">Chambre</h3>
                    {(() => {
                      const chambre = chambresDisponibles.find(c => c.id === Number(formData.chambre_id));
                      return chambre ? (
                        <>
                          <p className="text-gray-900 font-medium">
                            Chambre {chambre.numero_chambre}
                          </p>
                          <p className="text-sm text-gray-600">
                            {chambre.typeChambre?.nom}
                            {chambre.etage && ` • Étage ${chambre.etage}`}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">—</p>
                      );
                    })()}
                  </div>

                  {/* Prix */}
                  <div className="pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2">Tarif</h3>
                    {(() => {
                      const { nombreNuits, prixParNuit, prixTotal } = calculatePriceInfo();
                      return (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            {nombreNuits} nuit{nombreNuits > 1 ? 's' : ''} × {prixParNuit.toLocaleString()} Ar
                          </p>
                          <p className="text-2xl font-bold text-[#861D1D]">
                            {prixTotal.toLocaleString()} Ar
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Notes */}
                  {formData.notes && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Notes / Demandes spéciales</h3>
                      <p className="text-gray-900 whitespace-pre-wrap">{formData.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Modifier
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center font-medium shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Création en cours...
                      </>
                    ) : (
                      <>
                        Créer la réservation <Save className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}