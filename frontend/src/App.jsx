import { useState } from "react"
import "./App.css"

import Dashboard from "./pages/Dashboard"
import RiskMonitor from "./pages/RiskMonitor"
import Transactions from "./pages/Transactions"
import Alerts from "./pages/Alerts"
import Models from "./pages/Models"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"

const navItems = [
  { icon: "▦", label: "Dashboard" },
  { icon: "◈", label: "Risk Monitor" },
  { icon: "⇄", label: "Transactions" },
  { icon: "♢", label: "Alerts" },
  { icon: "◫", label: "Models" },
  { icon: "▤", label: "Reports" },
  { icon: "⚙", label: "Settings" }
]

function App() {
  const [active, setActive] = useState("Dashboard")

  const renderPage = () => {
    switch (active) {
      case "Risk Monitor":
        return <RiskMonitor />

      case "Transactions":
        return <Transactions />

      case "Alerts":
        return <Alerts />

      case "Models":
        return <Models />

      case "Reports":
        return <Reports />

      case "Settings":
        return <Settings />

      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NEXRA</span>
        </div>

        <nav>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${
                active === item.label ? "active" : ""
              }`}
              onClick={() => setActive(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div className="avatar">S</div>

          <div>
            <strong>Sarthak</strong>
            <span>Analyst</span>
          </div>
        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div className="search">
            <span>⌕</span>
            <input placeholder="Search anything..." />
          </div>

          <div className="top-actions">
            <button>♧</button>
            <button>♢</button>
            <button>⚙</button>

            <div className="profile-avatar">
              SP
            </div>
          </div>

        </header>

        <section className="content">

          {renderPage()}

        </section>

      </main>

    </div>
  )
}

export default App