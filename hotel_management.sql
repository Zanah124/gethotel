-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  sam. 29 nov. 2025 à 15:32
-- Version du serveur :  5.7.17
-- Version de PHP :  5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `hotel_management`
--
CREATE DATABASE IF NOT EXISTS `hotel_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hotel_management`;

-- --------------------------------------------------------

--
-- Structure de la table `categories_stock`
--

CREATE TABLE `categories_stock` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories_stock`
--

INSERT INTO `categories_stock` (`id`, `nom`, `description`, `created_at`) VALUES
(1, 'Produits ménagers', 'produits nettoyage, ménagers', '2025-11-25 16:09:09');

-- --------------------------------------------------------

--
-- Structure de la table `chambres`
--

CREATE TABLE `chambres` (
  `id` int(11) NOT NULL,
  `hotel_id` int(11) DEFAULT NULL,
  `type_chambre_id` int(11) DEFAULT NULL,
  `numero_chambre` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `etage` int(11) DEFAULT NULL,
  `statut` enum('disponible','occupee','maintenance','nettoyage') COLLATE utf8mb4_unicode_ci DEFAULT 'disponible',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `nationalite` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_passeport` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_cin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse` text COLLATE utf8mb4_unicode_ci,
  `ville` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pays` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferences` text COLLATE utf8mb4_unicode_ci,
  `nombre_sejours` int(11) DEFAULT '0',
  `points_fidelite` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `conges_employees`
--

CREATE TABLE `conges_employees` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `type_conge` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `motif` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('en_attente','approuve','refuse') COLLATE utf8mb4_unicode_ci DEFAULT 'en_attente',
  `approuve_par` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `hotel_id` int(11) DEFAULT NULL,
  `poste` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_embauche` date NOT NULL,
  `salaire_mensuel` decimal(10,2) DEFAULT NULL,
  `numero_cnaps` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_cin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse` text COLLATE utf8mb4_unicode_ci,
  `contact_urgence` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone_urgence` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `hotels`
--

