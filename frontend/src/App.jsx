import { useState } from "react"
import "./App.css"

import Dashboard from "./pages/Dashboard"
import RiskMonitor from "./pages/RiskMonitor"
import Transactions from "./pages/Transactions"
import Alerts from "./pages/Alerts"
import Models from "./pages/Models"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"

import EcommerceDashboard from "./pages/ecommerce/EcommerceDashboard"
import EcommerceAnalysis from "./pages/ecommerce/EcommerceAnalysis"
import EcommerceAlerts from "./pages/ecommerce/EcommerceAlerts"
import EcommerceModel from "./pages/ecommerce/EcommerceModel"
import EcommerceReports from "./pages/ecommerce/EcommerceReports"


const financialNav = [
  { icon: "▦", label: "Dashboard" },
  { icon: "◈", label: "Risk Monitor" },
  { icon: "⇄", label: "Transactions" },
  { icon: "♢", label: "Alerts" },
  { icon: "◫", label: "Models" },
  { icon: "▤", label: "Reports" },
  { icon: "⚙", label: "Settings" }
]

const ecommerceNav = [
  { icon: "▦", label: "Dashboard" },
  { icon: "🛒", label: "Transaction Analysis" },
  { icon: "♢", label: "Alerts" },
  { icon: "◫", label: "Model" },
  { icon: "▤", label: "Reports" }
]


function App() {

  const [activePage, setActivePage] = useState("Dashboard")
  const [activeSystem, setActiveSystem] = useState("financial")


  const openFinancialPage = (page) => {
    setActiveSystem("financial")
    setActivePage(page)
  }


  const openEcommercePage = (page) => {
    setActiveSystem("ecommerce")
    setActivePage(page)
  }


  const renderPage = () => {

    if (activeSystem === "ecommerce") {

      switch (activePage) {

        case "Transaction Analysis":
          return <EcommerceAnalysis />

        case "Alerts":
          return <EcommerceAlerts />

        case "Model":
          return <EcommerceModel />

        case "Reports":
          return <EcommerceReports />

        default:
          return <EcommerceDashboard />
      }

    }


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
        return <Dashboard />
    }
  }


  return (
    <div className="app">

      {/* ================= TOP BAR ================= */}

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


      {/* ================= LEFT SIDEBAR ================= */}

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
                activeSystem === "financial" &&
                activePage === item.label
                  ? "model-nav-item active"
                  : "model-nav-item"
              }
              onClick={() => openFinancialPage(item.label)}
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


      {/* ================= CENTER ================= */}

      <main className="center-content">

        <div className="center-page">

          {renderPage()}

        </div>

      </main>


      {/* ================= RIGHT SIDEBAR ================= */}

      <aside className="ecommerce-sidebar">

        <div className="ecommerce-header">

          <div className="system-title">
            E-COMMERCE FRAUD
          </div>

          <div className="model-status ecommerce-status">
            <span></span>
            Model 2 Active
          </div>

        </div>


        <nav className="model-nav ecommerce-nav">

          {ecommerceNav.map((item) => (

            <button
              key={item.label}
              className={
                activeSystem === "ecommerce" &&
                activePage === item.label
                  ? "model-nav-item active"
                  : "model-nav-item"
              }
              onClick={() => openEcommercePage(item.label)}
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

      </aside>


      {/* ================= FOOTER ================= */}

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