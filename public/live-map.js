// ======================================================
// DAFFORIDE - LIVE GPS MAP
// ======================================================

let liveMap = null;

let mapMarkers = {};

let mapSocket = null;

let activeMapFilter = "ALL";


// ======================================================
// MAP INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeLiveMap();

});


// ======================================================
// CREATE MAP
// ======================================================

function initializeLiveMap() {

    const mapElement =
        document.getElementById("liveMap");

    if (!mapElement) {

        console.warn(
            "Live map container not found."
        );

        return;
    }


    // Prevent duplicate initialization

    if (liveMap) {
        return;
    }


    // Dhaka / Campus area

    liveMap = L.map(
        "liveMap",
        {
            zoomControl: true,
            scrollWheelZoom: true
        }
    ).setView(
        [23.8103, 90.4125],
        11
    );


    // OpenStreetMap tiles

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(liveMap);


    // Campus hubs

    addCampusHub(
        "DIU Main Campus",
        23.8759,
        90.3202
    );

    addCampusHub(
        "Uttara Hub",
        23.8750,
        90.4000
    );

    addCampusHub(
        "Mirpur-10 Hub",
        23.8069,
        90.3687
    );

    addCampusHub(
        "Dhanmondi 32 Hub",
        23.7465,
        90.3760
    );


    // Route lines

    drawRoutes();


    // Connect realtime GPS

    connectMapSocket();


    console.log(
        "Live GPS map initialized."
    );

}


// ======================================================
// CAMPUS HUB MARKER
// ======================================================

function addCampusHub(
    name,
    lat,
    lng
) {

    const icon =
        L.divIcon({

            className:
                "campus-hub-marker",

            html: `
                <div
                    style="
                        width:34px;
                        height:34px;
                        border-radius:50%;
                        background:#0B468C;
                        border:4px solid white;
                        box-shadow:0 4px 14px rgba(0,0,0,.25);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:white;
                        font-size:15px;
                    "
                >
                    🎓
                </div>
            `,

            iconSize: [
                34,
                34
            ],

            iconAnchor: [
                17,
                17
            ]

        });


    L.marker(
        [lat, lng],
        {
            icon
        }
    )
        .addTo(liveMap)
        .bindPopup(`
            <div
                style="
                    min-width:160px;
                    font-family:Arial,sans-serif;
                "
            >
                <strong>
                    ${name}
                </strong>

                <br>

                <span
                    style="
                        color:#64748b;
                        font-size:12px;
                    "
                >
                    Campus Transport Hub
                </span>
            </div>
        `);

}


// ======================================================
// ROUTE LINES
// ======================================================

function drawRoutes() {

    const routeStyle = {

        color: "#0B468C",

        weight: 4,

        opacity: 0.55,

        dashArray: "8 8"

    };


    // Ashulia

    L.polyline(
        [
            [23.8870, 90.3000],
            [23.8820, 90.3100],
            [23.8759, 90.3202]
        ],
        routeStyle
    )
        .addTo(liveMap)
        .bindTooltip(
            "R-101 • Ashulia"
        );


    // Uttara

    L.polyline(
        [
            [23.8750, 90.4000],
            [23.8750, 90.3800],
            [23.8759, 90.3500],
            [23.8759, 90.3202]
        ],
        {
            ...routeStyle,
            color: "#22C55E"
        }
    )
        .addTo(liveMap)
        .bindTooltip(
            "R-202 • Uttara"
        );


    // Mirpur

    L.polyline(
        [
            [23.8069, 90.3687],
            [23.8250, 90.3500],
            [23.8500, 90.3350],
            [23.8759, 90.3202]
        ],
        {
            ...routeStyle,
            color: "#FFC107"
        }
    )
        .addTo(liveMap)
        .bindTooltip(
            "R-303 • Mirpur"
        );


    // Dhanmondi

    L.polyline(
        [
            [23.7465, 90.3760],
            [23.7650, 90.3650],
            [23.8000, 90.3400],
            [23.8759, 90.3202]
        ],
        {
            ...routeStyle,
            color: "#8B5CF6"
        }
    )
        .addTo(liveMap)
        .bindTooltip(
            "R-404 • Dhanmondi"
        );

}


// ======================================================
// BUS ICON
// ======================================================

