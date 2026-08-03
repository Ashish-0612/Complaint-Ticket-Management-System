import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Bell, BarChart3, CheckCircle, Clock, Settings as SettingsIcon, Ticket } from "lucide-react";
import API from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const WorkspacePage = ({ mode }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (mode === "reports" || mode === "activity") {
      API.get("/tickets", { params: { limit: 1000 } })
        .then((response) => setTickets(response.data.data || []))
        .catch(() => setTickets([]));
    }
  }, [mode]); 

  const config = {
    announcements: { title: "Announcements", subtitle: "Latest updates from the support team", icon: Bell },
    activity: { title: "My Activity", subtitle: "Your recent ticket activity", icon: Activity },
    reports: { title: "Reports", subtitle: "A quick overview of ticket performance", icon: BarChart3 },
    settings: { title: "Settings", subtitle: "Manage your workspace preferences", icon: SettingsIcon },
  }[mode];
  const Icon = config.icon;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <button onClick={() => navigate(-1)} className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-gray-800"><ArrowLeft size={16} /> Back</button>
          <div className="mb-6 flex items-start gap-3"><div className="rounded-xl bg-blue-600 p-3 text-white"><Icon size={22} /></div><div><h1 className="text-2xl font-bold text-gray-800">{config.title}</h1><p className="text-sm text-gray-500">{config.subtitle}</p></div></div>

          {mode === "announcements" && <div className="grid gap-4 md:grid-cols-3">{[
            ["System Update", "The complaint system is running normally. New tickets are reviewed by the support team.", "Today", "bg-blue-50"],
            ["Attachment Support", "You can attach images and documents up to 5 MB to your complaint.", "Recently", "bg-green-50"],
            ["Resolution Reminder", "Please add a comment if your resolved complaint still needs attention.", "This week", "bg-orange-50"],
          ].map(([title, text, date, color]) => <article key={title} className={`rounded-2xl border border-gray-100 p-5 shadow-sm ${color}`}><h2 className="font-bold text-gray-800">{title}</h2><p className="mt-2 text-sm text-gray-600">{text}</p><p className="mt-4 text-xs text-gray-400">{date}</p></article>)}</div>}

          {mode === "activity" && <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="space-y-4">{tickets.slice(0, 10).map((ticket) => <button key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)} className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50"><div className="rounded-lg bg-green-50 p-2 text-green-600"><Activity size={16} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-gray-700">Ticket #{ticket.id} · {ticket.title}</p><p className="text-xs text-gray-400">Status: {ticket.status} · {new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()}</p></div></button>)}{tickets.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No activity yet.</p>}</div></section>}

          {mode === "reports" && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
            ["Total tickets", tickets.length, Ticket, "bg-blue-50 text-blue-600"],
            ["Open", tickets.filter((ticket) => ticket.status === "open").length, Clock, "bg-orange-50 text-orange-600"],
            ["In progress", tickets.filter((ticket) => ticket.status === "in-progress").length, Activity, "bg-yellow-50 text-yellow-600"],
            ["Resolved", tickets.filter((ticket) => ticket.status === "resolved").length, CheckCircle, "bg-green-50 text-green-600"],
          ].map(([label, value, StatIcon, color]) => <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className={`mb-3 inline-flex rounded-xl p-3 ${color}`}><StatIcon size={20} /></div><p className="text-2xl font-bold text-gray-800">{value}</p><p className="mt-1 text-sm text-gray-500">{label}</p></div>)}</div>}

          {mode === "settings" && <section className="max-w-2xl rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between border-b border-gray-100 py-4"><div><h2 className="font-bold text-gray-800">Appearance</h2><p className="mt-1 text-sm text-gray-500">Choose the theme for this device.</p></div><button type="button" onClick={toggleTheme} className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">{isDark ? "Use light mode" : "Use dark mode"}</button></div><div className="flex items-center justify-between py-4"><div><h2 className="font-bold text-gray-800">Notifications</h2><p className="mt-1 text-sm text-gray-500">Notification preferences are available from the bell menu.</p></div><Bell size={20} className="text-blue-600" /></div></section>}
        </div>
      </main>
    </div>
  );
};

export default WorkspacePage;
