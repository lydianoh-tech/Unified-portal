import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/PageHeader";

export default function DashboardPage({ roleGroup = "provider" }) {
  const { user } = useAuth();

  const isCustomerPortal = roleGroup === "customer";

  const modules = isCustomerPortal
    ? [
        {
          title: "My Bookings",
          desc: "Book and track your appointments with providers",
        },
        { title: "Marketplace", desc: "Browse and buy from trusted providers" },
        {
          title: "Media Library",
          desc: "Manage your shared media and uploads",
        },
        {
          title: "Real-time Chat",
          desc: "Message providers and support instantly",
        },
        { title: "Help Desk", desc: "Raise issues and follow support updates" },
      ]
    : [
        {
          title: "Service Booking",
          desc: "Manage incoming booking requests and schedules",
        },
        {
          title: "Marketplace",
          desc: "Sell and manage your listed products/services",
        },
        {
          title: "Media Library",
          desc: "Publish and organize your media assets",
        },
        {
          title: "Real-time Chat",
          desc: "Communicate with customers in real-time",
        },
        {
          title: "Help Desk",
          desc: "Track support tickets and team responses",
        },
        { title: "Task Manager", desc: "Plan and assign operational tasks" },
        {
          title: "Security Center",
          desc: "SIEM-style logs and threat monitoring",
          admin: true,
        },
        {
          title: "Network Monitor",
          desc: "Platform health and activity metrics",
          admin: true,
        },
      ];

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.name}`}
        description={
          isCustomerPortal
            ? "Your customer portal for bookings, purchases, and support."
            : "Your provider portal for operations, service delivery, and support."
        }
      />
      <div className="card-grid">
        {modules
          .filter((m) => !m.admin || user?.role === "ADMIN")
          .map((mod) => (
            <article key={mod.title} className="card">
              <h3>{mod.title}</h3>
              <p style={{ margin: 0, color: "#cbd5e1" }}>{mod.desc}</p>
            </article>
          ))}
      </div>
    </>
  );
}