function createBusIcon(
    bus
) {

    let background =
        "#22C55E";


    if (
        bus.occupancyStatus ===
        "STANDING"
    ) {

        background =
            "#FFC107";

    }


    if (
        bus.occupancyStatus ===
        "FULL"
    ) {

        background =
            "#EF4444";

    }


    return L.divIcon({

        className:
            "live-bus-marker",

        html: `

            <div
                style="
                    position:relative;
                    width:46px;
                    height:46px;
                "
            >

                <div
                    style="
                        position:absolute;
                        inset:0;
                        border-radius:50%;
                        background:${background};
                        opacity:.18;
                        animation:busPulse 1.8s infinite;
                    "
                ></div>


                <div
                    style="
                        position:absolute;
                        top:5px;
                        left:5px;
                        width:36px;
                        height:36px;
                        border-radius:50%;
                        background:${background};
                        border:3px solid white;
                        box-shadow:0 4px 14px rgba(0,0,0,.28);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:18px;
                    "
                >
                    🚌
                </div>

            </div>

        `,

        iconSize: [
            46,
            46
        ],

        iconAnchor: [
            23,
            23
        ]

    });

}


// ======================================================
// BUS POPUP
// ======================================================

function createBusPopup(
    bus
) {

    const occupied =
        bus.capacity -
        bus.availableSeats;


    const percentage =
        Math.round(
            (occupied /
                bus.capacity) *
            100
        );


    return `

        <div
            style="
                min-width:220px;
                font-family:Arial,sans-serif;
            "
        >

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:8px;
                "
            >

                <strong
                    style="
                        font-size:16px;
                        color:#0B468C;
                    "
                >
                    ${bus.busNumber}
                </strong>

                <span
                    style="
                        background:#DCFCE7;
                        color:#15803D;
                        padding:3px 8px;
                        border-radius:999px;
                        font-size:10px;
                        font-weight:bold;
                    "
                >
                    ${bus.status}
                </span>

            </div>


            <div
                style="
                    color:#64748B;
                    font-size:12px;
                    margin-bottom:8px;
                "
            >
                ${bus.routeCode}
                •
                ${bus.corridor}
            </div>


            <div
                style="
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:8px;
                    margin-bottom:10px;
                "
            >

                <div
                    style="
                        background:#EFF6FF;
                        padding:8px;
                        border-radius:10px;
                    "
                >

                    <small
                        style="color:#64748B"
                    >
                        Speed
                    </small>

                    <br>

                    <strong>
                        ${Math.round(bus.speed)}
                        km/h
                    </strong>

                </div>


                <div
                    style="
                        background:#FFFBEB;
                        padding:8px;
                        border-radius:10px;
                    "
                >

                    <small
                        style="color:#64748B"
                    >
                        ETA
                    </small>

                    <br>

                    <strong>
                        ${bus.eta}
                        min
                    </strong>

                </div>

            </div>


            <div>

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        font-size:11px;
                        margin-bottom:4px;
                    "
                >

                    <span>
                        Occupancy
                    </span>

                    <strong>
                        ${percentage}%
                    </strong>

                </div>


                <div
                    style="
                        height:6px;
                        background:#E2E8F0;
                        border-radius:999px;
                        overflow:hidden;
                    "
                >

                    <div
                        style="
                            width:${percentage}%;
                            height:100%;
                            background:#0B468C;
                        "
                    ></div>

                </div>

            </div>


            <div
                style="
                    margin-top:10px;
                    color:#475569;
                    font-size:11px;
                "
            >
                Next stop:
                <strong>
                    ${bus.nextStop}
                </strong>
            </div>

        </div>

    `;

}


// ======================================================
// UPDATE BUS MARKER
// ======================================================

function updateBusMarker(
    bus
) {

    if (!liveMap) {
        return;
    }


    // Corridor filter

if (
    activeMapFilter !== "ALL" &&
    String(bus.corridor).toLowerCase() !==
    String(activeMapFilter).toLowerCase()
) {

    if (
        mapMarkers[bus.id]
    ) {

        liveMap.removeLayer(
            mapMarkers[bus.id]
        );

        delete mapMarkers[
            bus.id
        ];

    }

    return;
}


    const position = [
        Number(bus.lat),
        Number(bus.lng)
    ];


    // Existing marker

    if (
        mapMarkers[bus.id]
    ) {

        const marker =
            mapMarkers[bus.id];


        marker.setLatLng(
            position
        );


        marker.setIcon(
            createBusIcon(bus)
        );


        marker.setPopupContent(
            createBusPopup(bus)
        );


        return;
    }


    // New marker

    const marker =
        L.marker(
            position,
            {
                icon:
                    createBusIcon(bus)
            }
        )
            .addTo(liveMap);


    marker.bindPopup(
        createBusPopup(bus)
    );


    mapMarkers[
        bus.id
    ] = marker;

}


