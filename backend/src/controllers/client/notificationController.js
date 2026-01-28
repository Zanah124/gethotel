import Notification from '../../models/Notification.js';

export const getMyNotifications = async (req, res) => {
  try {
    const client = req.user;
    const { limit = 50, unread_only } = req.query;
    const where = { user_id: client.id };
    if (unread_only === 'true' || unread_only === true) where.read = false;

    const notifications = await Notification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Math.min(parseInt(limit) || 50, 100),
    });

    const unreadCount = await Notification.count({
      where: { user_id: client.id, read: false },
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (err) {
    console.error('Erreur getMyNotifications:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const client = req.user;

    const notif = await Notification.findOne({
      where: { id, user_id: client.id },
    });
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification non trouvée' });
    }

    notif.read = true;
    await notif.save();

    res.status(200).json({ success: true, data: notif });
  } catch (err) {
    console.error('Erreur markNotificationRead:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const client = req.user;
    await Notification.update(
      { read: true },
      { where: { user_id: client.id, read: false } }
    );
    res.status(200).json({ success: true, message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (err) {
    console.error('Erreur markAllNotificationsRead:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
