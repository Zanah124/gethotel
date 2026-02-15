import React from 'react';
import {
  Target,
  Heart,
  Zap,
  Shield,
  Code2,
  ExternalLink,
  Terminal,
  Github,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Zap,
      title: 'Simplicité',
      desc: 'Une interface claire pour réserver ou gérer votre hôtel en quelques clics.',
    },
    {
      icon: Shield,
      title: 'Fiabilité',
      desc: 'Paiements sécurisés, données protégées et disponibilité 24h/24.',
    },
    {
      icon: Heart,
      title: 'Proximité',
      desc: 'Une solution pensée pour les voyageurs et les professionnels de l\'hôtellerie.',
    },
    {
      icon: Target,
      title: 'Innovation',
      desc: 'Une plateforme 100 % digitale qui fait évoluer l\'expérience hôtelière.',
    },
  ];

  const stats = [
    { value: '3', label: 'Hôtels partenaires' },
    { value: '24/7', label: 'Disponibilité' },
    { value: '100 %', label: 'Digital' },
  ];

  const installLinks = [
    {
      name: 'Node.js (LTS recommandé)',
      url: 'https://nodejs.org/',
      desc: 'Obligatoire pour exécuter le backend et le frontend.',
    },
    {
      name: 'npm',
      url: 'https://www.npmjs.com/',
      desc: 'Inclus avec Node.js — gestion des paquets.',
    },
    {
      name: 'Git',
      url: 'https://git-scm.com/',
      desc: 'Pour cloner le projet et gérer les versions.',
    },
    {
      name: 'MySQL',
      url: 'https://www.mysql.com/downloads/',
      desc: 'Base de données utilisée par le backend.',
    },
    {
      name: 'React',
      url: 'https://react.dev/',
      desc: 'Bibliothèque frontend (installée via npm).',
    },
    {
      name: 'Vite',
      url: 'https://vitejs.dev/',
      desc: 'Outil de build frontend (installé via npm).',
    },
  ];

  return (
    <div className="min-h-screen bg-[#A48374]">
      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#A48374]">
        <div className="absolute inset-0 bg-[url('/src/assets/acc.png')] bg-cover bg-center opacity-5" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            À propos de <span className="text-[#f4e4bc]">GetHotel</span>
          </h1>
          <p className="text-xl text-white/90">
            La plateforme qui réunit réservation en ligne et gestion hôtelière en un seul lieu.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24 bg-[#A48374] border-t border-white/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Notre mission</h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Rendre la réservation et la gestion hôtelière simples pour tous : voyageurs, réceptionnistes et propriétaires d'hôtels. 
            GetHotel centralise réservations, planning, stock et facturation pour une expérience fluide et professionnelle.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 md:py-24 bg-[#A48374]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Nos valeurs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/30 bg-white/10 hover:border-[#49B9FF]/50 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-[#49B9FF]/20 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-[#49B9FF]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-white/85 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="py-16 md:py-20 bg-[#A48374] border-t border-white/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">GetHotel en quelques chiffres</h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#f4e4bc]">{stat.value}</div>
                <div className="text-white/90 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="py-16 md:py-24 bg-[#A48374] border-t border-white/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3 text-white">
            <Terminal className="w-10 h-10 text-[#49B9FF]" />
            Installation sur un ordinateur
          </h2>
          <p className="text-white/90 mb-10">
            Prérequis et liens utiles pour installer et lancer le projet GetHotel en local.
          </p>

          <div className="space-y-4 mb-10">
            {installLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 rounded-xl border border-white/30 bg-white/10 hover:border-[#49B9FF]/50 transition-all group"
              >
                <span className="font-medium text-white group-hover:text-[#49B9FF] flex items-center gap-2">
                  {link.name}
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </span>
                <span className="text-white/85 text-sm sm:ml-2">{link.desc}</span>
              </a>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-white/15 border border-white/30 font-mono text-sm text-white/90 space-y-4">
            <p className="text-white/70"># Cloner le projet (si applicable)</p>
            <code className="block">git clone &lt;url-du-repo&gt;</code>
            <p className="text-white/70 pt-2"># Backend</p>
            <code className="block">cd backend</code>
            <code className="block">npm install</code>
            <code className="block">npm run dev</code>
            <p className="text-white/70 pt-2"># Frontend (dans un autre terminal)</p>
            <code className="block">cd frontend</code>
            <code className="block">npm install</code>
            <code className="block">npm run dev</code>
          </div>
          <p className="text-white/70 text-sm mt-4">
            Configurez un fichier <code className="bg-white/20 px-1 rounded">.env</code> dans le dossier backend (base de données, JWT, etc.) selon les besoins du projet.
          </p>
        </div>
      </section>

      {/* Développeur / Crédits */}
      <section className="py-16 md:py-24 bg-[#A48374] border-t border-white/20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2 text-white">
            <Code2 className="w-8 h-8 text-[#f4e4bc]" />
            Développement
          </h2>
          <p className="text-white/90 mb-6">
            Projet développé avec React, Node.js, Express et MySQL.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl bg-white/10 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#49B9FF]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#49B9FF]" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white/90">Développé par</div>
                <div className="text-[#f4e4bc] font-medium">FALIMANANA Lucie Zanah</div>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/90 hover:text-[#49B9FF] transition"
            >
              <Github className="w-5 h-5" />
              Répertoire du projet
            </a>
          </div>
          <p className="text-white/70 text-sm mt-6">
            Version: 1.0
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#A48374] border-t border-white/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Prêt à utiliser GetHotel ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 bg-[#49B9FF] hover:bg-[#3aa8ee] text-black font-semibold py-3 px-8 rounded-full transition"
            >
              Trouver un hôtel
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/60 hover:border-[#f4e4bc] text-white font-semibold py-3 px-8 rounded-full transition"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
