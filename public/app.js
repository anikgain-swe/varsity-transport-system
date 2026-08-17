// ======================================================
// DAFFORIDE - FRONTEND APPLICATION
// ======================================================

// -----------------------------
// Global State
// -----------------------------

let busFleet = [];
let selectedCorridor = "ALL";
let socket = null;


// ======================================================
// INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("DaffoRide application started");

    loadFleet();
    initializeSocket();
    initializeNavigation();
    initializeSearch();
    initializeFilters();

});


// ======================================================
// LOAD BUS DATA FROM NODE.JS
// ======================================================

async function loadFleet() {

    try {

        const response = await fetch("/api/fleet");

        if (!response.ok) {
            throw new Error("Unable to load fleet");
        }

        const data = await response.json();

        busFleet = normalizeFleet(data);

        renderBusCards();

        updateDashboardStats();

        console.log("Fleet loaded:", busFleet);

    } catch (error) {

        console.error("Fleet loading error:", error);

        showFleetError();
    }
}


// ======================================================
// NORMALIZE BACKEND DATA
// ======================================================

function normalizeFleet(data) {

    return data.map(bus => {

        const capacity =
            Number(bus.capacity) || 40;

        const availableSeats =
            Number(bus.availableSeats) || 0;

        const occupied =
            capacity - availableSeats;

        let occupancyStatus =
            bus.occupancyStatus || "AVAILABLE";

        if (availableSeats <= 0) {
            occupancyStatus = "FULL";
        }
        else if (availableSeats <= 5) {
            occupancyStatus = "STANDING";
        }
        else {
            occupancyStatus = "AVAILABLE";
        }

        return {

            ...bus,

            capacity,

            availableSeats,

            occupied,

            occupancyStatus,

            routeName:
                bus.routeCode || "Campus Route",

            busModel:
                bus.model || "Campus Shuttle",

            speed:
                Math.round(Number(bus.speed) || 0),

            eta:
                Number(bus.eta) || 5,

            nextStop:
                bus.nextStop || "DIU Main Gate",

            corridor:
                bus.corridor || "Ashulia",

            status:
                bus.status || "RUNNING"

        };

    });

}


// ======================================================
// RENDER BUS CARDS
// ======================================================

