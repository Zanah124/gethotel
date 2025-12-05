import React, { useState, useEffect } from 'react';
import { Building2, Star, Save, Loader2, Upload, Camera } from 'lucide-react';
import api from '../../services/api';

const EditHotelProfile = () => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nom: '', adresse: '', ville: '', pays: 'Madagascar', codePostal: '',
    telephone: '', email: '', description: '', etoiles: 5,
    equipements: [], services: [], politiqueAnnulation: '',
    photo_principale: null
  });

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      const res = await api.get('/admin/hotel');
      const data = res.data.data;
      setHotel(data);
      setFormData({
        nom: data.nom || '',
        adresse: data.adresse || '',
        ville: data.ville || '',
        pays: data.pays || 'Madagascar',
        codePostal: data.code_postal || '',
        telephone: data.telephone || '',
        email: data.email || '',
        description: data.description || '',
        etoiles: data.nombre_etoiles || 5,
        equipements: data.equipements || [],
        services: data.services || [],
        politiqueAnnulation: data.politique_annulation || '',
        photo_principale: data.photo_principale || null
      });
    } catch (error) {                 // ← CORRIGÉ
      console.error('Erreur chargement hôtel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData({ ...formData, [field]: array });
  };

  // UPLOAD LOGO
  const handleMainPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('logo', file);   // ← ton multer attend "logo"

    setUploading(true);
    try {
      const res = await api.post('/admin/hotel/logo', formDataUpload);
      const newUrl = res.data.photo || res.data.url || res.data.photo_principale;

      setFormData(prev => ({ ...prev, photo_principale: newUrl }));
      setSuccess('Logo mis à jour avec succès !');
      setTimeout(() => setSuccess(''), 4000);
    } catch (error) {                 // ← CORRIGÉ
      console.error('Erreur upload:', error);
      alert('Impossible d\'uploader l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/hotel', {
        ...formData,
        codePostal: formData.codePostal,
        etoiles: parseInt(formData.etoiles, 10)
      });
      setSuccess('Modifications enregistrées avec succès !');
      setTimeout(() => setSuccess(''), 4000);
    } catch (error) {                 // ← CORRIGÉ
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const baseUrl = 'http://localhost:3000';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header gradient */}
          <div className="bg-gradient-to-r from-[#49B9FF] to-[#7238D4] p-10 text-white">
            <h1 className="text-4xl font-bold flex items-center gap-4">
              <Building2 size={48} />
              Modifier l'hôtel — {hotel?.nom}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-10">

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
                {success}
              </div>
            )}

            {/* PHOTO PRINCIPALE */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Camera /> Photo principale (Logo)
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                {formData.photo_principale ? (
                  <div className="space-y-6">
                    <img
                      src={`${baseUrl}${formData.photo_principale}`}
                      alt="Logo"
                      className="w-80 h-80 object-cover rounded-xl mx-auto shadow-lg"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 bg-[#49B9FF] text-white py-3 px-8 rounded-full hover:bg-blue-600">
                      <Upload size={20} /> Changer le logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainPhotoUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload size={64} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Cliquez pour ajouter un logo</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainPhotoUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
                {uploading && <p className="text-blue-600 mt-4">Upload en cours…</p>}
              </div>
            </div>

            {/* TOUS LES AUTRES CHAMPS (inchangés) */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'hôtel</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                    <input type="text" name="ville" value={formData.ville} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <input type="text" name="codePostal" value={formData.codePostal} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Star className="text-yellow-500" /> Nombre d'étoiles
                  </label>
                  <select name="etoiles" value={formData.etoiles} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]">
                    {[1,2,3,4,5].map(n => (
                      <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Équipements (séparés par virgules)</label>
                  <textarea value={formData.equipements.join(', ')} onChange={(e) => handleArrayChange('equipements', e.target.value)} rows={4} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services (séparés par virgules)</label>
                  <textarea value={formData.services.join(', ')} onChange={(e) => handleArrayChange('services', e.target.value)} rows={4} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Politique d'annulation</label>
                  <textarea name="politiqueAnnulation" value={formData.politiqueAnnulation} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#49B9FF]" />
                </div>
              </div>
            </div>

            {/* BOUTON SAUVEGARDE */}
            <div className="flex justify-end pt-8">
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-[#49B9FF] to-[#49B9FF] text-white font-bold py-4 px-10 rounded-full flex items-center gap-3 hover:shadow-2xl transition disabled:opacity-70"
              >
                {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditHotelProfile;