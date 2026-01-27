-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  lun. 26 jan. 2026 à 08:17
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

-- --------------------------------------------------------

--
-- Structure de la table `categories_stock`
--

CREATE TABLE `categories_stock` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories_stock`
--

INSERT INTO `categories_stock` (`id`, `nom`, `description`, `created_at`) VALUES
(1, 'Produit ménager', 'pour le ménage', '2026-01-23 11:38:27');

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

--
-- Déchargement des données de la table `chambres`
--

INSERT INTO `chambres` (`id`, `hotel_id`, `type_chambre_id`, `numero_chambre`, `etage`, `statut`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '102', 1, 'disponible', 'Vue sur jardin', '2026-01-23 13:35:05', '2026-01-23 13:35:22');

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
  `user_id` int(11) NOT NULL,
  `hotel_id` int(11) NOT NULL,
  `poste` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departement` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salaire_mensuel` decimal(10,2) DEFAULT NULL,
  `date_embauche` datetime NOT NULL,
  `contrat_type` enum('CDI','CDD','stage','interim') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CDI',
  `statut` enum('actif','conge','inactif') COLLATE utf8mb4_unicode_ci DEFAULT 'actif',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `employees`
--

INSERT INTO `employees` (`id`, `user_id`, `hotel_id`, `poste`, `departement`, `salaire_mensuel`, `date_embauche`, `contrat_type`, `statut`, `created_at`, `updated_at`) VALUES
(3, 8, 1, 'Réceptionniste', 'Accueil', '10000.00', '2025-10-02 03:00:00', 'CDI', 'actif', '2025-12-08 22:50:37', '2025-12-08 22:50:37'),
(5, 12, 1, 'Agent de sécurité', 'Sécurité', '130000.00', '2025-09-01 03:00:00', 'interim', 'actif', '2025-12-09 14:07:55', '2025-12-09 14:07:55'),
(6, 14, 1, 'Réceptionniste', 'Hébergement', '200000.00', '2026-01-23 03:00:00', 'interim', 'actif', '2026-01-23 11:35:37', '2026-01-23 11:35:37');

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
  `code_postal` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `nombre_etoiles` int(11) DEFAULT NULL,
  `photo_principale` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photos` json DEFAULT NULL,
  `equipements` json DEFAULT NULL,
  `services` json DEFAULT NULL,
  `politique_annulation` text COLLATE utf8mb4_unicode_ci,
  `admin_hotel_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `hotels`
--

INSERT INTO `hotels` (`id`, `nom`, `adresse`, `ville`, `pays`, `code_postal`, `telephone`, `email`, `description`, `nombre_etoiles`, `photo_principale`, `photos`, `equipements`, `services`, `politique_annulation`, `admin_hotel_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Hôtel Le Louvre Madagascar', 'Lot II Y 42 Bis Ankorondrano', 'Mahajanga', 'Madagascar', '101', '+261 34 05 123 45', 'contact@louvre-mada.mg', 'Hôtel 4 étoiles au cœur d\'Antananarivo avec vue panoramique.', 4, '/uploads/hotels/1-1765357700414-426159006.jpg', '[\"/uploads/hotels/1-1769116025184-912427670.png\"]', '[\"wifi\", \"piscine\", \"spa\", \"parking\", \"restaurant\", \"salle_de_sport\"]', '[\"room_service\", \"blanchisserie\", \"conciergerie\"]', 'Annulation gratuite jusqu\'à 48h avant l\'arrivée.', 2, 1, '2025-12-06 19:27:56', '2026-01-23 00:07:14'),
(2, 'Le royale Palace', 'Amborovy', 'Mahajanga', 'Madagascar', '401', '03267154378', 'royalepalace@gmail.com', '', 4, NULL, '[]', '[]', '[]', NULL, 11, 1, '2025-12-09 13:37:17', '2025-12-09 13:37:19'),
(3, 'Salama hôtel', 'Mahabibo kely', 'Mahajanga', 'Madagascar', '401', '0329046270', 'salamahotel@gmail.com', 'un hôtel fait pour des touristes', 2, NULL, '[]', '[]', '[]', NULL, 15, 1, '2026-01-23 13:13:21', '2026-01-23 13:13:22');

-- --------------------------------------------------------

--
-- Structure de la table `mouvements_stock`
--

