import acc from './acc.png';
import chambre1 from './1.png';
import chambre2 from './2.png';
import chambre3 from './3.png';
import add from './add.png';
import hotel from './hotel.png';
import room from './room.png';
import account from './account.svg';
import addcircle from './add-circle.svg';
import album from './album.svg';
import arrowleft from './arrow-left.svg';
import checkmarkCircle from './checkmark-circle.svg';
import checkmark2 from './checkmark2.svg';
import deletet from './delete.svg';
import favourite from './favourite.svg';
import home from './home.svg';
import location from './location.svg';
import mail from './mail.svg';
import search from './search.svg';
import star from './star.svg';
import task from './task.svg';
import alert from './alert.svg';
import bed from './bed.svg';
import blush from './blush.svg';
import book from './book.svg';
import bubble from './bubble-chat-.svg';
import calendarIcon from './calendar.svg';
import call from './call.svg';
import cancel from './cancel.svg';
import chartDown from './chart-down.svg';
import menu from './menu.svg';
import menuBlanc from './menu(1).svg';
import printer from './printer.svg';
import searchBlanc from './searchBlanc.svg';
import squareIcon from './square-lock.svg';


export const assets = {
  acc,
  chambre1,
    chambre2,
    chambre3,
    add,
    hotel,
    room,
    account,
    addcircle,
    album,
    arrowleft,
    checkmarkCircle,
    checkmark2,
    deletet,
    favourite,
    home,
    location,
    mail,
    search,
    star,
    task,
    alert,
    bed,
    blush,
    book,
    bubble,
    calendarIcon,
    call,
    cancel,
    chartDown,
    menu,
    menuBlanc,
    printer,
    searchBlanc,
    squareIcon,
};

// src/data/chambres.js
export const chambres = [
  {
    _id: 1,  // Utilisez _id pour MongoDB-like, ou id pour SQL
    hotel_id: 1,
    type_chambre_id: 1,
    numero_chambre: '14',
    etage: 1,
    statut: 'disponible',
    notes: 'Chambre spacieuse avec vue sur stade Rabemananjara',
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2023-10-01T10:00:00Z',
    images: [chambre1],  // Ajoutez des URLs d'images mockées
    prix_base: 15000,  // En Ariary (Ar)
    hote: { name: 'Hôtel Pietra' },  // Mock pour l'hôtel
    hotel: { address: 'Mahajunga, Madagascar' }  // Mock pour l'adresse
  },
  {
    _id: 2,
    hotel_id: 2,
    type_chambre_id: 2,
    numero_chambre: '24',
    etage: 2,
    statut: 'occupee',
    notes: 'Réservée pour une famille',
    created_at: '2023-10-02T12:00:00Z',
    updated_at: '2023-10-15T09:00:00Z',
    images: [chambre2],
    prix_base: 20000,
    hote: { name: 'Hôtel Paradis' },
    hotel: { address: 'Antananarivo, Madagascar' }
  },
  {
    _id: 3,
    hotel_id: 3,
    type_chambre_id: 1,
    numero_chambre: '12',
    etage: 3,
    statut: 'maintenance',
    notes: 'En cours de nettoyage',
    created_at: '2023-09-28T08:00:00Z',
    updated_at: '2023-11-10T14:00:00Z',
    images: [chambre3],
    prix_base: 12000,
    hote: { name: 'Hôtel Soleil' },
    hotel: { address: 'Tamatave, Madagascar' }
  }
 
];

export const hotels = [
  {
    id: 1,
    nom: 'Hôtel Pietra',
    adresse: 'Mahajunga Be',
    ville: 'Mahajunga',
    pays: 'Madagascar',
    telephone: '0342136434',
    email: 'hotelpietramahajanga@gmail.com',
    description: 'centre-ville',
    nombre_etoiles: 3,
    photo_principale: [room],
    admin_hotel_id : 1,
    is_active: 'actif',
    created_at: '2023-09-28T08:00:00Z',
    updated_at: '2023-09-28T08:00:00Z'

  },
  {
    id: 2,
    nom: 'Hôtel Pietra',
    adresse: 'Mahajunga Be',
    ville: 'Mahajunga',
    pays: 'Madagascar',
    telephone: '0342136434',
    email: 'hotelpietramahajanga@gmail.com',
    description: 'centre-ville',
    nombre_etoiles: 3,
    photo_principale: [room],
    admin_hotel_id : 1,
    is_active: 'actif',
    created_at: '2023-09-28T08:00:00Z',
    updated_at: '2023-09-28T08:00:00Z'
  }

];



