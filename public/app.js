const busFleet = [
  {
    busNumber: 'Bus #04',
    routeName: 'Ashulia Express (A-04)',
    corridor: 'Main Campus ↔ Uttara Sector 11',
    driverName: 'Rafiqul Islam',
    driverPhone: '+8801700000000',
    speed: 42,
    busModel: 'Volvo 8400 AC Deluxe',
    nextStopEta: '~1 Mins',
    nextStopName: 'Uttara Sector 11 Bus Stop',
    currentOccupancy: 28,
    totalCapacity: 50,
    status: 'Seats Available',
    badgeStyle: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    progressColor: 'bg-emerald-500'
  },
  {
    busNumber: 'Bus #08',
    routeName: 'Uttara Rapid Shuttle (U-08)',
    corridor: 'Main Campus ↔ Uttara Sector 11',
    driverName: 'Kabir Hossain',
    driverPhone: '+8801800000000',
    speed: 35,
    busModel: 'Tata Starbus Urban 42',
    nextStopEta: '~1 Mins',
    nextStopName: 'Diyabari Metro Station',
    currentOccupancy: 42,
    totalCapacity: 45,
    status: 'Standing Only',
    badgeStyle: 'bg-amber-100 text-amber-700 border-amber-300',
    progressColor: 'bg-amber-500'
  },
  {
    busNumber: 'Bus #12',
    routeName: 'Mirpur Commuter (M-12)',
    corridor: 'Main Campus ↔ Mirpur-10 Circle',
    driverName: 'Alamgir Hossain',
    driverPhone: '+8801900000000',
    speed: 28,
    busModel: 'Eicher Skyline Pro',
    nextStopEta: '~10 Mins',
    nextStopName: 'Mirpur-10 Metro Station',
    currentOccupancy: 45,
    totalCapacity: 45,
    status: 'Bus Full',
    badgeStyle: 'bg-rose-100 text-rose-700 border-rose-300',
    progressColor: 'bg-rose-500'
  },
  {
    busNumber: 'Bus #16',
    routeName: 'Dhanmondi Inter-Campus (D-16)',
    corridor: 'Main Campus ↔ Dhanmondi 32 / Sobhanbag',
    driverName: 'Zahiruddin Babul',
    driverPhone: '+8801600000000',
    speed: 38,
    busModel: 'Ashok Leyland Viking AC',
    nextStopEta: '~1 Mins',
    nextStopName: 'Dhanmondi 32 Plaza',
    currentOccupancy: 22,
    totalCapacity: 52,
    status: 'Seats Available',
    badgeStyle: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    progressColor: 'bg-emerald-500'
  }
];

function renderCards() {
  const container = document.getElementById('busCardsContainer');
  if (!container) return;

  container.innerHTML = busFleet.map(bus => {
    const percentage = Math.round((bus.currentOccupancy / bus.totalCapacity) * 100);

    return `
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
        
        <!-- Card Header -->
        <div class="flex items-start justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-3">
            <div class="bg-[#0A458C] text-white px-2.5 py-1.5 rounded-xl text-center min-w-[45px]">
              <i data-lucide="bus" class="h-4 w-4 mx-auto"></i>
              <span class="text-[9px] font-black block mt-0.5">${bus.busNumber}</span>
            </div>
            <div>
              <h3 class="text-sm font-black text-slate-900">${bus.routeName}</h3>
              <p class="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <i data-lucide="map-pin" class="h-3 w-3 text-blue-600"></i> ${bus.corridor}
              </p>
            </div>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${bus.badgeStyle}">
            ● ${bus.status}
          </span>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-3 gap-2 my-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
          <div>
            <p class="text-[9px] text-slate-400 font-bold uppercase">DRIVER</p>
            <p class="text-xs font-bold text-slate-800 mt-0.5">${bus.driverName}</p>
            <a href="tel:${bus.driverPhone}" class="text-[9px] font-bold text-blue-600 flex items-center justify-center gap-0.5 mt-0.5">
              <i data-lucide="phone" class="h-2.5 w-2.5"></i> Call Driver
            </a>
          </div>
          <div>
            <p class="text-[9px] text-slate-400 font-bold uppercase">SPEED</p>
            <p class="text-xs font-bold text-slate-800 mt-0.5">${bus.speed} km/h</p>
            <p class="text-[9px] text-slate-400 mt-0.5 truncate">${bus.busModel}</p>
          </div>
          <div>
            <p class="text-[9px] text-slate-400 font-bold uppercase">NEXT STOP ETA</p>
            <p class="text-xs font-bold text-amber-600 mt-0.5">${bus.nextStopEta}</p>
            <p class="text-[9px] text-slate-400 mt-0.5 truncate">${bus.nextStopName}</p>
          </div>
        </div>

        <!-- Seat Fill Bar -->
        <div class="space-y-1">
          <div class="flex justify-between items-center text-[11px] font-bold">
            <span class="text-slate-600">Seat Capacity Fill</span>
            <span class="text-slate-900">${bus.currentOccupancy} / ${bus.totalCapacity} Seats (${percentage}%)</span>
          </div>
          <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full ${bus.progressColor}" style="width: ${percentage}%"></div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button class="flex-1 bg-slate-50 border border-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-1">
            <i data-lucide="map-pin" class="h-3 w-3 text-blue-600"></i> Locate on Map
          </button>
          <button class="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-200 transition-all flex items-center gap-1">
            <i data-lucide="sliders" class="h-3 w-3"></i> Driver Controls
          </button>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCards();
});