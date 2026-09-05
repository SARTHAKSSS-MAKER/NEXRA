import { useState } from "react"
import "./App.css"

import Dashboard from "./pages/Dashboard"
import RiskMonitor from "./pages/RiskMonitor"
import Transactions from "./pages/Transactions"
import Alerts from "./pages/Alerts"
import Models from "./pages/Models"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"

const financialNav = [
  { icon: "▦", label: "Dashboard" },
  { icon: "◈", label: "Risk Monitor" },
  { icon: "⇄", label: "Transactions" },
  { icon: "♢", label: "Alerts" },
  { icon: "◫", label: "Models" },
  { icon: "▤", label: "Reports" },
  { icon: "⚙", label: "Settings" }
]

function App() {
  const [activePage, setActivePage] = useState("Dashboard")

  const renderPage = () => {
    switch (activePage) {
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
        return (
          <Dashboard
            onNavigate={setActivePage}
          />
        )
    }
  }

  return (
    <div className="app">

      <header className="topbar">

        <div className="top-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search anything..."
          />
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


      <aside className="financial-sidebar">

        <div className="sidebar-brand">

          <span className="brand-mark">
            N
          </span>

          <span>NEXRA</span>

        </div>


        <div className="system-title">
          FINANCIAL FRAUD
        </div>


        <div className="model-status financial-status">
          <span></span>
          Model 1 Active
        </div>


        <nav className="model-nav">

          {financialNav.map((item) => (

            <button
              key={item.label}
              className={
                activePage === item.label
                  ? "model-nav-item active"
                  : "model-nav-item"
              }
              onClick={() => setActivePage(item.label)}
            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </button>

          ))}

        </nav>


        <div className="sidebar-profile">

          <div className="avatar">
            S
          </div>

          <div>
            <strong>Sarthak</strong>
            <span>Analyst</span>
          </div>

        </div>

      </aside>


      <main className="center-content">

        <div className="center-page">
          {renderPage()}
        </div>

      </main>


      <footer className="app-footer">

        <span>
          © 2025 NEXRA AI. All rights reserved.
        </span>

        <span>
          Secure • Reliable • Intelligent
        </span>

      </footer>

    </div>
  )
}

export default App