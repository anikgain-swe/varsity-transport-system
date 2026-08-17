/* =========================================================
   DAFFORIDE - CORE FEATURES
   Student Registration
   Digital Bus Pass
   Driver Cockpit
   Admin Panel
   Schedule
   Under Development modules
   ========================================================= */

(function () {
    "use strict";

    // =====================================================
    // STORAGE
    // =====================================================

    const STORAGE = {
        student: "dafforide_student",
        driver: "dafforide_driver",
        admin: "dafforide_admin",
        alerts: "dafforide_alerts"
    };


    // =====================================================
    // HELPERS
    // =====================================================

    function getData(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);

            return value
                ? JSON.parse(value)
                : fallback;
        } catch (error) {
            console.error("Storage read error:", error);
            return fallback;
        }
    }


    function saveData(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function injectStyles() {

        if (document.getElementById("dafforideFeatureStyles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "dafforideFeatureStyles";

        style.textContent = `

            /* =============================================
               FEATURE AREA
               ============================================= */

            .df-feature-section {
                max-width: 1280px;
                margin: 0 auto;
                padding: 28px 24px;
            }

            .df-feature-header {
                margin-bottom: 18px;
            }

            .df-feature-eyebrow {
                color: #0B468C;
                font-size: 11px;
                font-weight: 900;
                letter-spacing: .12em;
                text-transform: uppercase;
            }

            .df-feature-title {
                margin-top: 5px;
                color: #0f172a;
                font-size: 26px;
                line-height: 1.2;
                font-weight: 900;
            }

            .df-feature-subtitle {
                margin-top: 7px;
                color: #64748b;
                font-size: 13px;
            }

            .df-feature-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 14px;
            }

            @media (min-width: 768px) {
                .df-feature-grid {
                    grid-template-columns:
                        repeat(3, minmax(0, 1fr));
                }
            }

            @media (min-width: 1100px) {
                .df-feature-grid {
                    grid-template-columns:
                        repeat(6, minmax(0, 1fr));
                }
            }

            .df-feature-card {
                position: relative;
                min-height: 160px;
                padding: 18px;
                border-radius: 24px;
                border: 1px solid #e2e8f0;
                background:
                    rgba(255,255,255,.82);
                backdrop-filter: blur(14px);
                box-shadow:
                    0 8px 30px rgba(15,23,42,.06);
                cursor: pointer;
                transition:
                    transform .25s ease,
                    box-shadow .25s ease,
                    border-color .25s ease;
            }

            .df-feature-card:hover {
                transform: translateY(-4px);
                border-color: #bfdbfe;
                box-shadow:
                    0 16px 38px rgba(15,23,42,.11);
            }

            .df-feature-icon {
                width: 46px;
                height: 46px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22px;
                background: #eff6ff;
            }

            .df-feature-name {
                margin-top: 15px;
                color: #0f172a;
                font-size: 14px;
                font-weight: 900;
            }

            .df-feature-description {
                margin-top: 5px;
                color: #64748b;
                font-size: 11px;
                line-height: 1.5;
            }

            .df-status {
                position: absolute;
                top: 14px;
                right: 14px;
                padding: 4px 8px;
                border-radius: 999px;
                font-size: 8px;
                font-weight: 900;
                letter-spacing: .05em;
            }

            .df-status-live {
                color: #15803d;
                background: #dcfce7;
            }

            .df-status-dev {
                color: #b45309;
                background: #fef3c7;
            }

            /* =============================================
               MODAL
               ============================================= */

            .df-modal-backdrop {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 18px;
                background:
                    rgba(2, 6, 23, .58);
                backdrop-filter: blur(8px);
            }

            .df-modal {
                width: 100%;
                max-width: 560px;
                max-height: 92vh;
                overflow-y: auto;
                border-radius: 30px;
                background: #ffffff;
                box-shadow:
                    0 30px 80px rgba(0,0,0,.28);
                animation:
                    dfModalIn .22s ease-out;
            }

            @keyframes dfModalIn {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(.97);
                }

                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .df-modal-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                padding: 22px 22px 10px;
            }

            .df-modal-title {
                color: #0f172a;
                font-size: 21px;
                font-weight: 900;
            }

            .df-modal-description {
                margin-top: 4px;
                color: #64748b;
                font-size: 12px;
            }

            .df-close {
                width: 36px;
                height: 36px;
                border: 0;
                border-radius: 12px;
                background: #f1f5f9;
                color: #475569;
                font-size: 18px;
                cursor: pointer;
            }

            .df-close:hover {
                background: #e2e8f0;
            }

            .df-modal-body {
                padding: 16px 22px 22px;
            }

            /* =============================================
               FORM
               ============================================= */

            .df-form-group {
                margin-bottom: 13px;
            }

            .df-label {
                display: block;
                margin-bottom: 6px;
                color: #334155;
                font-size: 11px;
                font-weight: 800;
            }

            .df-input,
            .df-select,
            .df-textarea {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #e2e8f0;
                border-radius: 14px;
                padding: 11px 13px;
                outline: none;
                color: #0f172a;
                background: #f8fafc;
                font-family: inherit;
                font-size: 13px;
                transition: .2s;
            }

            .df-input:focus,
            .df-select:focus,
            .df-textarea:focus {
                border-color: #0B468C;
                background: white;
                box-shadow:
                    0 0 0 3px rgba(11,70,140,.08);
            }

            .df-textarea {
                min-height: 85px;
                resize: vertical;
            }

            .df-form-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
            }

            @media (min-width: 560px) {
                .df-form-grid {
                    grid-template-columns: 1fr 1fr;
                }
            }

            .df-button {
                border: 0;
                border-radius: 14px;
                padding: 11px 16px;
                font-size: 12px;
                font-weight: 900;
                cursor: pointer;
                transition: .2s;
            }

            .df-button:hover {
                transform: translateY(-1px);
            }

            .df-button-primary {
                color: white;
                background: #0B468C;
            }

            .df-button-primary:hover {
                background: #08386f;
            }

            .df-button-amber {
                color: #422d00;
                background: #FFC107;
            }

            .df-button-green {
                color: white;
                background: #16a34a;
            }

            .df-button-red {
                color: white;
                background: #dc2626;
            }

            .df-button-secondary {
                color: #334155;
                background: #f1f5f9;
            }

            .df-button-row {
                display: flex;
                flex-wrap: wrap;
                gap: 9px;
                margin-top: 17px;
            }

            /* =============================================
               ROLE SELECTOR
               ============================================= */

            .df-role-grid {
                display: grid;
                grid-template-columns:
                    repeat(3, minmax(0, 1fr));
                gap: 9px;
                margin-bottom: 18px;
            }

            .df-role {
                padding: 13px 7px;
                border: 1px solid #e2e8f0;
                border-radius: 16px;
                background: #f8fafc;
                cursor: pointer;
                text-align: center;
                transition: .2s;
            }

            .df-role:hover {
                border-color: #93c5fd;
            }

            .df-role.active {
                border-color: #0B468C;
                background: #eff6ff;
                box-shadow:
                    0 0 0 2px rgba(11,70,140,.08);
            }

            .df-role-icon {
                font-size: 22px;
            }

            .df-role-name {
                margin-top: 5px;
                color: #334155;
                font-size: 10px;
                font-weight: 900;
            }

            /* =============================================
               PASS
               ============================================= */

            .df-pass {
                overflow: hidden;
                border-radius: 25px;
                color: white;
                background:
                    linear-gradient(
                        135deg,
                        #0B468C,
                        #08386f
                    );
                box-shadow:
                    0 20px 40px rgba(11,70,140,.25);
            }

            .df-pass-top {
                padding: 20px;
                border-bottom:
                    1px solid rgba(255,255,255,.15);
            }

            .df-pass-brand {
                font-size: 10px;
                font-weight: 900;
                letter-spacing: .13em;
                opacity: .75;
            }

            .df-pass-title {
                margin-top: 5px;
                font-size: 22px;
                font-weight: 900;
            }

            .df-pass-body {
                display: grid;
                grid-template-columns: 1fr 105px;
                gap: 18px;
                align-items: center;
                padding: 20px;
            }

            .df-pass-name {
                font-size: 18px;
                font-weight: 900;
            }

            .df-pass-info {
                margin-top: 10px;
                display: grid;
                gap: 7px;
            }

            .df-pass-info div {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                font-size: 10px;
            }

            .df-pass-info span {
                opacity: .65;
            }

            .df-qr {
                width: 100px;
                height: 100px;
                padding: 5px;
                border-radius: 12px;
                background: white;
            }

            .df-pass-status {
                display: inline-flex;
                margin-top: 15px;
                padding: 5px 9px;
                border-radius: 999px;
                color: #166534;
                background: #dcfce7;
                font-size: 9px;
                font-weight: 900;
            }

            /* =============================================
               DRIVER
               ============================================= */

            .df-cockpit {
                border-radius: 23px;
                padding: 18px;
                color: white;
                background:
                    linear-gradient(
                        145deg,
                        #0f172a,
                        #0B468C
                    );
            }

            .df-cockpit-label {
                color: #93c5fd;
                font-size: 9px;
                font-weight: 900;
                letter-spacing: .1em;
                text-transform: uppercase;
            }

            .df-cockpit-bus {
                margin-top: 4px;
                font-size: 23px;
                font-weight: 900;
            }

            .df-cockpit-grid {
                display: grid;
                grid-template-columns:
                    repeat(2, 1fr);
                gap: 10px;
                margin-top: 18px;
            }

            .df-cockpit-stat {
                padding: 14px;
                border-radius: 17px;
                background:
                    rgba(255,255,255,.09);
                border:
                    1px solid rgba(255,255,255,.08);
            }

            .df-cockpit-stat-label {
                color: #cbd5e1;
                font-size: 9px;
            }

            .df-cockpit-stat-value {
                margin-top: 4px;
                font-size: 21px;
                font-weight: 900;
            }

            .df-range {
                width: 100%;
                accent-color: #FFC107;
            }

            /* =============================================
               ADMIN
               ============================================= */

            .df-admin-stat-grid {
                display: grid;
                grid-template-columns:
                    repeat(2, 1fr);
                gap: 10px;
            }

            .df-admin-stat {
                padding: 14px;
                border-radius: 17px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
            }

            .df-admin-number {
                font-size: 23px;
                font-weight: 900;
                color: #0B468C;
            }

            .df-admin-label {
                color: #64748b;
                font-size: 10px;
                font-weight: 700;
            }

            .df-bus-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                padding: 12px;
                margin-top: 8px;
                border-radius: 14px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
            }

            .df-bus-row-name {
                color: #0f172a;
                font-size: 12px;
                font-weight: 900;
            }

            .df-bus-row-meta {
                margin-top: 3px;
                color: #64748b;
                font-size: 9px;
            }

            /* =============================================
               UNDER DEVELOPMENT
               ============================================= */

            .df-development {
                text-align: center;
                padding: 30px 15px;
            }

            .df-development-icon {
                font-size: 45px;
            }

            .df-development-title {
                margin-top: 10px;
                color: #0f172a;
                font-size: 20px;
                font-weight: 900;
            }

            .df-development-text {
                max-width: 360px;
                margin: 7px auto 0;
                color: #64748b;
                font-size: 12px;
                line-height: 1.6;
            }

            .df-development-badge {
                display: inline-block;
                margin-top: 15px;
                padding: 7px 12px;
                border-radius: 999px;
                color: #92400e;
                background: #fef3c7;
                font-size: 9px;
                font-weight: 900;
            }

            .df-alert {
                margin-top: 12px;
                padding: 10px 12px;
                border-radius: 12px;
                color: #166534;
                background: #dcfce7;
                font-size: 11px;
                font-weight: 700;
            }

        `;

        document.head.appendChild(style);
    }


    // =====================================================
    // MODAL
    // =====================================================

    function openModal(
        title,
        description,
        body
    ) {

        closeModal();

        const wrapper =
            document.createElement("div");

        wrapper.id =
            "dafforideFeatureModal";

        wrapper.className =
            "df-modal-backdrop";

        wrapper.innerHTML = `

            <div
                class="df-modal"
                role="dialog"
                aria-modal="true"
            >

                <div class="df-modal-header">

                    <div>

                        <div class="df-modal-title">
                            ${escapeHTML(title)}
                        </div>

                        ${
                            description
                                ? `
                                <div class="df-modal-description">
                                    ${escapeHTML(description)}
                                </div>
                                `
                                : ""
                        }

                    </div>

                    <button
                        class="df-close"
                        onclick="window.closeDaffoModal()"
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>

                <div class="df-modal-body">

                    ${body}

                </div>

            </div>

        `;


        wrapper.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    wrapper
                ) {
                    closeModal();
                }

            }
        );


        document.body.appendChild(
            wrapper
        );


        document.body.style.overflow =
            "hidden";
    }


    function closeModal() {

        const modal =
            document.getElementById(
                "dafforideFeatureModal"
            );


        if (modal) {
            modal.remove();
        }


        document.body.style.overflow =
            "";
    }


    // =====================================================
    // FEATURE SECTION
    // =====================================================

    function createFeatureSection() {

        if (
            document.getElementById(
                "dafforideFeatureSection"
            )
        ) {
            return;
        }


        const section =
            document.createElement(
                "section"
            );


        section.id =
            "dafforideFeatureSection";

        section.className =
            "df-feature-section";


        section.innerHTML = `

            <div class="df-feature-header">

                <div class="df-feature-eyebrow">
                    Transport Services
                </div>

                <div class="df-feature-title">
                    Everything you need for campus travel
                </div>

                <div class="df-feature-subtitle">
                    Access your transport tools from one place.
                </div>

            </div>


            <div class="df-feature-grid">

                <!-- Registration -->

                <article
                    class="df-feature-card"
                    onclick="window.openRegistration()"
                >

                    <span
                        class="df-status df-status-live"
                    >
                        AVAILABLE
                    </span>

                    <div class="df-feature-icon">
                        👤
                    </div>

                    <div class="df-feature-name">
                        Registration
                    </div>

                    <div class="df-feature-description">
                        Register as a student or driver.
                    </div>

                </article>


                <!-- Digital Pass -->

                <article
                    class="df-feature-card"
                    onclick="window.openBusPass()"
                >

                    <span
                        class="df-status df-status-live"
                    >
                        AVAILABLE
                    </span>

                    <div class="df-feature-icon">
                        🎫
                    </div>

                    <div class="df-feature-name">
                        Digital Bus Pass
                    </div>

                    <div class="df-feature-description">
                        View your digital student transport ID.
                    </div>

                </article>


                <!-- Driver -->

                <article
                    class="df-feature-card"
                    onclick="window.openDriverCockpit()"
                >

                    <span
                        class="df-status df-status-live"
                    >
                        AVAILABLE
                    </span>

                    <div class="df-feature-icon">
                        👨‍✈️
                    </div>

                    <div class="df-feature-name">
                        Driver Cockpit
                    </div>

                    <div class="df-feature-description">
                        Update speed, occupancy and alerts.
                    </div>

                </article>


                <!-- Admin -->

                <article
                    class="df-feature-card"
                    onclick="window.openAdminPanel()"
                >

                    <span
                        class="df-status df-status-live"
                    >
                        AVAILABLE
                    </span>

                    <div class="df-feature-icon">
                        🛠️
                    </div>

                    <div class="df-feature-name">
                        Admin Panel
                    </div>

                    <div class="df-feature-description">
                        Monitor and manage the transport fleet.
                    </div>

                </article>


                <!-- Schedule -->

                <article
                    class="df-feature-card"
                    onclick="window.openSchedule()"
                >

                    <span
                        class="df-status df-status-live"
                    >
                        DEMO
                    </span>

                    <div class="df-feature-icon">
                        📅
                    </div>

                    <div class="df-feature-name">
                        Bus Schedule
                    </div>

                    <div class="df-feature-description">
                        View daily shuttle departure times.
                    </div>

                </article>


                <!-- Lost Found -->

                <article
                    class="df-feature-card"
                    onclick="window.openDevelopment('Lost & Found')"
                >

                    <span
                        class="df-status df-status-dev"
                    >
                        IN DEV
                    </span>

                    <div class="df-feature-icon">
                        🔎
                    </div>

                    <div class="df-feature-name">
                        Lost & Found
                    </div>

                    <div class="df-feature-description">
                        Report items lost on university buses.
                    </div>

                </article>


                <!-- Feedback -->

                <article
                    class="df-feature-card"
                    onclick="window.openDevelopment('Trip Feedback')"
                >

                    <span
                        class="df-status df-status-dev"
                    >
                        IN DEV
                    </span>

                    <div class="df-feature-icon">
                        ⭐
                    </div>

                    <div class="df-feature-name">
                        Trip Feedback
                    </div>

                    <div class="df-feature-description">
                        Rate your transport experience.
                    </div>

                </article>


                <!-- Database -->

                <article
                    class="df-feature-card"
                    onclick="window.openDevelopment('Production Database')"
                >

                    <span
                        class="df-status df-status-dev"
                    >
                        IN DEV
                    </span>

                    <div class="df-feature-icon">
                        🗄️
                    </div>

                    <div class="df-feature-name">
                        Cloud Database
                    </div>

                    <div class="df-feature-description">
                        Production Firestore integration.
                    </div>

                </article>

            </div>

        `;


        // Put after map

        const map =
            document.getElementById(
                "liveMap"
            );


        if (
            map &&
            map.closest("section")
        ) {

            map.closest(
                "section"
            ).after(section);

        } else {

            document.body.appendChild(
                section
            );

        }

    }


    // =====================================================
    // REGISTRATION
    // =====================================================

    let selectedRole = "student";


    function openRegistration() {

        const existing =
            getData(
                STORAGE.student,
                null
            );


        openModal(
            "Join DaffoRide",
            "Choose your role and create a transport profile.",
            `

                <div class="df-role-grid">

                    <button
                        type="button"
                        class="df-role ${
                            selectedRole === "student"
                                ? "active"
                                : ""
                        }"
                        onclick="window.selectDaffoRole('student')"
                    >

                        <div class="df-role-icon">
                            🎓
                        </div>

                        <div class="df-role-name">
                            Student
                        </div>

                    </button>


                    <button
                        type="button"
                        class="df-role ${
                            selectedRole === "driver"
                                ? "active"
                                : ""
                        }"
                        onclick="window.selectDaffoRole('driver')"
                    >

                        <div class="df-role-icon">
                            🚌
                        </div>

                        <div class="df-role-name">
                            Driver
                        </div>

                    </button>


                    <button
                        type="button"
                        class="df-role ${
                            selectedRole === "admin"
                                ? "active"
                                : ""
                        }"
                        onclick="window.selectDaffoRole('admin')"
                    >

                        <div class="df-role-icon">
                            🛠️
                        </div>

                        <div class="df-role-name">
                            Admin
                        </div>

                    </button>

                </div>


                ${
                    selectedRole === "student"
                        ? studentForm(existing)
                        : ""
                }

                ${
                    selectedRole === "driver"
                        ? driverForm()
                        : ""
                }

                ${
                    selectedRole === "admin"
                        ? adminLoginForm()
                        : ""
                }

            `
        );
    }


    function studentForm(data) {

        return `

            <form
                onsubmit="window.registerDaffoStudent(event)"
            >

                <div class="df-form-grid">

                    <div class="df-form-group">

                        <label class="df-label">
                            Full Name
                        </label>

                        <input
                            class="df-input"
                            name="name"
                            value="${escapeHTML(
                                data?.name || ""
                            )}"
                            placeholder="Your full name"
                            required
                        >

                    </div>


                    <div class="df-form-group">

                        <label class="df-label">
                            Student ID
                        </label>

                        <input
                            class="df-input"
                            name="studentId"
                            value="${escapeHTML(
                                data?.studentId || ""
                            )}"
                            placeholder="e.g. 221-15-0000"
                            required
                        >

                    </div>


                    <div class="df-form-group">

                        <label class="df-label">
                            Department
                        </label>

                        <select
                            class="df-select"
                            name="department"
                            required
                        >

                            <option value="">
                                Select Department
                            </option>

                            <option>SWE</option>
                            <option>CSE</option>
                            <option>EEE</option>
                            <option>Architecture</option>
                            <option>BBA</option>
                            <option>English</option>

                        </select>

                    </div>


                    <div class="df-form-group">

                        <label class="df-label">
                            Blood Group
                        </label>

                        <select
                            class="df-select"
                            name="bloodGroup"
                            required
                        >

                            <option value="">
                                Select Blood Group
                            </option>

                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                            <option>O+</option>
                            <option>O-</option>

                        </select>

                    </div>

                </div>


                <div class="df-form-group">

                    <label class="df-label">
                        Primary Corridor
                    </label>

                    <select
                        class="df-select"
                        name="corridor"
                        required
                    >

                        <option>Ashulia</option>
                        <option>Uttara</option>
                        <option>Mirpur</option>
                        <option>Dhanmondi</option>

                    </select>

                </div>


                <div class="df-button-row">

                    <button
                        class="
                            df-button
                            df-button-primary
                        "
                        type="submit"
                    >
                        Create Student Profile
                    </button>

                </div>

            </form>

        `;
    }


    function driverForm() {

        return `

            <form
                onsubmit="window.registerDaffoDriver(event)"
            >

                <div class="df-form-grid">

                    <div class="df-form-group">

                        <label class="df-label">
                            Driver Name
                        </label>

                        <input
                            class="df-input"
                            name="name"
                            placeholder="Driver full name"
                            required
                        >

                    </div>


                    <div class="df-form-group">

                        <label class="df-label">
                            Contact Phone
                        </label>

                        <input
                            class="df-input"
                            name="phone"
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            required
                        >

                    </div>


                    <div class="df-form-group">

                        <label class="df-label">
                            Driving License
                        </label>

                        <input
                            class="df-input"
                            name="license"
                            placeholder="License number"
                            required
                        >

                    </div>


                    <div class="df-form-group">

                        <label class="df-label">
                            Bus Assignment
                        </label>

                        <select
                            class="df-select"
                            name="bus"
                            required
                        >

                            <option>DIU-Bus-01</option>
                            <option>DIU-Bus-02</option>
                            <option>DIU-Bus-03</option>
                            <option>DIU-Bus-04</option>

                        </select>

                    </div>

                </div>


                <div class="df-button-row">

                    <button
                        class="
                            df-button
                            df-button-primary
                        "
                        type="submit"
                    >
                        Create Driver Profile
                    </button>

                </div>

            </form>

        `;
    }


    function adminLoginForm() {

        return `

            <form
                onsubmit="window.loginDaffoAdmin(event)"
            >

                <div class="df-form-group">

                    <label class="df-label">
                        Admin Passcode
                    </label>

                    <input
                        class="df-input"
                        name="password"
                        type="password"
                        placeholder="Enter admin passcode"
                        required
                    >

                </div>


                <div
                    style="
                        padding:11px 13px;
                        border-radius:13px;
                        background:#eff6ff;
                        color:#1e40af;
                        font-size:10px;
                        line-height:1.5;
                    "
                >
                    Demo admin access is protected.
                </div>


                <div class="df-button-row">

                    <button
                        class="
                            df-button
                            df-button-primary
                        "
                        type="submit"
                    >
                        Unlock Admin Panel
                    </button>

                </div>

            </form>

        `;
    }


    function selectRole(role) {

        selectedRole = role;

        openRegistration();
    }


    function registerStudent(event) {

        event.preventDefault();

        const form =
            event.target;


        const data = {
            name:
                form.name.value.trim(),

            studentId:
                form.studentId.value.trim(),

            department:
                form.department.value,

            bloodGroup:
                form.bloodGroup.value,

            corridor:
                form.corridor.value,

            status:
                "ACTIVE",

            registeredAt:
                new Date().toISOString()
        };


        saveData(
            STORAGE.student,
            data
        );


        openModal(
            "Registration Complete",
            "Your student transport profile is ready.",
            `

                <div class="df-alert">
                    ✓ Student profile created successfully.
                </div>


                <div class="df-button-row">

                    <button
                        class="
                            df-button
                            df-button-primary
                        "
                        onclick="window.openBusPass()"
                    >
                        Open Digital Pass
                    </button>


                    <button
                        class="
                            df-button
                            df-button-secondary
                        "
                        onclick="window.closeDaffoModal()"
                    >
                        Done
                    </button>

                </div>

            `
        );
    }


    function registerDriver(event) {

        event.preventDefault();

        const form =
            event.target;


        const data = {

            name:
                form.name.value.trim(),

            phone:
                form.phone.value.trim(),

            license:
                form.license.value.trim(),

            bus:
                form.bus.value,

            status:
                "ACTIVE",

            registeredAt:
                new Date().toISOString()

        };


        saveData(
            STORAGE.driver,
            data
        );


        openModal(
            "Driver Profile Ready",
            "Your driver assignment has been saved.",
            `

                <div class="df-alert">
                    ✓ Driver profile created successfully.
                </div>


                <div class="df-button-row">

                    <button
                        class="
                            df-button
                            df-button-primary
                        "
                        onclick="window.openDriverCockpit()"
                    >
                        Open Driver Cockpit
                    </button>

                </div>

            `
        );
    }


    // =====================================================
    // ADMIN
    // =====================================================

    function loginAdmin(event) {

        event.preventDefault();

        const password =
            event.target.password.value;


        if (
            password !==
            "admin123"
        ) {

            alert(
                "Incorrect admin passcode."
            );

            return;
        }


        saveData(
            STORAGE.admin,
            {
                authenticated: true,
                loginAt:
                    new Date().toISOString()
            }
        );


        openAdminPanel();
    }


    // =====================================================
    // DIGITAL PASS
    // =====================================================

    function openBusPass() {

        const student =
            getData(
                STORAGE.student,
                null
            );


        if (!student) {

            openModal(
                "Digital Bus Pass",
                "Register as a student first.",
                `

                    <div class="df-development">

                        <div class="df-development-icon">
                            🎫
                        </div>

                        <div class="df-development-title">
                            Student Profile Required
                        </div>

                        <div class="df-development-text">
                            Create your student transport
                            profile before generating a
                            digital bus pass.
                        </div>


                        <button
                            class="
                                df-button
                                df-button-primary
                            "
                            style="margin-top:17px"
                            onclick="window.openRegistration()"
                        >
                            Register Now
                        </button>

                    </div>

                `
            );

            return;
        }


        const qrData =
            `DAFFORIDE|${student.studentId}|${student.name}|${student.corridor}`;


        openModal(
            "Digital Student Bus Pass",
            "Your QR-enabled campus transport identity.",
            `

                <div class="df-pass">

                    <div class="df-pass-top">

                        <div class="df-pass-brand">
                            DAFFODIL INTERNATIONAL UNIVERSITY
                        </div>

                        <div class="df-pass-title">
                            STUDENT BUS PASS
                        </div>

                    </div>


                    <div class="df-pass-body">

                        <div>

                            <div class="df-pass-name">
                                ${escapeHTML(student.name)}
                            </div>


                            <div class="df-pass-info">

                                <div>
                                    <span>Student ID</span>
                                    <strong>
                                        ${escapeHTML(student.studentId)}
                                    </strong>
                                </div>


                                <div>
                                    <span>Department</span>
                                    <strong>
                                        ${escapeHTML(student.department)}
                                    </strong>
                                </div>


                                <div>
                                    <span>Blood Group</span>
                                    <strong>
                                        ${escapeHTML(student.bloodGroup)}
                                    </strong>
                                </div>


                                <div>
                                    <span>Corridor</span>
                                    <strong>
                                        ${escapeHTML(student.corridor)}
                                    </strong>
                                </div>

                            </div>


                            <div class="df-pass-status">
                                ● ${escapeHTML(student.status)}
                            </div>

                        </div>


                        <div
                            id="dfQRCode"
                            class="df-qr"
                        ></div>

                    </div>

                </div>


                <div class="df-button-row">

                    <button
                        class="
                            df-button
                            df-button-primary
                        "
                        onclick="window.printDaffoPass()"
                    >
                        🖨 Print Pass
                    </button>


                    <button
                        class="
                            df-button
                            df-button-secondary
                        "
                        onclick="window.downloadDaffoPass()"
                    >
                        Download Snapshot
                    </button>

                </div>

            `
        );


        createQRCode(
            qrData
        );
    }


    function loadQRCodeLibrary(callback) {

        if (
            typeof QRCode !==
            "undefined"
        ) {

            callback();

            return;
        }


        const script =
            document.createElement(
                "script"
            );


        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";


        script.onload =
            callback;


        script.onerror =
            function () {

                const target =
                    document.getElementById(
                        "dfQRCode"
                    );

                if (target) {

                    target.innerHTML = `
                        <div
                            style="
                                color:#64748b;
                                font-size:8px;
                                text-align:center;
                                padding:20px 4px;
                            "
                        >
                            QR library unavailable
                        </div>
                    `;

                }

            };


        document.head.appendChild(
            script
        );
    }


    function createQRCode(
        value
    ) {

        loadQRCodeLibrary(
            function () {

                const target =
                    document.getElementById(
                        "dfQRCode"
                    );


                if (!target) {
                    return;
                }


                target.innerHTML = "";


                new QRCode(
                    target,
                    {
                        text: value,
                        width: 90,
                        height: 90,
                        colorDark: "#0f172a",
                        colorLight: "#ffffff",
                        correctLevel:
                            QRCode.CorrectLevel.H
                    }
                );

            }
        );
    }


    function printPass() {

        const student =
            getData(
                STORAGE.student,
                null
            );


        if (!student) {
            return;
        }


        const popup =
            window.open(
                "",
                "_blank",
                "width=700,height=800"
            );


        if (!popup) {

            alert(
                "Please allow popups to print the pass."
            );

            return;
        }


        popup.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    DaffoRide Bus Pass
                </title>

                <style>

                    body {
                        margin:0;
                        padding:40px;
                        font-family:Arial,sans-serif;
                    }

                    .pass {
                        max-width:600px;
                        margin:auto;
                        padding:35px;
                        border-radius:24px;
                        background:#0B468C;
                        color:white;
                    }

                    .brand {
                        font-size:11px;
                        letter-spacing:2px;
                        opacity:.7;
                    }

                    h1 {
                        margin-top:8px;
                    }

                    .grid {
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:15px;
                        margin-top:25px;
                    }

                    .item {
                        padding:14px;
                        background:rgba(255,255,255,.1);
                        border-radius:12px;
                    }

                    .label {
                        font-size:10px;
                        opacity:.6;
                    }

                    .value {
                        margin-top:5px;
                        font-weight:bold;
                    }

                </style>

            </head>

            <body>

                <div class="pass">

                    <div class="brand">
                        DAFFODIL INTERNATIONAL UNIVERSITY
                    </div>

                    <h1>
                        STUDENT BUS PASS
                    </h1>

                    <h2>
                        ${escapeHTML(student.name)}
                    </h2>

                    <div class="grid">

                        <div class="item">
                            <div class="label">
                                STUDENT ID
                            </div>
                            <div class="value">
                                ${escapeHTML(student.studentId)}
                            </div>
                        </div>

                        <div class="item">
                            <div class="label">
                                DEPARTMENT
                            </div>
                            <div class="value">
                                ${escapeHTML(student.department)}
                            </div>
                        </div>

                        <div class="item">
                            <div class="label">
                                BLOOD GROUP
                            </div>
                            <div class="value">
                                ${escapeHTML(student.bloodGroup)}
                            </div>
                        </div>

                        <div class="item">
                            <div class="label">
                                CORRIDOR
                            </div>
                            <div class="value">
                                ${escapeHTML(student.corridor)}
                            </div>
                        </div>

                    </div>

                </div>

                <script>
                    window.onload = function () {
                        window.print();
                    };
                <\/script>

            </body>

            </html>

        `);


        popup.document.close();
    }


    function downloadPass() {

        alert(
            "For the demo, use Print Pass → Save as PDF. A full image snapshot module can be connected later."
        );
    }


    // =====================================================
    // DRIVER COCKPIT
    // =====================================================

    let driverSpeed = 28;

    let driverOccupancy = 55;

    let gpsSimulation = true;


    function openDriverCockpit() {

        const driver =
            getData(
                STORAGE.driver,
                {
                    name:
                        "Demo Driver",
                    bus:
                        "DIU-Bus-01"
                }
            );


        openModal(
            "Driver Cockpit",
            "Real-time shuttle control dashboard.",
            `

                <div class="df-cockpit">

                    <div class="df-cockpit-label">
                        DRIVER CONTROL CENTER
                    </div>

                    <div class="df-cockpit-bus">
                        🚌 ${escapeHTML(driver.bus)}
                    </div>


                    <div
                        style="
                            margin-top:7px;
                            color:#cbd5e1;
                            font-size:11px;
                        "
                    >
                        Driver:
                        ${escapeHTML(driver.name)}
                    </div>


                    <div class="df-cockpit-grid">

                        <div class="df-cockpit-stat">

                            <div class="df-cockpit-stat-label">
                                LIVE SPEED
                            </div>

                            <div
                                id="dfDriverSpeed"
                                class="df-cockpit-stat-value"
                            >
                                ${driverSpeed}
                                km/h
                            </div>

                        </div>


                        <div class="df-cockpit-stat">

                            <div class="df-cockpit-stat-label">
                                OCCUPANCY
                            </div>

                            <div
                                id="dfDriverOccupancy"
                                class="df-cockpit-stat-value"
                            >
                                ${driverOccupancy}%
                            </div>

                        </div>

                    </div>


                    <div
                        style="
                            margin-top:18px;
                        "
                    >

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                font-size:10px;
                                color:#cbd5e1;
                            "
                        >

                            <span>
                                Speed Control
                            </span>

                            <strong>
                                0–80 km/h
                            </strong>

                        </div>


                        <input
                            class="df-range"
                            type="range"
                            min="0"
                            max="80"
                            value="${driverSpeed}"
                            oninput="window.updateDriverSpeed(this.value)"
                        >

                    </div>


                    <div
                        style="
                            margin-top:17px;
                        "
                    >

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                font-size:10px;
                                color:#cbd5e1;
                            "
                        >

                            <span>
                                Seat Occupancy
                            </span>

                            <strong>
                                0–100%
                            </strong>

                        </div>


                        <input
                            class="df-range"
                            type="range"
                            min="0"
                            max="100"
                            value="${driverOccupancy}"
                            oninput="window.updateDriverOccupancy(this.value)"
                        >

                    </div>


                    <div
                        style="
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            margin-top:18px;
                            padding:12px;
                            border-radius:15px;
                            background:rgba(255,255,255,.08);
                        "
                    >

                        <div>

                            <div
                                style="
                                    font-size:11px;
                                    font-weight:800;
                                "
                            >
                                Auto GPS Simulation
                            </div>

                            <div
                                style="
                                    color:#94a3b8;
                                    font-size:9px;
                                    margin-top:3px;
                                "
                            >
                                Simulate driver movement
                            </div>

                        </div>


                        <button
                            id="dfGpsToggle"
                            onclick="window.toggleDriverGPS()"
                            class="
                                df-button
                                df-button-green
                            "
                        >
                            ON
                        </button>

                    </div>

                </div>


                <div
                    style="
                        margin-top:14px;
                        padding:13px;
                        border-radius:16px;
                        background:#fff7ed;
                        border:1px solid #fed7aa;
                    "
                >

                    <div
                        style="
                            color:#9a3412;
                            font-size:10px;
                            font-weight:900;
                        "
                    >
                        ⚠ Traffic Alert
                    </div>

                    <textarea
                        id="dfTrafficMessage"
                        class="df-textarea"
                        style="margin-top:7px"
                        placeholder="Describe traffic or road conditions..."
                    ></textarea>


                    <button
                        class="
                            df-button
                            df-button-amber
                        "
                        style="margin-top:8px"
                        onclick="window.sendDriverAlert()"
                    >
                        Send Alert
                    </button>

                </div>

            `
        );
    }


    function updateDriverSpeed(
        value
    ) {

        driverSpeed =
            Number(value);


        const output =
            document.getElementById(
                "dfDriverSpeed"
            );


        if (output) {

            output.textContent =
                `${driverSpeed} km/h`;

        }
    }


    function updateDriverOccupancy(
        value
    ) {

        driverOccupancy =
            Number(value);


        const output =
            document.getElementById(
                "dfDriverOccupancy"
            );


        if (output) {

            output.textContent =
                `${driverOccupancy}%`;

        }
    }


    function toggleDriverGPS() {

        gpsSimulation =
            !gpsSimulation;


        const button =
            document.getElementById(
                "dfGpsToggle"
            );


        if (!button) {
            return;
        }


        button.textContent =
            gpsSimulation
                ? "ON"
                : "OFF";


        button.className =
            gpsSimulation
                ? "df-button df-button-green"
                : "df-button df-button-secondary";

    }


    function sendDriverAlert() {

        const input =
            document.getElementById(
                "dfTrafficMessage"
            );


        const message =
            input
                ? input.value.trim()
                : "";


        if (!message) {

            alert(
                "Please enter a traffic message."
            );

            return;
        }


        const alerts =
            getData(
                STORAGE.alerts,
                []
            );


        alerts.unshift({

            message,

            createdAt:
                new Date().toISOString(),

            driver:
                getData(
                    STORAGE.driver,
                    {
                        name:
                            "Demo Driver",
                        bus:
                            "DIU-Bus-01"
                    }
                )

        });


        saveData(
            STORAGE.alerts,
            alerts.slice(0, 20)
        );


        openModal(
            "Traffic Alert Sent",
            "Transport control has received the alert.",
            `

                <div class="df-alert">
                    ✓ Alert successfully submitted.
                </div>


                <div
                    style="
                        margin-top:12px;
                        padding:12px;
                        border-radius:14px;
                        background:#f8fafc;
                        color:#475569;
                        font-size:11px;
                    "
                >
                    ${escapeHTML(message)}
                </div>

            `
        );
    }


    // =====================================================
    // ADMIN PANEL
    // =====================================================

    function openAdminPanel() {

        const admin =
            getData(
                STORAGE.admin,
                null
            );


        if (
            !admin ||
            !admin.authenticated
        ) {

            selectedRole =
                "admin";

            openRegistration();

            return;
        }


        renderAdminPanel();
    }


    function renderAdminPanel() {

        const buses = [
            {
                id: "DIU-Bus-01",
                route: "R-101",
                corridor: "Ashulia",
                status: "RUNNING"
            },
            {
                id: "DIU-Bus-02",
                route: "R-202",
                corridor: "Uttara",
                status: "RUNNING"
            },
            {
                id: "DIU-Bus-03",
                route: "R-303",
                corridor: "Mirpur",
                status: "RUNNING"
            },
            {
                id: "DIU-Bus-04",
                route: "R-404",
                corridor: "Dhanmondi",
                status: "RUNNING"
            }
        ];


        const student =
            getData(
                STORAGE.student,
                null
            );


        const driver =
            getData(
                STORAGE.driver,
                null
            );


        openModal(
            "Admin Control Center",
            "Transport management and monitoring tools.",
            `

                <div class="df-admin-stat-grid">

                    <div class="df-admin-stat">

                        <div class="df-admin-number">
                            04
                        </div>

                        <div class="df-admin-label">
                            Active Buses
                        </div>

                    </div>


                    <div class="df-admin-stat">

                        <div class="df-admin-number">
                            04
                        </div>

                        <div class="df-admin-label">
                            Routes
                        </div>

                    </div>


                    <div class="df-admin-stat">

                        <div class="df-admin-number">
                            ${
                                student
                                    ? "01"
                                    : "00"
                            }
                        </div>

                        <div class="df-admin-label">
                            Registered Riders
                        </div>

                    </div>


                    <div class="df-admin-stat">

                        <div class="df-admin-number">
                            ${
                                driver
                                    ? "01"
                                    : "00"
                            }
                        </div>

                        <div class="df-admin-label">
                            Drivers
                        </div>

                    </div>

                </div>


                <div
                    style="
                        margin-top:20px;
                        color:#0f172a;
                        font-size:14px;
                        font-weight:900;
                    "
                >
                    Fleet Management
                </div>


                <div>

                    ${

                        buses
                            .map(
                                bus => `

                                    <div class="df-bus-row">

                                        <div>

                                            <div
                                                class="df-bus-row-name"
                                            >
                                                🚌 ${bus.id}
                                            </div>

                                            <div
                                                class="df-bus-row-meta"
                                            >
                                                ${bus.route}
                                                •
                                                ${bus.corridor}
                                            </div>

                                        </div>


                                        <span
                                            style="
                                                padding:4px 8px;
                                                border-radius:999px;
                                                background:#dcfce7;
                                                color:#15803d;
                                                font-size:8px;
                                                font-weight:900;
                                            "
                                        >
                                            ${bus.status}
                                        </span>

                                    </div>

                                `
                            )
                            .join("")

                    }

                </div>


                <div
                    style="
                        margin-top:20px;
                        color:#0f172a;
                        font-size:14px;
                        font-weight:900;
                    "
                >
                    GPS Relocator
                </div>


                <div
                    style="
                        margin-top:9px;
                        padding:14px;
                        border-radius:16px;
                        background:#eff6ff;
                    "
                >

                    <div
                        style="
                            color:#1e40af;
                            font-size:10px;
                            line-height:1.6;
                        "
                    >
                        Use the Live Map to monitor current
                        positions. Manual GPS override is
                        available in the next admin release.
                    </div>

                </div>


                <div class="df-button-row">

                    <button
                        class="
                            df-button
                            df-button-primary
                        "
                        onclick="window.openDevelopment('Advanced Fleet Management')"
                    >
                        Advanced Fleet Management
                    </button>


                    <button
                        class="
                            df-button
                            df-button-secondary
                        "
                        onclick="window.adminLogout()"
                    >
                        Lock Admin
                    </button>

                </div>

            `
        );
    }


    function adminLogout() {

        localStorage.removeItem(
            STORAGE.admin
        );


        closeModal();


        alert(
            "Admin panel locked."
        );
    }


    // =====================================================
    // BUS SCHEDULE
    // =====================================================

    function openSchedule() {

        const schedules = [

            {
                route: "R-101",
                corridor: "Ashulia",
                morning: "07:00 AM",
                midday: "01:00 PM",
                evening: "05:30 PM"
            },

            {
                route: "R-202",
                corridor: "Uttara",
                morning: "07:15 AM",
                midday: "01:15 PM",
                evening: "05:45 PM"
            },

            {
                route: "R-303",
                corridor: "Mirpur",
                morning: "07:30 AM",
                midday: "01:30 PM",
                evening: "06:00 PM"
            },

            {
                route: "R-404",
                corridor: "Dhanmondi",
                morning: "07:45 AM",
                midday: "01:45 PM",
                evening: "06:15 PM"
            }

        ];


        openModal(
            "Bus Schedule",
            "Today's campus shuttle timetable.",
            `

                <div
                    style="
                        overflow-x:auto;
                    "
                >

                    <table
                        style="
                            width:100%;
                            border-collapse:collapse;
                            font-size:10px;
                        "
                    >

                        <thead>

                            <tr
                                style="
                                    background:#eff6ff;
                                    color:#0B468C;
                                "
                            >

                                <th
                                    style="
                                        padding:10px;
                                        text-align:left;
                                    "
                                >
                                    Route
                                </th>

                                <th
                                    style="
                                        padding:10px;
                                        text-align:left;
                                    "
                                >
                                    Corridor
                                </th>

                                <th
                                    style="
                                        padding:10px;
                                        text-align:left;
                                    "
                                >
                                    Morning
                                </th>

                                <th
                                    style="
                                        padding:10px;
                                        text-align:left;
                                    "
                                >
                                    Midday
                                </th>

                                <th
                                    style="
                                        padding:10px;
                                        text-align:left;
                                    "
                                >
                                    Evening
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                                schedules
                                    .map(
                                        item => `

                                            <tr
                                                style="
                                                    border-bottom:
                                                        1px solid #e2e8f0;
                                                "
                                            >

                                                <td
                                                    style="
                                                        padding:10px;
                                                        font-weight:900;
                                                    "
                                                >
                                                    ${item.route}
                                                </td>

                                                <td
                                                    style="
                                                        padding:10px;
                                                    "
                                                >
                                                    ${item.corridor}
                                                </td>

                                                <td
                                                    style="
                                                        padding:10px;
                                                    "
                                                >
                                                    ${item.morning}
                                                </td>

                                                <td
                                                    style="
                                                        padding:10px;
                                                    "
                                                >
                                                    ${item.midday}
                                                </td>

                                                <td
                                                    style="
                                                        padding:10px;
                                                    "
                                                >
                                                    ${item.evening}
                                                </td>

                                            </tr>

                                        `
                                    )
                                    .join("")
                            }

                        </tbody>

                    </table>

                </div>


                <div class="df-button-row">

                    <button
                        class="
                            df-button
                            df-button-primary
                        "
                        onclick="window.printSchedule()"
                    >
                        🖨 Print Schedule
                    </button>

                </div>

            `
        );
    }


    function printSchedule() {

        const popup =
            window.open(
                "",
                "_blank",
                "width=900,height=700"
            );


        if (!popup) {

            alert(
                "Please allow popups."
            );

            return;
        }


        popup.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    DaffoRide Bus Schedule
                </title>

                <style>

                    body {
                        font-family:Arial,sans-serif;
                        padding:30px;
                    }

                    h1 {
                        color:#0B468C;
                    }

                    table {
                        width:100%;
                        border-collapse:collapse;
                        margin-top:20px;
                    }

                    th,
                    td {
                        padding:12px;
                        border:1px solid #ddd;
                        text-align:left;
                    }

                    th {
                        background:#0B468C;
                        color:white;
                    }

                </style>

            </head>

            <body>

                <h1>
                    DaffoRide Bus Schedule
                </h1>

                <p>
                    Campus Shuttle Timetable
                </p>

                <table>

                    <tr>

                        <th>
                            Route
                        </th>

                        <th>
                            Corridor
                        </th>

                        <th>
                            Morning
                        </th>

                        <th>
                            Midday
                        </th>

                        <th>
                            Evening
                        </th>

                    </tr>


                    <tr>
                        <td>R-101</td>
                        <td>Ashulia</td>
                        <td>07:00 AM</td>
                        <td>01:00 PM</td>
                        <td>05:30 PM</td>
                    </tr>


                    <tr>
                        <td>R-202</td>
                        <td>Uttara</td>
                        <td>07:15 AM</td>
                        <td>01:15 PM</td>
                        <td>05:45 PM</td>
                    </tr>


                    <tr>
                        <td>R-303</td>
                        <td>Mirpur</td>
                        <td>07:30 AM</td>
                        <td>01:30 PM</td>
                        <td>06:00 PM</td>
                    </tr>


                    <tr>
                        <td>R-404</td>
                        <td>Dhanmondi</td>
                        <td>07:45 AM</td>
                        <td>01:45 PM</td>
                        <td>06:15 PM</td>
                    </tr>

                </table>


                <script>
                    window.onload = function () {
                        window.print();
                    };
                <\/script>

            </body>

            </html>

        `);


        popup.document.close();
    }


    // =====================================================
    // UNDER DEVELOPMENT
    // =====================================================

    function openDevelopment(
        feature
    ) {

        openModal(
            feature,
            "This module is part of the next development phase.",
            `

                <div class="df-development">

                    <div class="df-development-icon">
                        🚧
                    </div>


                    <div class="df-development-title">
                        Under Development
                    </div>


                    <div class="df-development-text">
                        <strong>
                            ${escapeHTML(feature)}
                        </strong>
                        is already planned in the
                        DaffoRide system architecture.
                        The production version will be
                        added in the next release.
                    </div>


                    <div class="df-development-badge">
                        NEXT DEVELOPMENT PHASE
                    </div>

                </div>


                <div
                    style="
                        text-align:center;
                    "
                >

                    <button
                        class="
                            df-button
                            df-button-secondary
                        "
                        onclick="window.closeDaffoModal()"
                    >
                        Go Back
                    </button>

                </div>

            `
        );
    }


    // =====================================================
    // KEYBOARD
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeModal();

            }

        }
    );


    // =====================================================
    // INITIALIZATION
    // =====================================================

    function initialize() {

        injectStyles();
        setupTopNavigation();
        console.log(
            "DaffoRide core features initialized."
        );
    }


    // =====================================================
    // GLOBAL API
    // =====================================================

    window.openRegistration =
        openRegistration;

    window.selectDaffoRole =
        selectRole;

    window.registerDaffoStudent =
        registerStudent;

    window.registerDaffoDriver =
        registerDriver;

    window.loginDaffoAdmin =
        loginAdmin;

    window.openBusPass =
        openBusPass;

    window.printDaffoPass =
        printPass;

    window.downloadDaffoPass =
        downloadPass;

    window.openDriverCockpit =
        openDriverCockpit;

    window.updateDriverSpeed =
        updateDriverSpeed;

    window.updateDriverOccupancy =
        updateDriverOccupancy;

    window.toggleDriverGPS =
        toggleDriverGPS;

    window.sendDriverAlert =
        sendDriverAlert;

    window.openAdminPanel =
        openAdminPanel;

    window.adminLogout =
        adminLogout;

    window.openSchedule =
        openSchedule;

    window.printSchedule =
        printSchedule;

    window.openDevelopment =
        openDevelopment;
