import React from 'react';
import { CalendarCheck, Users, Building2, Search, LogIn, UserPlus, ArrowRight, Star, Shield, Zap } from 'lucide-react';

const Accueil = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/src/assets/acc.png')] bg-cover bg-center bg-no-repeat">
        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center text-white">
          <div className="inline-flex items-center gap-3 bg-[#49B9FF]/20 backdrop-blur-sm px-5 py-2 rounded-full border border-[#49B9FF]/50 mb-6">
            <Zap className="w-5 h-5 text-[#49B9FF]" />
            <span className="text-sm font-medium">L'expérience hôtelière ultime, 100% digitale</span>
          </div>

          <h1 className="font-pt-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            GetHotel<br />
            <span className="text-[#f4B34C]">Réservez. Gérez. Brillez.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-200">
            Une plateforme unique pour réserver votre séjour de rêve ou digitaliser entièrement la gestion de votre hôtel : 
            réservations en ligne, planning, stock, facturation… tout est là.
          </p>

          {/* CTA selon le profil */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-12">
            {/* Pour les clients */}
            <a
              href="/rechercher"
              className="group flex items-center gap-3 bg-[#49B9FF] hover:bg-[#3aa8ee] text-black font-semibold px-8 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <Search className="w-6 h-6" />
              Trouver mon hôtel
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition" />
            </a>

            {/* Pour les hôtels / admins */}
            <a
              href="/login"
              className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all"
            >
              <Building2 className="w-6 h-6" />
              Gérer mon hôtel
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition" />
            </a>
          </div>

          {/* Badges confiance */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#49B9FF]" />
              <span>Paiements sécurisés</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#f4B34C]" />
              <span>+ de 5 000 hôtels utilisent GetHotel</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span>Disponible 24h/24 • 7j/7</span>
            </div>
          </div>
        </div>

        {/* Vague décorative en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 15L120 5L180 20L240 10L300 25L360 15L420 30L480 20L540 35L600 25L660 40L720 30L780 45L840 35L900 50L960 40L1020 55L1080 45L1140 60L1200 50L1260 65L1320 55L1380 70L1440 60V150H0V0Z" fill="white" opacity="0.1"/>
          </svg>
        </div>
      </section>

      {/* Section fonctionnalités (pour tout le monde) */}
      <section className="py-20 bg-gradient-to-b from-black to-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Une solution complète, pour tous
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Que vous soyez voyageur, réceptionniste ou propriétaire d’hôtel, GetHotel simplifie votre quotidien.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Search,
                title: "Réservation en ligne",
                desc: "Clients : trouvez et réservez votre chambre en quelques clics, 24h/24",
                color: "from-[#49B9FF]/20 to-[#49B9FF]/5",
                for: "client"
              },
              {
                icon: CalendarCheck,
                title: "Gestion intelligente",
                desc: "Employés & admins : planning, check-in/out, réservations, factures… tout centralisé",
                color: "from-[#f4B34C]/20 to-[#f4B34C]/5",
                for: "staff"
              },
              {
                icon: Users,
                title: "Contrôle total",
                desc: "Administrateurs : gérez votre personnel, votre stock, vos finances et suivez vos performances en temps réel",
                color: "from-purple-500/20 to-purple-500/5",
                for: "admin"
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br border border-gray-800 rounded-2xl p-8 hover:border-[#49B9FF] transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-50 group-hover:opacity-80 transition`}></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-black/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                    <item.icon size={36} className={
                      item.for === "client" ? "text-[#49B9FF]" :
                      item.for === "staff" ? "text-[#f4B34C]" : "text-purple-400"
                    } />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section appel final */}
      <section className="py-20 bg-[#0f0f0f] border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Prêt à transformer votre expérience hôtelière ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
            <a href="/inscription" className="flex items-center justify-center gap-3 bg-[#49B9FF] hover:bg-[#3aa8ee] text-black font-bold py-4 px-10 rounded-full text-lg transition">
              <UserPlus className="w-6 h-6" />
              Créer un compte gratuit
            </a>
            <a href="/demo" className="flex items-center justify-center gap-3 border border-gray-700 hover:border-[#f4B34C] text-white font-bold py-4 px-10 rounded-full text-lg transition">
              Voir une démo
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Accueil;