CREATE TABLE `mouvements_stock` (
  `id` int(11) NOT NULL,
  `stock_id` int(11) NOT NULL,
  `type_mouvement` enum('entree','sortie','ajustement') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantite` int(11) NOT NULL,
  `motif` text COLLATE utf8mb4_unicode_ci,
  `effectue_par` int(11) DEFAULT NULL,
  `date_mouvement` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `hotel_id` int(11) NOT NULL,
  `categorie_id` int(11) NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `stock`
--

INSERT INTO `stock` (`id`, `hotel_id`, `categorie_id`, `nom_article`, `description`, `quantite_actuelle`, `quantite_minimale`, `unite_mesure`, `prix_unitaire`, `fournisseur`, `derniere_commande`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Savon extra', 'Moyens', 8, 10, 'pièce', '2000.00', 'Damar', NULL, '2026-01-23 11:42:35', '2026-01-23 11:42:35');

-- --------------------------------------------------------

--
-- Structure de la table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `hotel_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `stripe_subscription_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','canceled','past_due','trialing','incomplete','incomplete_expired') COLLATE utf8mb4_unicode_ci DEFAULT 'trialing',
  `current_period_start` datetime DEFAULT NULL,
  `current_period_end` datetime DEFAULT NULL,
  `trial_end` datetime DEFAULT NULL,
  `canceled_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `subscription_plans`
--

CREATE TABLE `subscription_plans` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Basic, Premium, Enterprise',
  `price_monthly` decimal(10,2) NOT NULL,
  `price_yearly` decimal(10,2) NOT NULL,
  `max_rooms` int(11) NOT NULL DEFAULT '10',
  `max_employees` int(11) NOT NULL DEFAULT '5',
  `max_storage_gb` int(11) DEFAULT '5',
  `features` json DEFAULT NULL COMMENT 'ex: ["réservation en ligne", "paiement stripe", "statistiques avancées"]',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_chambres`
--

CREATE TABLE `type_chambres` (
  `id` int(11) NOT NULL,
  `hotel_id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `description` text,
  `prix_par_nuit` decimal(10,2) NOT NULL,
  `capacite` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `type_chambres`
--

INSERT INTO `type_chambres` (`id`, `hotel_id`, `nom`, `description`, `prix_par_nuit`, `capacite`, `created_at`, `updated_at`) VALUES
(1, 1, 'Double premium', 'Luxe et confort', '80000.00', 2, '2026-01-23 13:34:09', '2026-01-23 13:34:09');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `telephone`, `password`, `role`, `hotel_id`, `photo_profil`, `statut`, `derniere_connexion`, `created_at`, `updated_at`) VALUES
(1, 'Lucie', 'Zanah', 'falimananaluciezanah@gmail.com', '+261328020750', '$2a$10$N1H5o0L0tfif5uXVk5180u0cZm5G37iH1vYvk6HCvkd7Ov0wGLrTS', 'superadmin', NULL, NULL, 'actif', NULL, '2025-12-06 16:53:24', '2025-12-06 16:53:24'),
(2, 'NY AINA', 'Avo', 'nyainaavo@gmail.com', '+261334517390', '$2a$10$Q13AAMFZVzPREEBlwlQefOoLfg.pZHy9YZwqyKoUGRPCRW7aUEc1C', 'admin', 1, NULL, 'actif', NULL, '2025-12-06 16:53:53', '2025-12-06 16:53:53'),
(8, 'Sambatra', 'Fy', 'sambatrafy@hotel.com', '329012708', '$2a$10$4bjwDXnZVtiZcpkjGTRiSOr4Vb0czaEYAdVyaLpRJ99bQWQ.Qp1ou', 'employee', 1, NULL, 'actif', NULL, '2025-12-08 22:50:37', '2025-12-08 22:50:37'),
(9, 'Bertinah', 'Alice', 'alicebertinah@gmail.com', '0326713289', '$2a$10$pmwGX5XMTLU8GaAdcEij9.YkuyFe5Vgi8qqYK8B6oOKmJbQ0LRmkW', 'client', NULL, NULL, 'actif', NULL, '2025-12-09 11:51:44', '2025-12-09 11:51:44'),
(11, 'Mamy', 'Velo', 'mamyvelo@gmail.com', '0382474912', '$2a$10$GTuCDUh6QDTqjHSIGzRfUeGWcdhxuL2jjqhSs8YbZj53Jaw/F.Kg.', 'admin', 2, NULL, 'actif', NULL, '2025-12-09 13:37:18', '2025-12-09 13:37:18'),
(12, 'Toky', 'aina', 'tokyaina@gmail.com', '', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 1, NULL, 'actif', NULL, '2025-12-09 14:07:54', '2025-12-09 14:07:54'),
(13, 'Cendrine', 'Elia', 'eliacendrine@gmail.com', '0328361449', '$2a$10$lzcTzQgWz/DpC3qkOTa4vemX4acDCBNxlGtgEu66eeNHGJ6tdzfr6', 'client', NULL, NULL, 'actif', NULL, '2026-01-23 11:25:04', '2026-01-23 11:25:04'),
(14, 'Feno', 'Tiana', 'fenotiana@hotel.com', '0347648923', '$2a$10$7JMqhsI1dESEsWgHs9aa4.VUXMoMCyznSEO8GlxPibQhctZ4N62Zm', 'employee', 1, NULL, 'actif', NULL, '2026-01-23 11:35:37', '2026-01-23 11:35:37'),
(15, 'Toussaint', 'Benjamin', 'toussaintbenjamin@gmail.com', '0347419132', '$2a$10$3qqFvfCc.QPhuhhh.VSODeQSoJZdijZRx./g3tnHrZ58FvQA5CE5i', 'admin', 3, NULL, 'actif', NULL, '2026-01-23 13:13:21', '2026-01-23 13:13:21');

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
  ADD UNIQUE KEY `user_id` (`user_id`),
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
-- Index pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stripe_subscription_id` (`stripe_subscription_id`),
  ADD UNIQUE KEY `stripe_subscription_id_2` (`stripe_subscription_id`),
  ADD KEY `hotel_id` (`hotel_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Index pour la table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`);

--
-- Index pour la table `type_chambres`
--
ALTER TABLE `type_chambres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_type_chambre_hotel` (`hotel_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `subscription_plans`
--
ALTER TABLE `subscription_plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `type_chambres`
--
ALTER TABLE `type_chambres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `hotels`
--
ALTER TABLE `hotels`
  ADD CONSTRAINT `hotels_ibfk_1` FOREIGN KEY (`admin_hotel_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  ADD CONSTRAINT `mouvements_stock_ibfk_1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mouvements_stock_ibfk_2` FOREIGN KEY (`effectue_par`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`categorie_id`) REFERENCES `categories_stock` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Contraintes pour la table `type_chambres`
--
ALTER TABLE `type_chambres`
  ADD CONSTRAINT `fk_type_chambre_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