function renderBusCards() {

    const container =
        document.getElementById("busCardsContainer");

    if (!container) {

        console.warn(
            "busCardsContainer not found"
        );

        return;
    }


    let buses = [...busFleet];


    // Corridor filtering

    if (selectedCorridor !== "ALL") {

        buses = buses.filter(
            bus =>
                bus.corridor.toLowerCase() ===
                selectedCorridor.toLowerCase()
        );

    }


    if (buses.length === 0) {

        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-5xl mb-4">🚌</div>

                <h3 class="text-xl font-bold text-slate-700">
                    No buses found
                </h3>

                <p class="text-slate-500 mt-2">
                    No bus is currently available for this corridor.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        buses.map(bus => createBusCard(bus)).join("");


    // Reinitialize icons if Lucide exists

    if (window.lucide) {
        lucide.createIcons();
    }

}


// ======================================================
// BUS CARD
// ======================================================

function createBusCard(bus) {

    const percentage =
        Math.min(
            100,
            Math.round(
                (bus.occupied / bus.capacity) * 100
            )
        );


    let statusClass =
        "bg-emerald-100 text-emerald-700";

    let statusText =
        "Seats Available";


    if (bus.occupancyStatus === "STANDING") {

        statusClass =
            "bg-amber-100 text-amber-700";

        statusText =
            "Standing Only";

    }


    if (bus.occupancyStatus === "FULL") {

        statusClass =
            "bg-rose-100 text-rose-700";

        statusText =
            "Bus Full";

    }


    return `

        <div
            class="
                bus-card
                group
                bg-white/80
                backdrop-blur-md
                border
                border-slate-200
                rounded-3xl
                p-5
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
            "
            data-bus-id="${bus.id}"
        >

            <!-- Header -->

            <div class="flex items-start justify-between">

                <div>

                    <div class="flex items-center gap-2">

                        <span
                            class="
                                w-3
                                h-3
                                bg-emerald-500
                                rounded-full
                                animate-pulse
                            "
                        ></span>

                        <span
                            class="
                                text-xs
                                font-bold
                                text-emerald-600
                                uppercase
                            "
                        >
                            ${bus.status}
                        </span>

                    </div>


                    <h3
                        class="
                            text-xl
                            font-black
                            text-slate-900
                            mt-2
                        "
                    >
                        ${bus.busNumber}
                    </h3>

                    <p class="text-sm text-slate-500">
                        ${bus.busModel}
                    </p>

                </div>


                <span
                    class="
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-bold
                        ${statusClass}
                    "
                >
                    ${statusText}
                </span>

            </div>


            <!-- Route -->

            <div
                class="
                    mt-5
                    p-4
                    bg-slate-50
                    rounded-2xl
                "
            >

                <div
                    class="
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <p
                            class="
                                text-xs
                                text-slate-400
                                uppercase
                                font-semibold
                            "
                        >
                            Route
                        </p>

                        <p
                            class="
                                font-bold
                                text-slate-800
                            "
                        >
                            ${bus.routeName}
                        </p>

                    </div>


                    <div class="text-right">

                        <p
                            class="
                                text-xs
                                text-slate-400
                                uppercase
                                font-semibold
                            "
                        >
                            ETA
                        </p>

                        <p
                            class="
                                font-bold
                                text-[#0B468C]
                            "
                        >
                            ${bus.eta} min
                        </p>

                    </div>

                </div>


                <div class="mt-3">

                    <p
                        class="
                            text-xs
                            text-slate-400
                        "
                    >
                        Next Stop
                    </p>

                    <p
                        class="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >
                        ${bus.nextStop}
                    </p>

                </div>

            </div>


            <!-- Speed -->

            <div class="grid grid-cols-2 gap-3 mt-4">

                <div
                    class="
                        bg-blue-50
                        rounded-2xl
                        p-4
                    "
                >

                    <p
                        class="
                            text-xs
                            text-slate-400
                        "
                    >
                        Speed
                    </p>

                    <p
                        class="
                            text-xl
                            font-black
                            text-[#0B468C]
                        "
                    >
                        ${bus.speed}
                        <span
                            class="
                                text-xs
                                font-semibold
                            "
                        >
                            km/h
                        </span>
                    </p>

                </div>


                <div
                    class="
                        bg-amber-50
                        rounded-2xl
                        p-4
                    "
                >

                    <p
                        class="
                            text-xs
                            text-slate-400
                        "
                    >
                        Available
                    </p>

                    <p
                        class="
                            text-xl
                            font-black
                            text-amber-600
                        "
                    >
                        ${bus.availableSeats}
                        <span
                            class="
                                text-xs
                                font-semibold
                            "
                        >
                            seats
                        </span>
                    </p>

                </div>

            </div>


            <!-- Occupancy -->

            <div class="mt-5">

                <div
                    class="
                        flex
                        justify-between
                        text-xs
                        mb-2
                    "
                >

                    <span
                        class="
                            font-semibold
                            text-slate-500
                        "
                    >
                        Occupancy
                    </span>

                    <span
                        class="
                            font-bold
                            text-slate-700
                        "
                    >
                        ${percentage}%
                    </span>

                </div>


                <div
                    class="
                        h-2
                        bg-slate-100
                        rounded-full
                        overflow-hidden
                    "
                >

                    <div
                        class="
                            h-full
                            rounded-full
                            transition-all
                            duration-700
                            ${
                                bus.occupancyStatus === "FULL"
                                ? "bg-rose-500"
                                :
                                bus.occupancyStatus === "STANDING"
                                ? "bg-amber-500"
                                :
                                "bg-emerald-500"
                            }
                        "
                        style="
                            width:${percentage}%
                        "
                    ></div>

                </div>

            </div>


            <!-- Footer -->

            <div
                class="
                    flex
                    items-center
                    justify-between
                    mt-5
                    pt-4
                    border-t
                    border-slate-100
                "
            >

                <div>

                    <p
                        class="
                            text-xs
                            text-slate-400
                        "
                    >
                        Corridor
                    </p>

                    <p
                        class="
                            text-sm
                            font-bold
                            text-slate-700
                        "
                    >
                        ${bus.corridor}
                    </p>

                </div>


                <button
                    onclick="focusBus('${bus.id}')"
                    class="
                        px-4
                        py-2
                        rounded-xl
                        bg-[#0B468C]
                        text-white
                        text-sm
                        font-bold
                        hover:bg-[#08386f]
                        transition
                    "
                >
                    Track Bus
                </button>

            </div>

        </div>

    `;
}


// ======================================================
// DASHBOARD STATS
// ======================================================

function updateDashboardStats() {

    const total =
        busFleet.length;

    const running =
        busFleet.filter(
            bus =>
                bus.status === "RUNNING"
        ).length;

    const available =
        busFleet.reduce(
            (sum, bus) =>
                sum + bus.availableSeats,
            0
        );


    updateElement(
        "totalBuses",
        total
    );

    updateElement(
        "activeBuses",
        running
    );

    updateElement(
        "availableSeats",
        available
    );

}


// ======================================================
// SAFE ELEMENT UPDATE
// ======================================================

function updateElement(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


// ======================================================
// SOCKET.IO
// ======================================================

function initializeSocket() {

    if (typeof io === "undefined") {

        console.warn(
            "Socket.IO is not available"
        );

        return;
    }


    socket = io();


    socket.on(
        "connect",
        () => {

            console.log(
                "Connected to server:",
                socket.id
            );

        }
    );


    socket.on(
        "fleetUpdate",
        data => {

            console.log(
                "Realtime fleet update received"
            );


            busFleet =
                normalizeFleet(data);


            renderBusCards();

            updateDashboardStats();

        }
    );


    socket.on(
        "disconnect",
        () => {

            console.log(
                "Disconnected from server"
            );

        }
    );

}


// ======================================================
// NAVIGATION
// ======================================================

function initializeNavigation() {

    const navLinks =
        document.querySelectorAll(
            "[data-page]"
        );


    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const page =
                    link.dataset.page;

                showPage(page);

            }
        );

    });

}


