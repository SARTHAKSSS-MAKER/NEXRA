import { useState } from "react"
import "./App.css"

const navItems = [
  { icon: "▦", label: "Dashboard" },
  { icon: "◈", label: "Risk Monitor" },
  { icon: "⇄", label: "Transactions" },
  { icon: "♢", label: "Alerts" },
  { icon: "◫", label: "Models" },
  { icon: "▤", label: "Reports" },
  { icon: "⚙", label: "Settings" }
]

const metrics = [
  { label: "Risk Score", value: "82", suffix: "/100", status: "High Risk", trend: "+8.4%", type: "danger" },
  { label: "Transactions", value: "1,389", trend: "+20.1%", type: "safe" },
  { label: "Alerts", value: "28", trend: "+8.7%", type: "danger" },
  { label: "Model Accuracy", value: "95.1%", trend: "+3.1%", type: "safe" }
]

const alerts = [
  { title: "Unusual Transaction Pattern", time: "2m ago", level: "High" },
  { title: "Location Anomaly Detected", time: "15m ago", level: "High" },
  { title: "Velocity Check Failed", time: "32m ago", level: "Medium" },
  { title: "Device Fingerprint Change", time: "1h ago", level: "Medium" }
]

function App() {
  const [active, setActive] = useState("Dashboard")

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
              className={`nav-item ${active === item.label ? "active" : ""}`}
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
            <div className="profile-avatar">SP</div>
          </div>
        </header>

        <section className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">REAL-TIME INTELLIGENCE</p>
              <h1>{active === "Dashboard" ? "Dashboard Overview" : active}</h1>
              <p className="subtitle">Real-time risk intelligence at a glance</p>
            </div>

            <button className="date-selector">
              Today <span>⌄</span>
            </button>
          </div>

          <section className="metrics">
            {metrics.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <div className="metric-top">
                  <span>{metric.label}</span>
                  <span className="metric-dot"></span>
                </div>

                <div className="metric-value">
                  {metric.value}
                  {metric.suffix && <small>{metric.suffix}</small>}
                </div>

                {metric.status && (
                  <div className="risk-status">{metric.status}</div>
                )}

                <div className={`metric-trend ${metric.type}`}>
                  {metric.type === "safe" ? "↗" : "↗"} {metric.trend}
                  <span>vs last period</span>
                </div>

                <div className={`sparkline ${metric.type}`}>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>
            ))}
          </section>

          <section className="grid-two">
            <div className="panel distribution">
              <div className="panel-header">
                <div>
                  <h2>Risk Distribution</h2>
                  <p>Current exposure classification</p>
                </div>
                <button className="panel-action">24H</button>
              </div>

              <div className="distribution-body">
                <div className="donut">
                  <div className="donut-center">
                    <strong>1,389</strong>
                    <span>Total</span>
                  </div>
                </div>

                <div className="legend">
                  <div>
                    <span className="legend-dot high"></span>
                    <label>High Risk</label>
                    <strong>25%</strong>
                  </div>
                  <div>
                    <span className="legend-dot medium"></span>
                    <label>Medium Risk</label>
                    <strong>40%</strong>
                  </div>
                  <div>
                    <span className="legend-dot low"></span>
                    <label>Low Risk</label>
                    <strong>35%</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel alerts-panel">
              <div className="panel-header">
                <div>
                  <h2>Recent Alerts</h2>
                  <p>Latest detected anomalies</p>
                </div>
                <button className="view-all">View all →</button>
              </div>

              <div className="alerts-list">
                {alerts.map((alert) => (
                  <div className="alert-row" key={alert.title}>
                    <div className="alert-info">
                      <span className="alert-indicator"></span>
                      <div>
                        <strong>{alert.title}</strong>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                    <span className={`level ${alert.level.toLowerCase()}`}>
                      {alert.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid-two lower">
            <div className="panel chart-panel">
              <div className="panel-header">
                <div>
                  <h2>Risk Over Time</h2>
                  <p>Aggregated risk score</p>
                </div>
                <button className="panel-action">24 Hours ⌄</button>
              </div>

              <div className="chart">
                <div className="chart-grid">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                <svg viewBox="0 0 700 220" preserveAspectRatio="none">
                  <polyline
                    points="0,175 35,155 70,164 105,132 140,145 175,108 210,128 245,92 280,116 315,82 350,101 385,72 420,88 455,63 490,78 525,52 560,76 595,48 630,67 665,38 700,58"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>

                <div className="chart-labels">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                </div>
              </div>
            </div>

            <div className="panel factors">
              <div className="panel-header">
                <div>
                  <h2>Top Risk Factors</h2>
                  <p>Model feature contribution</p>
                </div>
              </div>

              <div className="factor-list">
                <div className="factor">
                  <div>
                    <span>Transaction Amount</span>
                    <strong>45%</strong>
                  </div>
                  <div className="bar">
                    <i style={{ width: "45%" }}></i>
                  </div>
                </div>

                <div className="factor">
                  <div>
                    <span>New Device</span>
                    <strong>28%</strong>
                  </div>
                  <div className="bar">
                    <i style={{ width: "28%" }}></i>
                  </div>
                </div>

                <div className="factor">
                  <div>
                    <span>Location Change</span>
                    <strong>17%</strong>
                  </div>
                  <div className="bar">
                    <i style={{ width: "17%" }}></i>
                  </div>
                </div>

                <div className="factor">
                  <div>
                    <span>IP Risk Score</span>
                    <strong>10%</strong>
                  </div>
                  <div className="bar">
                    <i style={{ width: "10%" }}></i>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App