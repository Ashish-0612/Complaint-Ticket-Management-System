import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, LoaderCircle, Ticket, User, CalendarClock, Activity } from "lucide-react";
import API from "../../api/axios";
import NotificationBell from "../../components/NotificationBell";

const statusSteps = ["open", "in-progress", "resolved"];

const TrackStatus = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await API.get("/tickets", { params: { limit: 1000 } });
        const userTickets = response.data.data || [];
        setTickets(userTickets);
        if (userTickets.length > 0) setSelectedId(String(userTickets[0].id));
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const selectedTicket = tickets.find((ticket) => String(ticket.id) === selectedId);

  useEffect(() => {
    if (!selectedTicket) return;
    const fetchLogs = async () => {
      setLogsLoading(true);
      try {
        const response = await API.get(`/tickets/${selectedTicket.id}/comments/logs`);
        setLogs(response.data.data || []);
      } catch {
        setLogs([]);
      } finally {
        setLogsLoading(false);
      }
    };
    fetchLogs();
  }, [selectedTicket]);

  const currentStep = selectedTicket?.status === "reopened"
    ? 1
    : statusSteps.indexOf(selectedTicket?.status);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "Not set";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="hidden w-56 flex-shrink-0 flex-col bg-gray-900 md:flex">
        <div className="border-b border-gray-800 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600"><Ticket size={16} className="text-white" /></div>
            <div><p className="text-sm font-bold leading-none text-white">Complaint</p><p className="mt-0.5 text-xs text-gray-400">Management System</p></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4">
          <button onClick={() => navigate("/dashboard")} className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white"><Ticket size={17} /> My Complaints</button>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard")} className="flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-gray-800"><ArrowLeft size={16} /> Back</button>
            <div className="h-5 w-px bg-gray-200" />
            <div><h1 className="text-xl font-bold text-gray-800">Track Complaint</h1><p className="text-xs text-gray-500">Follow your ticket progress</p></div>
          </div>
          <NotificationBell tickets={tickets} />
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-4xl space-y-5">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <label className="mb-2 block text-sm font-semibold text-gray-700" htmlFor="track-ticket">Select complaint</label>
              {loading ? <p className="text-sm text-gray-400">Loading complaints...</p> : tickets.length === 0 ? <p className="text-sm text-gray-500">No complaints found.</p> : (
                <select id="track-ticket" value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="filter-control w-full cursor-pointer rounded-xl border px-3 py-2.5 text-sm outline-none">
                  {tickets.map((ticket) => <option key={ticket.id} value={ticket.id}>#{ticket.id} · {ticket.title}</option>)}
                </select>
              )}
            </section>

            {selectedTicket && (
              <>
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                    <div><p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ticket #{selectedTicket.id}</p><h2 className="mt-1 text-xl font-bold text-gray-800">{selectedTicket.title}</h2></div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{selectedTicket.status}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {statusSteps.map((step, index) => {
                      const complete = currentStep >= index;
                      return <div key={step} className="flex items-center gap-2"><div className={`flex h-9 w-9 items-center justify-center rounded-full ${complete ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>{complete ? <CheckCircle size={17} /> : <Clock size={17} />}</div><div><p className="text-xs font-semibold capitalize text-gray-700">{step.replace("-", " ")}</p><p className="text-[11px] text-gray-400">{complete ? "Completed" : "Pending"}</p></div></div>;
                    })}
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><User size={17} className="mb-2 text-blue-600" /><p className="text-xs text-gray-400">Assigned agent</p><p className="text-sm font-semibold text-gray-700">{selectedTicket.agent?.name || "Not assigned"}</p></div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><CalendarClock size={17} className="mb-2 text-orange-600" /><p className="text-xs text-gray-400">Due date / SLA</p><p className="text-sm font-semibold text-gray-700">{formatDate(selectedTicket.dueDate)}</p></div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"><Activity size={17} className="mb-2 text-green-600" /><p className="text-xs text-gray-400">Last updated</p><p className="text-sm font-semibold text-gray-700">{formatDate(selectedTicket.updatedAt)}</p></div>
                </section>

                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-600" /><h3 className="font-bold text-gray-800">Progress activity</h3></div>{logsLoading ? <LoaderCircle className="animate-spin text-blue-600" size={20} /> : logs.length === 0 ? <p className="text-sm text-gray-400">No activity recorded yet.</p> : <div className="space-y-3">{logs.map((log) => <div key={log.id} className="border-l-2 border-blue-200 pl-3"><p className="text-sm font-medium text-gray-700">{log.details || log.action}</p><p className="text-xs text-gray-400">{formatDate(log.createdAt)}</p></div>)}</div>}</section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrackStatus;
