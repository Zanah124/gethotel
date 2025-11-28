import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, CalendarCheck, Users, Shield, ArrowRight, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header / Navigation */}
      <header className="relative z-50 px-6 py-5 lg:px-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Hotel size={36} className="text-[#f4B34C]" />
            <span className="text-2xl font-bold tracking-wider">GetHotel</span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#fonctionnalites" className="hover:text-[#f4B34C] transition">Fonctionnalités</a>
            <a href="#pourqui" className="hover:text-[#f4B34C] transition">Pour qui ?</a>
            <a href="#tarifs" className="hover:text-[#f4B34C] transition">Tarifs</a>
          </div>
          <div className="flex gap-4">
            <Link to="/login"
              className="px-6 py-3 border border-[#f4B34C] text-[#f4B34C] rounded-full hover:bg-[#f4B34C] hover:text-black transition font-medium"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-[#f4B34C] text-black rounded-full hover:bg-white transition font-bold flex items-center gap-2"
            >
              Commencer gratuitement <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Gérez votre hôtel <br />
            <span className="text-[#f4B34C]">comme un pro</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            Une solution complète pour digitaliser votre hôtel : réservations en ligne, gestion des chambres, 
            facturation, planning du personnel et bien plus encore.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="px-10 py-5 bg-[#f4B34C] text-black text-lg font-bold rounded-full hover:bg-white transform hover:scale-105 transition flex items-center justify-center gap-3"
            >
              Essayer gratuitement 14 jours <ArrowRight />
            </Link>
            <Link
              to="/demo"
              className="px-10 py-5 border-2 border-[#7238D4] text-[#7238D4] text-lg font-bold rounded-full hover:bg-[#7238D4] hover:text-white transition"
            >
              Voir une démo
            </Link>
          </div>

          {/* Étoiles de confiance */}
          <div className="mt-16 flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={28} fill="#f4B34C" className="text-[#f4B34C]" />
            ))}
            <span className="ml-4 text-gray-400">+ de 280 hôtels nous font confiance</span>
          </div>
        </div>

        {/* Décoration dorée */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f4B34C] opacity-10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7238D4] opacity-10 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-20 bg-gradient-to-b from-black to-[#0a0a0a] px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Tout ce dont votre hôtel a besoin
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: CalendarCheck, title: "Réservations en ligne", desc: "Vos clients réservent 24h/24 directement sur votre site" },
              { icon: Users, title: "Gestion du personnel", desc: "Planning, congés, pointage — tout est centralisé" },
              { icon: Shield, title: "Sécurité & conformité", desc: "Données chiffrées, sauvegardes automatiques" },
            ].map((item, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 hover:border-[#f4B34C] transition group">
                <item.icon size={48} className="text-[#f4B34C] mb-6 group-hover:scale-110 transition" />
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui ? */}
      <section id="pourqui" className="py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Adapté à tous les types d'hébergements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["Hôtels", "Gîtes", "Chambres d'hôtes", "Auberges"].map((type) => (
              <div key={type} className="bg-gradient-to-br from-[#7238D4] to-[#f4B34C] p-1 rounded-2xl">
                <div className="bg-black rounded-2xl p-8 h-full">
                  <h3 className="text-xl font-bold">{type}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-[#7238D4] to-[#f4B34C] px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Prêt à digitaliser votre hôtel ?
          </h2>
          <p className="text-xl mb-12 text-white/90">
            Inscription gratuite • Aucun engagement • Essai 14 jours
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-4 px-12 py-6 bg-black text-white text-xl font-bold rounded-full hover:bg-gray-900 transition transform hover:scale-105"
          >
            Commencer maintenant <ArrowRight size={28} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-gray-800 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2025 GetHotel • Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;