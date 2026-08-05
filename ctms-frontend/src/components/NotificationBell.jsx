import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, Circle, X } from "lucide-react";

const getNotificationId = (ticket) =>
  `ticket-${ticket.id}-${ticket.status}-${ticket.updatedAt}`;

const getRelativeTime = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const NotificationBell = ({ tickets = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ctms-read-notifications") || "[]");
    } catch {
      return [];
    }
  });
  const containerRef = useRef(null);

  const notifications = useMemo(
    () =>
      tickets.slice(0, 8).map((ticket) => ({
        id: getNotificationId(ticket),
        title: `Ticket #${ticket.id} updated`,
        message: ticket.title,
        status: ticket.status,
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

  // Desktop: outside click / Escape se bandh
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // Mobile par backdrop khud close karta hai (window.innerWidth < 768)
      if (window.innerWidth < 768) return;
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Mobile: bottom-sheet khula ho toh body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const markAllRead = () => {
    setReadIds((currentIds) => [
      ...new Set([...currentIds, ...notifications.map((notification) => notification.id)]),
    ]);
  };

  const markRead = (notificationId) => {
    setReadIds((currentIds) => [...new Set([...currentIds, notificationId])]);
  };

  const renderNotificationList = (
    <div className="max-h-80 overflow-y-auto">
      {notifications.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-gray-400">
          No notifications yet.
        </p>
      ) : (
        notifications.map((notification) => {
          const isRead = readIds.includes(notification.id);
          return (
            <button
              key={notification.id}
              type="button"
              onClick={() => markRead(notification.id)}
              className="flex w-full cursor-pointer items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Circle
                size={9}
                className={`mt-1.5 flex-shrink-0 ${isRead ? "text-gray-300" : "fill-blue-500 text-blue-500"}`}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-gray-700 dark:text-gray-100">
                  {notification.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-gray-400">
                  {notification.message}
                </span>
                <span className="mt-1 block text-[10px] text-gray-400">
                  {getRelativeTime(notification.date)}
                </span>
              </span>
              <span className="ml-auto mt-1 flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium capitalize text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {notification.status}
              </span>
            </button>
          );
        })
      )}
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close notifications" : "Open notifications"}
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

      {/* ===== Mobile bottom sheet (md se chhota) ===== */}
      {isOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-[90] bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="Notifications"
            className="fixed inset-x-0 bottom-0 z-[95] mx-auto max-h-[80vh] w-full overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  Notifications
                </h3>
                <p className="text-xs text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close notifications"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="max-h-[calc(80vh-56px)] overflow-y-auto pb-4">
              {renderNotificationList}
            </div>
          </div>
        </div>
      )}

      {/* ===== Desktop dropdown (md se upar) ===== */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-11 z-50 hidden w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl md:block dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                Notifications
              </h3>
              <p className="text-xs text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>
          {renderNotificationList}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