// ======================================================
// PAGE NAVIGATION
// ======================================================

function showPage(page) {

    console.log(
        "Opening page:",
        page
    );


    const sections =
        document.querySelectorAll(
            "[data-section]"
        );


    sections.forEach(section => {

        section.classList.add(
            "hidden"
        );

    });


    const target =
        document.querySelector(
            `[data-section="${page}"]`
        );


    if (target) {

        target.classList.remove(
            "hidden"
        );

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// ======================================================
// SEARCH
// ======================================================

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "busSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const cards =
                document.querySelectorAll(
                    ".bus-card"
                );


            cards.forEach(card => {

                const text =
                    card.textContent
                        .toLowerCase();


                card.style.display =
                    text.includes(query)
                    ? ""
                    : "none";

            });

        }
    );

}


// ======================================================
// CORRIDOR FILTERS
// ======================================================

function initializeFilters() {

    const filters =
        document.querySelectorAll(
            "[data-corridor]"
        );


    filters.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                selectedCorridor =
                    button.dataset.corridor;


                filters.forEach(
                    item => {

                        item.classList.remove(
                            "bg-[#0B468C]",
                            "text-white"
                        );

                    }
                );


                button.classList.add(
                    "bg-[#0B468C]",
                    "text-white"
                );


                renderBusCards();

            }
        );

    });

}


// ======================================================
// FOCUS BUS
// ======================================================

function focusBus(busId) {

    const bus =
        busFleet.find(
            item =>
                item.id === busId
        );


    if (!bus) {
        return;
    }


   if (typeof window.focusMapBus === "function") {
    window.focusMapBus(bus.id);
}

}


// ======================================================
// ERROR UI
// ======================================================

function showFleetError() {

    const container =
        document.getElementById(
            "busCardsContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div
            class="
                col-span-full
                bg-red-50
                border
                border-red-200
                rounded-3xl
                p-8
                text-center
            "
        >

            <div class="text-5xl mb-4">
                ⚠️
            </div>

            <h3
                class="
                    text-xl
                    font-black
                    text-red-700
                "
            >
                Unable to load buses
            </h3>

            <p
                class="
                    text-red-500
                    mt-2
                "
            >
                Please make sure the Node.js
                server is running.
            </p>

            <button
                onclick="loadFleet()"
                class="
                    mt-5
                    px-5
                    py-2.5
                    rounded-xl
                    bg-red-600
                    text-white
                    font-bold
                "
            >
                Retry
            </button>

        </div>

    `;

}


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.loadFleet =
    loadFleet;

window.focusBus =
    focusBus;

window.showPage =
    showPage;