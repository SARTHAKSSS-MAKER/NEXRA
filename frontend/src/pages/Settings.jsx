import { useEffect, useState } from "react"
import { getSettings, updateSettings } from "../api"

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    real_time_monitoring: true,
    auto_block_high_risk: false,
    risk_threshold: 80,
    model_version: "Financial Fraud Detection v1.0",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getSettings()

      setSettings({
        notifications: data.notifications ?? true,
        real_time_monitoring:
          data.real_time_monitoring ?? true,
        auto_block_high_risk:
          data.auto_block_high_risk ?? false,
        risk_threshold:
          data.risk_threshold ?? 80,
        model_version:
          data.model_version ??
          "Financial Fraud Detection v1.0",
      })

      setLoading(false)
    } catch (err) {
      console.error("Settings API error:", err)
      setError("Unable to load NEXRA settings")
      setLoading(false)
    }
  }

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    setMessage("")
    setError("")
  }

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))

    setMessage("")
    setError("")
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const payload = {
        notifications: Boolean(
          settings.notifications
        ),

        real_time_monitoring: Boolean(
          settings.real_time_monitoring
        ),

        auto_block_high_risk: Boolean(
          settings.auto_block_high_risk
        ),

        risk_threshold: Math.min(
          Math.max(
            Number(settings.risk_threshold),
            0
          ),
          100
        ),

        model_version:
          settings.model_version,
      }

      const response =
        await updateSettings(payload)

      setSettings(response.settings)

      setMessage(
        "Settings saved successfully"
      )
    } catch (err) {
      console.error(
        "Settings update error:",
        err
      )

      setError(
        "Unable to save settings"
      )
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

  return (
    <div className="page settings-page">

      <div className="page-heading settings-heading">
        <div>
          <p className="eyebrow">
            SYSTEM CONFIGURATION
          </p>

          <h1>
            Settings
          </h1>

          <p className="subtitle">
            Manage NEXRA fraud detection and security controls
          </p>
        </div>
      </div>


      <section className="panel settings-profile">

        <div className="settings-section-header">

          <div>
            <h2>
              Profile
            </h2>

            <p>
              Your NEXRA account information
            </p>
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
              <span>
                Email
              </span>

              <strong>
                sarthak@nexra.ai
              </strong>
            </div>

            <div className="profile-detail">
              <span>
                Role
              </span>

              <strong>
                Security Analyst
              </strong>
            </div>

            <div className="profile-detail">
              <span>
                Access Level
              </span>

              <strong>
                Advanced
              </strong>
            </div>

          </div>

        </div>

      </section>


      <div className="settings-grid">


        <section className="panel settings-card">

          <div className="settings-section-header">

            <div>
              <h2>
                Detection Preferences
              </h2>

              <p>
                Configure financial fraud detection behavior
              </p>
            </div>

          </div>


          <div className="settings-list">

            <SettingToggle
              title="Real-time Fraud Detection"
              description="Analyze financial transactions as they occur"
              enabled={
                settings.real_time_monitoring
              }
              onClick={() =>
                toggleSetting(
                  "real_time_monitoring"
                )
              }
            />


            <SettingToggle
              title="High-Risk Alerts"
              description="Receive alerts for suspicious transactions"
              enabled={
                settings.notifications
              }
              onClick={() =>
                toggleSetting(
                  "notifications"
                )
              }
            />


            <SettingToggle
              title="Automatic High-Risk Blocking"
              description="Block transactions above the configured risk threshold"
              enabled={
                settings.auto_block_high_risk
              }
              onClick={() =>
                toggleSetting(
                  "auto_block_high_risk"
                )
              }
            />

          </div>

        </section>


        <section className="panel settings-card">

          <div className="settings-section-header">

            <div>
              <h2>
                Risk Engine
              </h2>

              <p>
                Configure financial transaction risk scoring
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
                  value={
                    settings.risk_threshold
                  }
                  onChange={(e) =>
                    handleChange(
                      "risk_threshold",
                      e.target.value
                    )
                  }
                />

                <span>
                  /100
                </span>

              </div>

            </div>


            <div className="setting-field">

              <label>
                Model Version
              </label>

              <select
                value={
                  settings.model_version
                }
                onChange={(e) =>
                  handleChange(
                    "model_version",
                    e.target.value
                  )
                }
              >

                <option value="Financial Fraud Detection v1.0">
                  Financial Fraud Detection v1.0
                </option>

              </select>

            </div>


            <div
              className="setting-toggle-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >

              <div
                className="setting-toggle-text"
                style={{
                  flex: 1,
                }}
              >

                <strong>
                  Automatic Investigation
                </strong>

                <span>
                  Critical transactions are automatically flagged when high-risk blocking is enabled
                </span>

              </div>

              <div
                style={{
                  flexShrink: 0,
                  padding: "7px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                  background:
                    settings.auto_block_high_risk
                      ? "rgba(114,213,114,0.18)"
                      : "rgba(255,255,255,0.08)",
                  color:
                    settings.auto_block_high_risk
                      ? "#72d572"
                      : "#888",
                }}
              >
                {settings.auto_block_high_risk
                  ? "ACTIVE"
                  : "INACTIVE"}
              </div>

            </div>

          </div>

        </section>


        <section className="panel settings-card">

          <div className="settings-section-header">

            <div>
              <h2>
                Notifications
              </h2>

              <p>
                Control security and system notifications
              </p>
            </div>

          </div>


          <div className="settings-list">

            <SettingToggle
              title="Security Notifications"
              description="Receive important fraud and security events"
              enabled={
                settings.notifications
              }
              onClick={() =>
                toggleSetting(
                  "notifications"
                )
              }
            />


            <SettingToggle
              title="Real-time Monitoring"
              description="Receive updates while transactions are analyzed"
              enabled={
                settings.real_time_monitoring
              }
              onClick={() =>
                toggleSetting(
                  "real_time_monitoring"
                )
              }
            />

          </div>

        </section>


        <section className="panel settings-card">

          <div className="settings-section-header">

            <div>
              <h2>
                Security
              </h2>

              <p>
                Manage transaction security controls
              </p>
            </div>

          </div>


          <div className="settings-list">

            <div
              className="setting-toggle-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >

              <div
                className="setting-toggle-text"
                style={{
                  flex: 1,
                }}
              >

                <strong>
                  Automatic High-Risk Blocking
                </strong>

                <span>
                  Current transaction blocking status
                </span>

              </div>

              <div
                style={{
                  flexShrink: 0,
                  padding: "7px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "700",
                  background:
                    settings.auto_block_high_risk
                      ? "rgba(114,213,114,0.18)"
                      : "rgba(255,255,255,0.08)",
                  color:
                    settings.auto_block_high_risk
                      ? "#72d572"
                      : "#888",
                }}
              >
                {settings.auto_block_high_risk
                  ? "ON"
                  : "OFF"}
              </div>

            </div>


            <div className="security-action">

              <div>
                <strong>
                  Change Password
                </strong>

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
                <strong>
                  Login Activity
                </strong>

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


      <section className="panel appearance-panel">

        <div className="settings-section-header">

          <div>
            <h2>
              Appearance
            </h2>

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
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

    </div>
  )
}


function SettingToggle({
  title,
  description,
  enabled,
  onClick,
}) {
  return (
    <div
      className="setting-toggle-row"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >

      <div
        className="setting-toggle-text"
        style={{
          flex: 1,
        }}
      >

        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>

      </div>


      <button
        type="button"
        onClick={onClick}
        aria-label={title}
        aria-pressed={enabled}
        style={{
          flexShrink: 0,
          width: "52px",
          height: "28px",
          padding: "3px",
          borderRadius: "20px",
          border:
            "1px solid rgba(255,255,255,0.18)",
          background: enabled
            ? "#72d572"
            : "#333",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: enabled
            ? "flex-end"
            : "flex-start",
          transition: "all 0.2s ease",
        }}
      >

        <span
          style={{
            display: "block",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#fff",
            boxShadow:
              "0 2px 6px rgba(0,0,0,0.35)",
          }}
        />

      </button>

    </div>
  )
}


export default Settings