CREATE TABLE `hotels` (
  `id` int(11) NOT NULL,
  `nom` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Madagascar',
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `nombre_etoiles` int(11) DEFAULT NULL,
  `photo_principale` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_hotel_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `code_postal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photos` json DEFAULT NULL,
  `equipements` json DEFAULT NULL,
  `services` json DEFAULT NULL,
  `politique_annulation` text COLLATE utf8mb4_unicode_ci
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `hotels`
--

INSERT INTO `hotels` (`id`, `nom`, `adresse`, `ville`, `pays`, `telephone`, `email`, `description`, `nombre_etoiles`, `photo_principale`, `admin_hotel_id`, `is_active`, `created_at`, `updated_at`, `code_postal`, `photos`, `equipements`, `services`, `politique_annulation`) VALUES
(3, 'Palace Madagascar', 'Lot log41 rue Richard', 'Mahajanga', 'Madagascar', '034 12 345 67', 'contact@palace.mg', 'Le meilleur hôtel 5 étoiles de Mahajanga', 5, NULL, 3, 1, '2025-11-24 16:58:46', '2025-11-24 16:58:46', '401', NULL, '[\"WiFi\", \"Piscine\", \"Restaurant\", \"Spa\", \"Parking\", \"Gym\", \"Bar\"]', '[\"Room service\", \"Blanchisserie\", \"Navette aéroport\", \"Petit-déjeuner inclus\", \"Service de conciergerie\"]', 'Annulation gratuite jusqu\'à 48h avant l\'arrivée'),
(2, 'Palace Madagascar', 'Lot log41 rue Richard', 'Mahajanga', 'Madagascar', '034 12 345 67', 'contact@palace.mg', 'Le meilleur hôtel 5 étoiles de Tana', 5, NULL, 3, 1, '2025-11-24 16:32:41', '2025-11-24 16:32:41', '401', '[]', '[\"WiFi\", \"Piscine\", \"Restaurant\", \"Spa\"]', '[\"Room service\", \"Blanchisserie\", \"Navette aéroport\"]', 'Annulation gratuite jusqu\'à 48h avant l\'arrivée');

-- --------------------------------------------------------

--
-- Structure de la table `mouvements_stock`
--

CREATE TABLE `mouvements_stock` (
  `id` int(11) NOT NULL,
  `stock_id` int(11) DEFAULT NULL,
  `type_mouvement` enum('entree','sortie','ajustement') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` int(11) NOT NULL,
  `motif` text COLLATE utf8mb4_unicode_ci,
  `effectue_par` int(11) DEFAULT NULL,
  `date_mouvement` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `planning_employees`
--

CREATE TABLE `planning_employees` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `date_travail` date NOT NULL,
  `heure_debut` time NOT NULL,
  `heure_fin` time NOT NULL,
  `poste_assigne` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_present` tinyint(1) DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `numero_reservation` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `chambre_id` int(11) DEFAULT NULL,
  `hotel_id` int(11) DEFAULT NULL,
  `date_arrivee` date NOT NULL,
  `date_depart` date NOT NULL,
  `nombre_adultes` int(11) NOT NULL,
  `nombre_enfants` int(11) DEFAULT '0',
  `prix_total` decimal(10,2) NOT NULL,
  `statut` enum('en_attente','confirmee','annulee','terminee') COLLATE utf8mb4_unicode_ci DEFAULT 'en_attente',
  `demandes_speciales` text COLLATE utf8mb4_unicode_ci,
  `created_by` int(11) DEFAULT NULL,
  `verified_by` int(11) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `hotel_id` int(11) DEFAULT NULL,
  `categorie_id` int(11) DEFAULT NULL,
  `nom_article` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `quantite_actuelle` int(11) DEFAULT '0',
  `quantite_minimale` int(11) DEFAULT '0',
  `unite_mesure` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prix_unitaire` decimal(10,2) DEFAULT NULL,
  `fournisseur` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `derniere_commande` date DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `subscription_plans`
--
-- Erreur de lecture de structure pour la table hotel_management.subscription_plans : #1146 - La table 'hotel_management.subscription_plans' n'existe pas
-- Erreur de lecture des données pour la table hotel_management.subscription_plans : #1064 - Erreur de syntaxe près de 'FROM `hotel_management`.`subscription_plans`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `subscriptions`
--
-- Erreur de lecture de structure pour la table hotel_management.subscriptions : #1146 - La table 'hotel_management.subscriptions' n'existe pas
-- Erreur de lecture des données pour la table hotel_management.subscriptions : #1064 - Erreur de syntaxe près de 'FROM `hotel_management`.`subscriptions`' à la ligne 1

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('superadmin','admin','employee','client') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
  `hotel_id` int(11) DEFAULT NULL,
  `photo_profil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('actif','inactif','suspendu') COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  `derniere_connexion` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `telephone`, `password`, `role`, `hotel_id`, `photo_profil`, `statut`, `derniere_connexion`, `created_at`, `updated_at`) VALUES
(1, 'VOLOLONIAINA', 'Cendrine', 'caroelia@gmail.com', '+261328361449', '$2a$10$aemuWAmhWndpOdxEjt104ePjdw3eowJCUm6MbAvEI6r5bzWIFHRvq', 'client', NULL, NULL, 'actif', NULL, '2025-11-18 13:11:24', '2025-11-18 13:11:24'),
(2, 'Alice', 'Bertinah', 'bertinahalice@gmail.com', '+2613267488412', '$2a$10$CTgtd0FtVl9lm6mGgs/AXuEQo4TyO3Ej7rBQ5nMgcHyEbwKbse4KK', 'client', NULL, NULL, 'actif', NULL, '2025-11-18 13:43:11', '2025-11-18 13:43:11'),
(3, 'NY AINA', 'Avo', 'nyainaavo@gmail.com', '+261334517390', '$2a$10$8mJL99AfiGK.dSiCkTc0H.G2xG3ugTa9tZc77rFdDK/m.vZdfdI0i', 'admin', 3, NULL, 'actif', NULL, '2025-11-19 12:47:16', '2025-11-19 12:47:16'),
(4, 'Lucie', 'Zanah', 'falimananaluciezanah@gmail.com', '+261328020750', '$2a$10$KcD8G7YeWNRgRG9At6af9e0LP94S6bB0OMOStUeTy8xFIW7yBLTVq', 'superadmin', NULL, NULL, 'actif', NULL, '2025-11-24 14:59:25', '2025-11-24 14:59:25'),
(5, 'Rakoto', 'Jean', 'admin.palace@hotel.mg', '034 98 765 43', '$2a$10$KpjOGhYUz2FTILB93GCsJuOc7oDwEIUDHZJKYo3r2mMJkodtMMOJK', 'admin', 2, NULL, 'actif', NULL, '2025-11-24 16:32:41', '2025-11-24 16:32:41');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categories_stock`
--
ALTER TABLE `categories_stock`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `chambres`
--
ALTER TABLE `chambres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hotel_id` (`hotel_id`,`numero_chambre`),
  ADD KEY `type_chambre_id` (`type_chambre_id`);

--
-- Index pour la table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clients_user_id` (`user_id`);

--
-- Index pour la table `conges_employees`
--
ALTER TABLE `conges_employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `approuve_par` (`approuve_par`);

--
-- Index pour la table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`hotel_id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Index pour la table `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_hotel_id` (`admin_hotel_id`);

--
-- Index pour la table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_id` (`stock_id`),
  ADD KEY `effectue_par` (`effectue_par`);

--
-- Index pour la table `planning_employees`
--
ALTER TABLE `planning_employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`,`date_travail`,`heure_debut`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_reservation` (`numero_reservation`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `chambre_id` (`chambre_id`),
  ADD KEY `hotel_id` (`hotel_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `verified_by` (`verified_by`);

--
-- Index pour la table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hotel_id` (`hotel_id`),
  ADD KEY `categorie_id` (`categorie_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categories_stock`
--
ALTER TABLE `categories_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `chambres`
--
ALTER TABLE `chambres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `conges_employees`
--
ALTER TABLE `conges_employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `planning_employees`
--
ALTER TABLE `planning_employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
