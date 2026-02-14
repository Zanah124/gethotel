import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Save, Loader2, Users } from 'lucide-react';
import { getPlanning, savePlanning, getWeekStart } from '../../services/admin/planningService';

const JOURS = [
  { key: '1', label: 'Lundi' },
  { key: '2', label: 'Mardi' },
  { key: '3', label: 'Mercredi' },
  { key: '4', label: 'Jeudi' },
  { key: '5', label: 'Vendredi' },
  { key: '6', label: 'Samedi' },
  { key: '7', label: 'Dimanche' }
];

function formatWeekLabel(weekStart) {
  const start = new Date(weekStart + 'T12:00:00');
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return `${fmt(start)} – ${fmt(end)}`;
}

const Planning = () => {
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchPlanning = useCallback(async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await getPlanning(weekStart);
      if (res.success && res.data?.employees) {
        setEmployees(res.data.employees);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error('Erreur chargement planning:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Impossible de charger le planning.' });
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    fetchPlanning();
  }, [fetchPlanning]);

  const goPrevWeek = () => {
    const d = new Date(weekStart + 'T12:00:00');
    d.setDate(d.getDate() - 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };

  const goNextWeek = () => {
    const d = new Date(weekStart + 'T12:00:00');
    d.setDate(d.getDate() + 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };

  const goToCurrentWeek = () => {
    setWeekStart(getWeekStart());
  };

  const updateSlot = (employeeIndex, dayKey, value) => {
    setEmployees((prev) => {
      const next = [...prev];
      const emp = { ...next[employeeIndex], slots: { ...next[employeeIndex].slots, [dayKey]: value } };
      next[employeeIndex] = emp;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const plannings = employees.map((emp) => ({
        employee_id: emp.id,
        slots: emp.slots
      }));
      await savePlanning(weekStart, plannings);
      setMessage({ type: 'success', text: 'Planning enregistré.' });
    } catch (err) {
      console.error('Erreur enregistrement planning:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de l\'enregistrement.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-[#49B9FF]" />
              Planning des employés
            </h1>
            <p className="text-gray-600 mt-1">Gérez les plannings hebdomadaires. Modifiez puis enregistrez.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={goPrevWeek}
                className="p-3 text-gray-600 hover:bg-gray-100 transition"
                aria-label="Semaine précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="px-4 py-2 min-w-[200px] text-center">
                <span className="font-semibold text-gray-800">{formatWeekLabel(weekStart)}</span>
              </div>
              <button
                type="button"
                onClick={goNextWeek}
                className="p-3 text-gray-600 hover:bg-gray-100 transition"
                aria-label="Semaine suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={goToCurrentWeek}
              className="px-4 py-2 text-sm font-medium text-[#49B9FF] bg-[#49B9FF]/10 rounded-lg hover:bg-[#49B9FF]/20 transition"
            >
              Cette semaine
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#49B9FF] text-white font-semibold rounded-xl hover:bg-[#3aa3e6] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Enregistrer
            </button>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl ${
              message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-[#49B9FF] animate-spin" />
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Aucun employé actif pour cette semaine.</p>
            <p className="text-gray-500 mt-2">Ajoutez des employés dans la section Employés.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10 min-w-[180px]">
                      Employé / Poste
                    </th>
                    {JOURS.map((j) => (
                      <th key={j.key} className="text-center py-4 px-2 font-semibold text-gray-700 min-w-[120px]">
                        {j.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, idx) => (
                    <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4 sticky left-0 bg-white hover:bg-gray-50/50 z-10">
                        <div>
                          <span className="font-medium text-gray-900">
                            {emp.prenom} {emp.nom}
                          </span>
                          <div className="text-xs text-gray-500">{emp.poste} • {emp.departement}</div>
                        </div>
                      </td>
                      {JOURS.map((j) => (
                        <td key={j.key} className="py-2 px-2">
                          <input
                            type="text"
                            value={emp.slots[j.key] === 'repos' ? '' : (emp.slots[j.key] || '')}
                            onChange={(e) => {
                              const v = e.target.value.trim();
                              updateSlot(idx, j.key, v === '' ? 'repos' : v);
                            }}
                            placeholder="08:00-16:00 ou Repos"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#49B9FF] focus:border-[#49B9FF] outline-none"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planning;