// ======================================================
// UPDATE ALL BUSES
// ======================================================

function updateMapFleet(fleet) {

    if (!Array.isArray(fleet)) {
        return;
    }


    // -----------------------------------------
    // Remove markers that are no longer visible
    // -----------------------------------------

    Object.keys(mapMarkers).forEach(
        function (busId) {

            const marker =
                mapMarkers[busId];

            const bus =
                fleet.find(
                    function (item) {
                        return String(item.id) ===
                            String(busId);
                    }
                );


            if (!bus) {

                liveMap.removeLayer(marker);

                delete mapMarkers[busId];

                return;
            }


            if (
                activeMapFilter !== "ALL" &&
                String(bus.corridor).toLowerCase() !==
                String(activeMapFilter).toLowerCase()
            ) {

                liveMap.removeLayer(marker);

                delete mapMarkers[busId];

            }

        }
    );


    // -----------------------------------------
    // Update visible buses
    // -----------------------------------------

    fleet.forEach(
        function (bus) {

            updateBusMarker(bus);

        }
    );

}

// ======================================================
// SOCKET.IO CONNECTION
// ======================================================

function connectMapSocket() {

    if (
        typeof io ===
        "undefined"
    ) {

        console.error(
            "Socket.IO client not found."
        );

        return;
    }


    mapSocket = io();


    mapSocket.on(
        "connect",
        () => {

            console.log(
                "Live GPS Map connected:",
                mapSocket.id
            );

        }
    );


    mapSocket.on(
        "fleetUpdate",
        fleet => {

            updateMapFleet(
                fleet
            );

        }
    );

}


// ======================================================
// INITIAL FLEET LOAD
// ======================================================

async function loadInitialMapFleet() {

    try {

        const response =
            await fetch(
                "/api/fleet"
            );


        const fleet =
            await response.json();


        updateMapFleet(
            fleet
        );


    } catch (error) {

        console.error(
            "Unable to load map fleet:",
            error
        );

    }

}


// ======================================================
// MAP FILTER
// ======================================================

function setMapFilter(corridor) {

    activeMapFilter = corridor;


    console.log(
        "Active map corridor:",
        activeMapFilter
    );


    // -----------------------------------------
    // Remove current bus markers
    // -----------------------------------------

    Object.values(
        mapMarkers
    ).forEach(
        function (marker) {

            if (
                liveMap &&
                liveMap.hasLayer(marker)
            ) {

                liveMap.removeLayer(marker);

            }

        }
    );


    mapMarkers = {};


    // -----------------------------------------
    // Update button appearance
    // -----------------------------------------

    const filterButtons =
        document.querySelectorAll(
            '[onclick^="setMapFilter"]'
        );


    filterButtons.forEach(
        function (button) {

            const onclick =
                button.getAttribute(
                    "onclick"
                );


            if (!onclick) {
                return;
            }


            const match =
                onclick.match(
                    /setMapFilter\('([^']+)'\)/
                );


            if (!match) {
                return;
            }


            const buttonFilter =
                match[1];


            if (
                buttonFilter ===
                corridor
            ) {

                button.classList.remove(
                    "bg-slate-100",
                    "text-slate-600"
                );

                button.classList.add(
                    "bg-[#0B468C]",
                    "text-white",
                    "shadow-sm"
                );

            } else {

                button.classList.remove(
                    "bg-[#0B468C]",
                    "text-white",
                    "shadow-sm"
                );

                button.classList.add(
                    "bg-slate-100",
                    "text-slate-600"
                );

            }

        }
    );


    // -----------------------------------------
    // Load fleet again
    // -----------------------------------------

    loadInitialMapFleet();

}

// ======================================================
// FOCUS ON BUS
// ======================================================

function focusMapBus(busId) {

    const marker = mapMarkers[busId];

    if (!marker) {

        alert(
            "This bus is not visible in the current filter."
        );

        return;
    }

    // ================================
    // 1. Scroll directly to map
    // ================================

    const mapElement =
        document.getElementById("liveMap");

    if (mapElement) {

        mapElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    // ================================
    // 2. Focus bus on map
    // ================================

    const position =
        marker.getLatLng();

    setTimeout(() => {

        liveMap.setView(
            position,
            16,
            {
                animate: true
            }
        );

        marker.openPopup();

    }, 500);

}

// ======================================================
// START INITIAL DATA
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            () => {

                loadInitialMapFleet();

            },
            500
        );

    }
);


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.setMapFilter =
    setMapFilter;

window.focusMapBus =
    focusMapBus;