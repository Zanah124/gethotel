import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
  // Données pour le graphique d'occupation
  const occupancyData = [
    { month: 'Jan', rate: 75 },
    { month: 'Fev', rate: 82 },
    { month: 'Mar', rate: 78 },
    { month: 'Avr', rate: 88 },
    { month: 'Mai', rate: 85 },
    { month: 'Juin', rate: 90 },
    { month: 'Juil', rate: 85 },
  ];

  // Données pour le graphique de revenu
  const revenueData = [
    { month: 'Jan', revenue: 120 },
    { month: 'Fev', revenue: 145 },
    { month: 'Mar', revenue: 160 },
    { month: 'Avr', revenue: 155 },
    { month: 'Mai', revenue: 170 },
    { month: 'Juin', revenue: 180 },
    { month: 'Juil', revenue: 195 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 px-150" style={{ color: '#131114' }}>
           Gestion Hôtel 
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b" style={{ borderColor: '#E6EED6' }}>
          <button className="pb-3 px-1 font-medium border-b-2" style={{ color: '#A62609', borderColor: '#A62609' }}>
            Overview
          </button>
          <button className="pb-3 px-1 font-medium" style={{ color: '#131114', opacity: 0.5 }}>
            Attendance
          </button>
          <button className="pb-3 px-1 font-medium" style={{ color: '#131114', opacity: 0.5 }}>
            Employée
          </button>
          <button className="pb-3 px-1 font-medium" style={{ color: '#131114', opacity: 0.5 }}>
            Stock
          </button>
          <button className="pb-3 px-1 font-medium" style={{ color: '#131114', opacity: 0.5 }}>
            Paramétre
          </button>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#131114' }}>Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>Current Guests</p>
              <p className="text-4xl font-bold" style={{ color: '#131114' }}>5</p>
            </div>
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>Jour Récent</p>
              <p className="text-4xl font-bold" style={{ color: '#131114' }}>140000 Ar</p>
            </div>
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>Cet mois récent</p>
              <p className="text-4xl font-bold" style={{ color: '#131114' }}>2000000 Ar</p>
            </div>
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>Montant du stock</p>
              <p className="text-4xl font-bold" style={{ color: '#131114' }}>150000 Ar</p>
            </div>
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.7 }}>Vente du mois</p>
              <p className="text-4xl font-bold" style={{ color: '#131114' }}>30000 Ar</p>
            </div>
          </div>
        </div>

        {/* Monthly Performance */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#131114' }}>Revenu du mois</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Occupancy Rate Chart */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#131114' }}>Chambre occupée</h3>
                  <p className="text-3xl font-bold" style={{ color: '#A62609' }}>85%</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#131114' }}>Chambre libre</h3>
                  <p className="text-3xl font-bold" style={{ color: '#A62609' }}>5%</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#131114' }}>Chambre réservé</h3>
                  <p className="text-3xl font-bold" style={{ color: '#A62609' }}>10%</p>
                </div>
                <button className="p-2">
                  <div className="w-1 h-1 rounded-full mb-1" style={{ backgroundColor: '#131114' }}></div>
                  <div className="w-1 h-1 rounded-full mb-1" style={{ backgroundColor: '#131114' }}></div>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#131114' }}></div>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={occupancyData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A62609" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A62609" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131114" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#131114" opacity={0.5} />
                  <YAxis stroke="#131114" opacity={0.5} />
                  <Tooltip />
                  <Area type="monotone" dataKey="rate" stroke="#A62609" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Per Available Room Chart */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#131114' }}>Revenue par chambre</h3>
                  <p className="text-3xl font-bold" style={{ color: '#A62609' }}>170000 Ar</p>
                </div>
                <button className="p-2">
                  <div className="w-1 h-1 rounded-full mb-1" style={{ backgroundColor: '#131114' }}></div>
                  <div className="w-1 h-1 rounded-full mb-1" style={{ backgroundColor: '#131114' }}></div>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#131114' }}></div>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#131114" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#131114" opacity={0.5} />
                  <YAxis stroke="#131114" opacity={0.5} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#A62609" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Staff Performance */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#131114' }}>Staff Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold" style={{ color: '#131114' }}>Performance Metrics</h3>
                <button className="p-2">
                  <div className="w-1 h-1 rounded-full mb-1" style={{ backgroundColor: '#131114' }}></div>
                  <div className="w-1 h-1 rounded-full mb-1" style={{ backgroundColor: '#131114' }}></div>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#131114' }}></div>
                </button>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-5xl font-bold" style={{ color: '#A62609' }}>12.4k</p>
                <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.5 }}>tasks last 90 days</p>
              </div>
            </div>

            <div className="p-6 rounded-xl" style={{ backgroundColor: '#E6EED6' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold" style={{ color: '#131114' }}>Efficiency Score</h3>
                <button className="p-2">
                  <div className="w-1 h-1 rounded-full mb-1" style={{ backgroundColor: '#131114' }}></div>
                  <div className="w-1 h-1 rounded-full mb-1" style={{ backgroundColor: '#131114' }}></div>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#131114' }}></div>
                </button>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-5xl font-bold" style={{ color: '#A62609' }}>7.7k</p>
                <p className="text-sm mb-2" style={{ color: '#131114', opacity: 0.5 }}>hours last 90 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;