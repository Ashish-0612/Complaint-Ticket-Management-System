import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Circle } from "lucide-react";

const getNotificationId = (ticket) => `ticket-${ticket.id}-${ticket.status}-${ticket.updatedAt}`;

const NotificationBell = ({ tickets = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ctms-read-notifications") || "[]");
    } catch {
      return [];
    }
  });

  const notifications = useMemo(
    () =>
      tickets.slice(0, 8).map((ticket) => ({
        id: getNotificationId(ticket),
        title: `Ticket #${ticket.id} updated`,
        message: `${ticket.title} · ${ticket.status}`,
        date: ticket.updatedAt || ticket.createdAt,
      })),
    [tickets],
  );

  const unreadCount = notifications.filter(
    (notification) => !readIds.includes(notification.id),
  ).length;

  useEffect(() => {
    localStorage.setItem("ctms-read-notifications", JSON.stringify(readIds));
  }, [readIds]);

  const markAllRead = () => {
    setReadIds((currentIds) => [
      ...new Set([...currentIds, ...notifications.map((notification) => notification.id)]),
    ]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Open notifications"
        aria-expanded={isOpen}
        className="relative cursor-pointer rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Notifications</h3>
              <p className="text-xs text-gray-400">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-gray-400">No notifications yet.</p>
            ) : (
              notifications.map((notification) => {
                const isRead = readIds.includes(notification.id);
                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => setReadIds((currentIds) => [...new Set([...currentIds, notification.id])])}
                    className="flex w-full cursor-pointer items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <Circle size={9} className={`mt-1.5 flex-shrink-0 ${isRead ? "text-gray-300" : "fill-blue-500 text-blue-500"}`} />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-gray-700 dark:text-gray-100">{notification.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-gray-400">{notification.message}</span>
                      <span className="mt-1 block text-[10px] text-gray-400">{notification.date ? new Date(notification.date).toLocaleDateString() : "Recently"}</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
