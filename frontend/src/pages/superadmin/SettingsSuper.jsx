import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import {
  Settings,
  User,
  Building2,
  Bell,
  Shield,
  Save,
  Mail,
  Lock,
  Check,
} from 'lucide-react';

const STORAGE_APP_SETTINGS = 'getHotel_superadmin_app_settings';
const STORAGE_PREFS = 'getHotel_superadmin_prefs';

const defaultAppSettings = {
  appName: 'GetHotel',
  contactEmail: 'contact@getHotel.com',
  supportEmail: 'support@getHotel.com',
};

const defaultPrefs = {
  emailNewHotels: true,
  emailNewUsers: false,
  sessionTimeoutHours: 24,
};

export default function SettingsSuper() {
  const { user } = useAuth();
  const [appSettings, setAppSettings] = useState(defaultAppSettings);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedApp = localStorage.getItem(STORAGE_APP_SETTINGS);
      const storedPrefs = localStorage.getItem(STORAGE_PREFS);
      if (storedApp) setAppSettings({ ...defaultAppSettings, ...JSON.parse(storedApp) });
      if (storedPrefs) setPrefs({ ...defaultPrefs, ...JSON.parse(storedPrefs) });
    } catch (_) {}
  }, []);

  const handleSaveAppSettings = () => {
    localStorage.setItem(STORAGE_APP_SETTINGS, JSON.stringify(appSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSavePrefs = () => {
    localStorage.setItem(STORAGE_PREFS, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (passwordForm.new.length < 6) {
      alert('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    // TODO: appeler l'API backend pour changer le mot de passe (ex: PATCH /superadmin/profile/password)
    setTimeout(() => {
      setLoading(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
      alert('Fonctionnalité à connecter à l\'API (changement mot de passe).');
    }, 500);
  };

  const displayName = user?.name || user?.prenom ? [user.prenom, user.nom].filter(Boolean).join(' ') : user?.email || 'Super Admin';

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#7238D4] flex items-center justify-center">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-500 text-sm">Gérez votre profil et les options de la plateforme</p>
          </div>
        </div>

        {/* Profil */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <User className="w-5 h-5 text-[#7238D4]" />
            <h2 className="font-semibold text-gray-900">Profil Super Admin</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nom affiché</label>
              <p className="text-gray-900 font-medium">{displayName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {user?.email || '—'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Rôle</label>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                Super Admin
              </span>
            </div>
          </div>
        </section>

        {/* Changement mot de passe */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#7238D4]" />
            <h2 className="font-semibold text-gray-900">Changer le mot de passe</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7238D4] focus:border-[#7238D4] outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7238D4] focus:border-[#7238D4] outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7238D4] focus:border-[#7238D4] outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7238D4] text-white font-medium hover:bg-[#5c2db8] transition disabled:opacity-60"
            >
              {loading ? 'En cours…' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </section>

        {/* Paramètres de la plateforme */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#7238D4]" />
            <h2 className="font-semibold text-gray-900">Paramètres de la plateforme</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nom de l'application</label>
              <input
                type="text"
                value={appSettings.appName}
                onChange={(e) => setAppSettings((s) => ({ ...s, appName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7238D4] focus:border-[#7238D4] outline-none"
                placeholder="GetHotel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email de contact</label>
              <input
                type="email"
                value={appSettings.contactEmail}
                onChange={(e) => setAppSettings((s) => ({ ...s, contactEmail: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7238D4] focus:border-[#7238D4] outline-none"
                placeholder="contact@getHotel.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email support</label>
              <input
                type="email"
                value={appSettings.supportEmail}
                onChange={(e) => setAppSettings((s) => ({ ...s, supportEmail: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7238D4] focus:border-[#7238D4] outline-none"
                placeholder="support@getHotel.com"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveAppSettings}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7238D4] text-white font-medium hover:bg-[#5c2db8] transition"
            >
              <Save className="w-4 h-4" />
              Enregistrer les paramètres plateforme
            </button>
          </div>
        </section>

        {/* Notifications / Préférences */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#7238D4]" />
            <h2 className="font-semibold text-gray-900">Notifications & Préférences</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Email lors d'un nouvel hôtel inscrit</span>
              <input
                type="checkbox"
                checked={prefs.emailNewHotels}
                onChange={(e) => setPrefs((p) => ({ ...p, emailNewHotels: e.target.checked }))}
                className="w-5 h-5 rounded text-[#7238D4] focus:ring-[#7238D4]"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Email lors d'un nouvel utilisateur (admin)</span>
              <input
                type="checkbox"
                checked={prefs.emailNewUsers}
                onChange={(e) => setPrefs((p) => ({ ...p, emailNewUsers: e.target.checked }))}
                className="w-5 h-5 rounded text-[#7238D4] focus:ring-[#7238D4]"
              />
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Durée de session (heures)</label>
              <select
                value={prefs.sessionTimeoutHours}
                onChange={(e) => setPrefs((p) => ({ ...p, sessionTimeoutHours: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7238D4] focus:border-[#7238D4] outline-none"
              >
                <option value={1}>1 heure</option>
                <option value={8}>8 heures</option>
                <option value={24}>24 heures</option>
                <option value={168}>7 jours</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleSavePrefs}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7238D4] text-white font-medium hover:bg-[#5c2db8] transition"
            >
              <Save className="w-4 h-4" />
              Enregistrer les préférences
            </button>
          </div>
        </section>

        {/* Sécurité / Info */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#7238D4]" />
            <h2 className="font-semibold text-gray-900">Sécurité</h2>
          </div>
          <div className="p-6 text-gray-600 text-sm space-y-2">
            <p>• Accès réservé au rôle Super Admin. Déconnectez-vous si vous partagez votre poste.</p>
            <p>• Les paramètres de la plateforme et préférences sont enregistrés localement (navigateur).</p>
            <p>• Pour un déploiement en production, branchez ces options sur votre backend (API + base de données).</p>
          </div>
        </section>

        {saved && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white shadow-lg animate-fade-in">
            <Check className="w-5 h-5" />
            <span>Enregistré</span>
          </div>
        )}
      </div>
    </div>
  );
}