// =====================================================
// TOP NAVIGATION
// Connect existing navbar buttons to existing features
// =====================================================

function setupTopNavigation() {

    const navButtons =
        document.querySelectorAll(".nav-pill");

    if (!navButtons.length) {
        console.warn(
            "DaffoRide: Top navigation buttons not found."
        );
        return;
    }

    navButtons.forEach((button) => {

        const text =
            button.textContent
                .trim()
                .toLowerCase();

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                // -----------------------------------------
                // LIVE TRACKING
                // -----------------------------------------

                if (
                    text.includes("live tracking")
                ) {

                    const mapSection =
                        document.getElementById(
                            "liveMap"
                        ) ||
                        document.getElementById(
                            "liveTracking"
                        );

                    if (mapSection) {

                        mapSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                    return;
                }


                // -----------------------------------------
                // SCHEDULE
                // -----------------------------------------

                if (
                    text.includes("schedule")
                ) {

                    openSchedule();

                    return;
                }


                // -----------------------------------------
                // DIGITAL PASS
                // -----------------------------------------

                if (
                    text.includes("digital pass")
                ) {

                    openBusPass();

                    return;
                }


                // -----------------------------------------
                // ADMIN PANEL
                // -----------------------------------------

                if (
                    text.includes("admin panel")
                ) {

                    openAdminPanel();

                    return;
                }


                // -----------------------------------------
                // LOST & FOUND
                // -----------------------------------------

                if (
                    text.includes("lost & found")
                ) {

                    openDevelopment(
                        "Lost & Found"
                    );

                    return;
                }


                // -----------------------------------------
                // FEEDBACK
                // -----------------------------------------

                if (
                    text.includes("feedback")
                ) {

                    openDevelopment(
                        "Trip Feedback"
                    );

                    return;
                }


                // -----------------------------------------
                // SPECS
                // -----------------------------------------

                if (
                    text.includes("specs")
                ) {

                    openDevelopment(
                        "System Specifications"
                    );

                    return;
                }

            }
        );

    });

}
    window.closeDaffoModal =
        closeModal;


    // =====================================================
    // START
    // =====================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();