import sequelize from '../config/database.js';

// Import des modèles actuellement créés
import User from './User.js';
import Hotel from './Hotel.js';

// Décommentez au fur et à mesure que vous créez les modèles
// import SubscriptionPlan from './SubscriptionPlan.js';
// import Subscription from './Subscription.js';
// import Payment from './Payment.js';
// import Invoice from './Invoice.js';
 import Employee from './Employee.js';
// import Client from './Client.js';
 import TypeChambre from './TypeChambre.js';
import Chambre from './Chambre.js';
// import Reservation from './Reservation.js';
// import PaiementClient from './PaiementClient.js';
// import FactureClient from './FactureClient.js';
 import Stock from './Stock.js';
 import MouvementStock from './MouvementStock.js';
import CategorieStock from './CategorieStock.js';
// import PlanningEmployee from './PlanningEmployee.js';
// import CongeEmployee from './CongeEmployee.js';
// import Notification from './Notification.js';

// ============================================
// DÉFINITION DES RELATIONS
// ============================================

// User <-> Hotel (Relations actives)
User.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });
Hotel.hasMany(User, { foreignKey: 'hotel_id', as: 'users' });

//Hotel <-> Employee
Hotel.hasMany(Employee, { foreignKey: 'hotel_id', as: 'employees' });
Employee.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

// User <-> Employee
User.hasOne(Employee, { foreignKey: 'user_id', as: 'employeeProfile' });
Employee.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Hotel <-> Chambre 
Hotel.hasMany(Chambre, { foreignKey: 'hotel_id', as: 'chambres' });
Chambre.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

// Hotel <-> TypeChambre 
Hotel.hasMany(TypeChambre, { foreignKey: 'hotel_id', as: 'typesChambre' });  // changé de 'typeChambre' → 'typesChambre'
TypeChambre.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

// TypeChambre <-> Chambre 
TypeChambre.hasMany(Chambre, { foreignKey: 'type_chambre_id', as: 'chambres' });
Chambre.belongsTo(TypeChambre, { foreignKey: 'type_chambre_id', as: 'typeChambre' });  // ← ICI : 'hotel' → 'typeChambre'

// TOUTES LES AUTRES RELATIONS SONT COMMENTÉES
// Décommentez-les au fur et à mesure que vous créez les modèles

/*
// SubscriptionPlan <-> Subscription
SubscriptionPlan.hasMany(Subscription, { foreignKey: 'plan_id', as: 'subscriptions' });
Subscription.belongsTo(SubscriptionPlan, { foreignKey: 'plan_id', as: 'plan' });

// Hotel <-> Subscription
Hotel.hasOne(Subscription, { foreignKey: 'hotel_id', as: 'subscription' });
Subscription.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

// Subscription <-> Payment
Subscription.hasMany(Payment, { foreignKey: 'subscription_id', as: 'payments' });
Payment.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'subscription' });

// Subscription <-> Invoice
Subscription.hasMany(Invoice, { foreignKey: 'subscription_id', as: 'invoices' });
Invoice.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'subscription' });


// User <-> Client
User.hasOne(Client, { foreignKey: 'user_id', as: 'clientProfile' });
Client.belongsTo(User, { foreignKey: 'user_id', as: 'user' });



// Chambre <-> Reservation
Chambre.hasMany(Reservation, { foreignKey: 'chambre_id', as: 'reservations' });
Reservation.belongsTo(Chambre, { foreignKey: 'chambre_id', as: 'chambre' });

// Client <-> Reservation
Client.hasMany(Reservation, { foreignKey: 'client_id', as: 'reservations' });
Reservation.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Reservation <-> PaiementClient
Reservation.hasMany(PaiementClient, { foreignKey: 'reservation_id', as: 'paiements' });
PaiementClient.belongsTo(Reservation, { foreignKey: 'reservation_id', as: 'reservation' });

// Reservation <-> FactureClient
Reservation.hasOne(FactureClient, { foreignKey: 'reservation_id', as: 'facture' });
FactureClient.belongsTo(Reservation, { foreignKey: 'reservation_id', as: 'reservation' });
*/

// Hotel <-> Stock
Hotel.hasMany(Stock, { foreignKey: 'hotel_id', as: 'stocks' });
Stock.belongsTo(Hotel, { foreignKey: 'hotel_id', as: 'hotel' });

CategorieStock.hasMany(Stock, { foreignKey: 'categorie_id' });
Stock.belongsTo(CategorieStock, { foreignKey: 'categorie_id' });

Stock.hasMany(MouvementStock, { foreignKey: 'stock_id', onDelete: 'CASCADE' });
MouvementStock.belongsTo(Stock, { foreignKey: 'stock_id' });

User.hasMany(MouvementStock, { foreignKey: 'effectue_par', as: 'mouvements' });
MouvementStock.belongsTo(User, { foreignKey: 'effectue_par', as: 'employee' });

/*
// Employee <-> PlanningEmployee
Employee.hasMany(PlanningEmployee, { foreignKey: 'employee_id', as: 'plannings' });
PlanningEmployee.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// Employee <-> CongeEmployee
Employee.hasMany(CongeEmployee, { foreignKey: 'employee_id', as: 'conges' });
CongeEmployee.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
*/

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

const db = {
  sequelize,
  User,
  Hotel,
  Stock,
  MouvementStock,
  CategorieStock,
  Employee,
  Chambre,
  TypeChambre
  // Ajoutez les autres modèles au fur et à mesure
  /*
  SubscriptionPlan,
  Subscription,
  Payment,
  Invoice,
  
  Client,
  
  
  Reservation,
  PaiementClient,
  FactureClient,  */
  /*
  PlanningEmployee,
  CongeEmployee,
  Notification
  */
};

export default db;