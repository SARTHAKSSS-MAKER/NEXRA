import { useState } from "react"

function Settings() {
  const [settings, setSettings] = useState({
    fraudDetection: true,
    highRiskAlerts: true,
    deviceDetection: true,
    behaviorMonitoring: true,
    autoInvestigation: true,
    criticalAlerts: true,
    dailySummary: true,
    modelReports: true,
    securityNotifications: true,
    twoFactor: true,
    compactDashboard: false,
    animations: true,
  })

  const [sensitivity, setSensitivity] = useState("High")
  const [timeout, setTimeout] = useState("30 Minutes")

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="page settings-page">

      {/* HEADER */}
      <div className="page-heading settings-heading">
        <div>
          <p className="eyebrow">SYSTEM CONFIGURATION</p>

          <h1>Settings</h1>

          <p className="subtitle">
            Manage your NEXRA platform preferences and security controls
          </p>
        </div>
      </div>


      {/* PROFILE */}
      <section className="panel settings-profile">

        <div className="settings-section-header">
          <div>
            <h2>Profile</h2>
            <p>Your NEXRA account information</p>
          </div>

          <button className="settings-outline-btn">
            Edit Profile
          </button>
        </div>


        <div className="profile-content">

          <div className="profile-avatar">
            S
          </div>

          <div className="profile-info">

            <div className="profile-name">
              Sarthak
            </div>

            <div className="profile-role">
              Analyst
            </div>

          </div>


          <div className="profile-details">

            <div className="profile-detail">
              <span>Email</span>
              <strong>sarthak@nexra.ai</strong>
            </div>

            <div className="profile-detail">
              <span>Role</span>
              <strong>Security Analyst</strong>
            </div>

            <div className="profile-detail">
              <span>Access Level</span>
              <strong>Advanced</strong>
            </div>

          </div>

        </div>

      </section>


      {/* TWO COLUMN SETTINGS */}
      <div className="settings-grid">


        {/* DETECTION PREFERENCES */}
        <section className="panel settings-card">

          <div className="settings-section-header">
            <div>
              <h2>Detection Preferences</h2>

              <p>
                Configure fraud detection behavior
              </p>
            </div>
          </div>


          <div className="settings-list">

            <SettingToggle
              title="Real-time Fraud Detection"
              description="Analyze transactions as they occur"
              enabled={settings.fraudDetection}
              onClick={() => toggleSetting("fraudDetection")}
            />

            <SettingToggle
              title="High-Risk Alerts"
              description="Receive alerts for high-risk transactions"
              enabled={settings.highRiskAlerts}
              onClick={() => toggleSetting("highRiskAlerts")}
            />

            <SettingToggle
              title="New Device Detection"
              description="Detect transactions from unfamiliar devices"
              enabled={settings.deviceDetection}
              onClick={() => toggleSetting("deviceDetection")}
            />

            <SettingToggle
              title="Behavior Monitoring"
              description="Monitor abnormal user behavior patterns"
              enabled={settings.behaviorMonitoring}
              onClick={() => toggleSetting("behaviorMonitoring")}
            />

          </div>

        </section>


        {/* RISK ENGINE */}
        <section className="panel settings-card">

          <div className="settings-section-header">
            <div>
              <h2>Risk Engine</h2>

              <p>
                Configure risk scoring behavior
              </p>
            </div>
          </div>


          <div className="settings-fields">

            <div className="setting-field">

              <label>Risk Sensitivity</label>

              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Very High</option>
              </select>

            </div>


            <div className="setting-field">

              <label>Transaction Threshold</label>

              <div className="input-with-prefix">
                <span>₹</span>

                <input
                  type="number"
                  defaultValue="50000"
                />
              </div>

            </div>


            <div className="setting-field">

              <label>Model Confidence Threshold</label>

              <div className="input-with-suffix">
                <input
                  type="number"
                  defaultValue="85"
                  min="0"
                  max="100"
                />

                <span>%</span>
              </div>

            </div>


            <SettingToggle
              title="Automatic Investigation"
              description="Automatically investigate critical transactions"
              enabled={settings.autoInvestigation}
              onClick={() => toggleSetting("autoInvestigation")}
            />

          </div>

        </section>


        {/* NOTIFICATIONS */}
        <section className="panel settings-card">

          <div className="settings-section-header">
            <div>
              <h2>Notifications</h2>

              <p>
                Control security and system notifications
              </p>
            </div>
          </div>


          <div className="settings-list">

            <SettingToggle
              title="Critical Alerts"
              description="Immediate notifications for critical threats"
              enabled={settings.criticalAlerts}
              onClick={() => toggleSetting("criticalAlerts")}
            />

            <SettingToggle
              title="Daily Risk Summary"
              description="Receive a daily fraud intelligence summary"
              enabled={settings.dailySummary}
              onClick={() => toggleSetting("dailySummary")}
            />

            <SettingToggle
              title="Model Performance Reports"
              description="Receive AI model performance updates"
              enabled={settings.modelReports}
              onClick={() => toggleSetting("modelReports")}
            />

            <SettingToggle
              title="Security Notifications"
              description="Important account and security events"
              enabled={settings.securityNotifications}
              onClick={() => toggleSetting("securityNotifications")}
            />

          </div>

        </section>


        {/* SECURITY */}
        <section className="panel settings-card">

          <div className="settings-section-header">
            <div>
              <h2>Security</h2>

              <p>
                Manage account security controls
              </p>
            </div>
          </div>


          <div className="settings-list">

            <SettingToggle
              title="Two-Factor Authentication"
              description="Protect your account with an additional verification step"
              enabled={settings.twoFactor}
              onClick={() => toggleSetting("twoFactor")}
            />


            <div className="security-action">

              <div>
                <strong>Change Password</strong>

                <span>
                  Update your account password
                </span>
              </div>

              <button>
                Change
              </button>

            </div>


            <div className="security-action">

              <div>
                <strong>Login Activity</strong>

                <span>
                  Review recent account sessions
                </span>
              </div>

              <button>
                View
              </button>

            </div>


            <div className="setting-field">

              <label>Session Timeout</label>

              <select
                value={timeout}
                onChange={(e) => setTimeout(e.target.value)}
              >
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
                <option>4 Hours</option>
              </select>

            </div>

          </div>

        </section>

      </div>


      {/* APPEARANCE */}
      <section className="panel appearance-panel">

        <div className="settings-section-header">

          <div>
            <h2>Appearance</h2>

            <p>
              Customize your NEXRA workspace
            </p>
          </div>

        </div>


        <div className="appearance-options">

          <SettingToggle
            title="Compact Dashboard"
            description="Reduce spacing for a denser workspace"
            enabled={settings.compactDashboard}
            onClick={() => toggleSetting("compactDashboard")}
          />

          <SettingToggle
            title="Interface Animations"
            description="Enable subtle interface transitions"
            enabled={settings.animations}
            onClick={() => toggleSetting("animations")}
          />

        </div>

      </section>


      {/* SAVE BAR */}
      <div className="settings-save-bar">

        <div>
          <strong>Settings updated</strong>

          <span>
            Changes are applied automatically
          </span>
        </div>

        <button className="settings-save-btn">
          Save Changes
        </button>

      </div>

    </div>
  )
}


/* TOGGLE COMPONENT */

function SettingToggle({
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div className="setting-toggle-row">

      <div className="setting-toggle-text">

        <strong>{title}</strong>

        <span>{description}</span>

      </div>


      <button
        type="button"
        className={`toggle ${enabled ? "active" : ""}`}
        onClick={onClick}
        aria-label={title}
      >

        <span></span>

      </button>

    </div>
  )
}


export default Settings