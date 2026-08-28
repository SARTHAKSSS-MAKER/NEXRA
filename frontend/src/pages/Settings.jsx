import { useEffect, useState } from "react"
import { getSettings, updateSettings } from "../api"

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    real_time_monitoring: true,
    auto_block_high_risk: false,
    risk_threshold: 80,
    model_version: "v2.4.1",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Load settings from backend
  useEffect(() => {
    getSettings()
      .then((data) => {
        setSettings(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Settings API error:", err)
        setError("Unable to load NEXRA settings")
        setLoading(false)
      })
  }, [])

  // Toggle setting
  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    setMessage("")
  }

  // Update input/select
  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    setMessage("")
  }

  // Save settings to backend
  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const dataToSend = {
        notifications: settings.notifications,
        real_time_monitoring: settings.real_time_monitoring,
        auto_block_high_risk: settings.auto_block_high_risk,
        risk_threshold: Number(settings.risk_threshold),
        model_version: settings.model_version,
      }

      const response = await updateSettings(dataToSend)

      setSettings(response.settings)
      setMessage("Settings saved successfully")
    } catch (err) {
      console.error("Settings update error:", err)
      setError("Unable to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page settings-page">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#aaa",
          }}
        >
          Loading NEXRA settings...
        </div>
      </div>
    )
  }

  if (error && !settings) {
    return (
      <div className="page settings-page">
        <div
          style={{
            padding: "60px",
            textAlign: "center",
            color: "#ff6b6b",
          }}
        >
          {error}
        </div>
      </div>
    )
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

          <button
            type="button"
            className="settings-outline-btn"
          >
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


      {/* SETTINGS GRID */}
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
              enabled={settings.real_time_monitoring}
              onClick={() =>
                toggleSetting("real_time_monitoring")
              }
            />

            <SettingToggle
              title="High-Risk Alerts"
              description="Receive alerts for high-risk transactions"
              enabled={settings.notifications}
              onClick={() =>
                toggleSetting("notifications")
              }
            />

            <SettingToggle
              title="Automatic High-Risk Blocking"
              description="Automatically block transactions above the risk threshold"
              enabled={settings.auto_block_high_risk}
              onClick={() =>
                toggleSetting("auto_block_high_risk")
              }
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

              <label>
                Risk Threshold
              </label>

              <div className="input-with-suffix">

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.risk_threshold}
                  onChange={(e) =>
                    handleChange(
                      "risk_threshold",
                      e.target.value
                    )
                  }
                />

                <span>/100</span>

              </div>

            </div>


            <div className="setting-field">

              <label>
                Model Version
              </label>

              <select
                value={settings.model_version}
                onChange={(e) =>
                  handleChange(
                    "model_version",
                    e.target.value
                  )
                }
              >
                <option value="v2.4.1">
                  v2.4.1
                </option>

                <option value="v2.4.0">
                  v2.4.0
                </option>

                <option value="v2.3.8">
                  v2.3.8
                </option>
              </select>

            </div>


            <SettingToggle
              title="Automatic Investigation"
              description="Automatically investigate critical transactions"
              enabled={settings.auto_block_high_risk}
              onClick={() =>
                toggleSetting("auto_block_high_risk")
              }
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
              title="Security Notifications"
              description="Receive important security events"
              enabled={settings.notifications}
              onClick={() =>
                toggleSetting("notifications")
              }
            />

            <SettingToggle
              title="Real-time Monitoring"
              description="Receive updates while transactions are analyzed"
              enabled={settings.real_time_monitoring}
              onClick={() =>
                toggleSetting("real_time_monitoring")
              }
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
              title="Automatic High-Risk Blocking"
              description="Block transactions that exceed the configured risk threshold"
              enabled={settings.auto_block_high_risk}
              onClick={() =>
                toggleSetting("auto_block_high_risk")
              }
            />


            <div className="security-action">

              <div>
                <strong>Change Password</strong>

                <span>
                  Update your account password
                </span>
              </div>

              <button type="button">
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

              <button type="button">
                View
              </button>

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
            enabled={false}
            onClick={() => {}}
          />

          <SettingToggle
            title="Interface Animations"
            description="Enable subtle interface transitions"
            enabled={true}
            onClick={() => {}}
          />

        </div>

      </section>


      {/* SAVE BAR */}
      <div className="settings-save-bar">

        <div>

          <strong>
            {message || "Settings ready"}
          </strong>

          <span>
            {error
              ? error
              : "Changes are saved to the NEXRA backend"}
          </span>

        </div>


        <button
          type="button"
          className="settings-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
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

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>


      <button
        type="button"
        className={`toggle ${
          enabled ? "active" : ""
        }`}
        onClick={onClick}
        aria-label={title}
      >

        <span></span>

      </button>

    </div>
  )
}


export default Settings