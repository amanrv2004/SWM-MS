import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  X, 
  Volume2, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  MessageSquare, 
  Info,
  Clock,
  RotateCcw
} from 'lucide-react';

function formatNotificationTime(timestamp) {
  if (!timestamp) return 'Just now';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return String(timestamp);
    
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    
    if (diffSec < 45) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Recently';
  }
}

function getNotificationVisual(type) {
  switch (type) {
    case 'doorstep':
    case 'siren':
      return {
        icon: Volume2,
        bg: 'bg-rose-100 text-rose-600 border-rose-200',
        badge: '🚨 DOORSTEP'
      };
    case 'nearby':
    case 'proximity':
      return {
        icon: Bell,
        bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        badge: '🔔 NEARBY'
      };
    case 'pickup':
      return {
        icon: CheckCircle2,
        bg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        badge: '✅ PICKED UP'
      };
    case 'points':
      return {
        icon: Sparkles,
        bg: 'bg-amber-100 text-amber-700 border-amber-200',
        badge: '🎉 POINTS'
      };
    case 'refund':
      return {
        icon: RotateCcw,
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
        badge: '💰 REFUND'
      };
    case 'duty':
      return {
        icon: Truck,
        bg: 'bg-blue-100 text-blue-700 border-blue-200',
        badge: '🚚 SHIFT'
      };
    case 'emergency':
      return {
        icon: AlertTriangle,
        bg: 'bg-orange-100 text-orange-700 border-orange-200',
        badge: '⚠️ EMERGENCY'
      };
    case 'complaint':
      return {
        icon: MessageSquare,
        bg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        badge: '📢 TICKET'
      };
    default:
      return {
        icon: Info,
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        badge: 'ℹ️ NOTICE'
      };
  }
}

export default function ResidentNotificationBell({
  notifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onClearAll,
  onNotificationClick
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`relative p-2.5 rounded-2xl border transition flex items-center justify-center cursor-pointer ${
          isOpen
            ? 'bg-[#00B074]/10 border-[#00B074] text-[#00B074]'
            : 'bg-white border-slate-200 text-slate-600 hover:text-[#00B074] hover:bg-slate-50 shadow-xs'
        }`}
        title="View Notifications"
        aria-label="View notifications"
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-[#00B074]' : ''}`} />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[10px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-in zoom-in-50">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-84 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#00B074]/15 text-[#00B074] flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#0F172A] leading-tight">Notifications</h3>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  type="button"
                  onClick={() => onMarkAllRead()}
                  className="p-1.5 text-xs text-[#00B074] hover:bg-emerald-50 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="text-[11px] hidden sm:inline">Mark read</span>
                </button>
              )}
              {notifications.length > 0 && onClearAll && (
                <button
                  type="button"
                  onClick={() => onClearAll()}
                  className="p-1.5 text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          {notifications.length > 0 && (
            <div className="px-5 pt-3 pb-2 border-b border-slate-100 flex items-center gap-2 bg-white text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#00B074] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-[#00B074] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          )}

          {/* Notification Items List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => {
                const visual = getNotificationVisual(item.type || item.category);
                const IconComponent = visual.icon;
                const isUnread = !item.read;

                return (
                  <div
                    key={item.id}
                    onClick={() => onNotificationClick && onNotificationClick(item.id)}
                    className={`p-4 transition cursor-pointer flex items-start gap-3.5 hover:bg-slate-50/90 ${
                      isUnread ? 'bg-emerald-50/30' : 'bg-white'
                    }`}
                  >
                    {/* Visual Icon Badge */}
                    <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${visual.bg}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-xs text-[#0F172A] truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          <span>{formatNotificationTime(item.createdAt || item.timestamp)}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed break-words font-medium">
                        {item.message}
                      </p>

                      <div className="pt-0.5 flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          {visual.badge}
                        </span>
                        {isUnread && (
                          <span className="inline-block w-2 h-2 rounded-full bg-[#00B074]" title="Unread"></span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-700">No Notifications</h4>
                <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                  {filter === 'unread'
                    ? 'All notifications have been read.'
                    : 'Real-time driver updates, approach sirens, and pickup points will appear here.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Track My Trash Live Dispatch</span>
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  type="button"
                  onClick={() => onMarkAllRead()}
                  className="font-bold text-[#00B074] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
