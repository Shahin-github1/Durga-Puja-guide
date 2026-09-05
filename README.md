# শারদ সাথী (Sharod Sathi) - West Bengal Durga Puja Guide & Route Navigator

> **The ultimate smart companion for Kolkata Durga Puja Parikrama.**  
> Plan seamless, anti-backtracking pandal routes, navigate with real street road curves, access multi-modal transit guidance (shared autos, Kolkata bus routes, metro), and install as an offline Progressive Web App (PWA).

🌐 **Live Web Application**: **[https://shahin-github1.github.io/Durga-Puja-guide/](https://shahin-github1.github.io/Durga-Puja-guide/)**

---

## 🌟 Key Features

### 1. 🧭 Anti-Backtracking Sequential Route Optimizer
- Custom 2-opt search and forward corridor progression projection eliminates criss-crossing and zigzagging through congested Kolkata traffic.
- Default corridor: **Dum Dum Junction Station ➔ Sealdah Railway & Metro Station** (covering Sreebhumi, Tala Barowari, Bagbazar, Sovabazar Rajbari, Kumartuli Park, College Square, and Santosh Mitra Square).
- Flexible start and destination hubs with one-click direction swap (`⇄`).

### 2. 🛣️ Real Road Street Snapping (OSRM Integration)
- Connects pandals using the actual Kolkata street road network via OpenStreetMap OSRM.
- Follows realistic curves along major thoroughfares, bridges, and flyovers (e.g. Belgachia Bridge, VIP Road, Bagbazar Street, Central Avenue, Rashbehari Avenue).
- Completely free and requires zero API keys.

### 3. 🛺 Multi-Modal Transit Guidance (Autos, Busses & Metro)
- **Local Shared Auto Routes**: Authentic Kolkata auto routes with stand locations and standard fares (`₹15` / `₹18`) (e.g. *Shyambazar ➔ Bagbazar Ghat*, *Dum Dum Jn ➔ Dum Dum Park*, *Ultadanga ➔ Lake Town*).
- **Exact Bus Numbers**: Shows authentic Kolkata bus routes (e.g. `30C`, `211`, `AC-37`, `L238`, `DN-18`, `234`, `S-9`, `AC-4A`) and designated boarding stops.
- **Walking Estimates**: Realistic festive pedestrian walking times and distances in meters.
- **Metro Connections**: Highlights direct metro boarding and interchange stations.

### 4. 🗺️ Google Maps Navigation
- **"🗺️ Open Full Route in Google Maps"**: One click opens your optimized multi-stop route directly in Google Maps for free live GPS driving and walking directions.
- **Per-Stop Navigation**: Individual "🧭 Navigate" buttons on every pandal card and map popup.

### 5. 🪔 45+ Curated Pandals with Urban Amenities
- Categorized across 5 zones: North Kolkata, Central Transit Nodes, South Kolkata, Salt Lake & East, and Behala & South West.
- Live layer toggles for:
  - 🍽️ Famous food spots and historic cabin eateries (Mitra Cafe, Arsalan, Peter Cat, Golbari, Bhojohori Manna)
  - 🚻 Public washrooms and bio-toilets
  - 🚇 Kolkata Metro stations
  - 🏧 ATMs
  - 👮 Kolkata Police assistance booths and helpline numbers

### 6. ⚙️ In-App Data Manager & Cloud Sync
- **Online Cloud Sync**: Refresh the pandal database from remote JSON endpoints or GitHub raw files.
- **Add Custom Pandal**: Organizers and visitors can add their local para puja with instant route re-optimization.
- **Backup & Export**: Download the customized database as a `.json` file or import existing backups.

### 7. 📲 Progressive Web App (PWA) & Offline Mode
- Installable as a native app on Android (Chrome / Edge) and iOS (Safari "Add to Home Screen").
- Offline caching via Service Worker (`sw.js`) so the app continues working even during cellular network congestion near mega-pujas.

---

## 🚀 Getting Started Locally

To run the application locally on your computer:

```bash
# Clone the repository
git clone https://github.com/Shahin-github1/Durga-Puja-guide.git

# Navigate into the project folder
cd Durga-Puja-guide

# Start a local static HTTP server (Python 3)
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## 📁 Repository Structure

```
Durga-Puja-guide/
├── index.html              # Main single-page web app entry
├── manifest.json           # PWA web app manifest
├── sw.js                   # Service worker for offline asset caching
├── assets/                 # App icons, favicon, QR code
├── css/
│   ├── style.css           # Core design system & responsive layout
│   ├── festive.css         # Bengali Durga Puja festive theme & animations
│   └── map.css             # Leaflet map pins, popups & layers
├── js/
│   ├── app.js              # Application controller & state management
│   ├── checklist.js        # Curated pandal checklist & preset filters
│   ├── itinerary.js        # Step-by-step timeline & transit guidance cards
│   ├── map.js              # Leaflet map controller & OSRM road snapping
│   ├── pwa.js              # Service worker registration & install prompt
│   ├── routing/
│   │   ├── distance.js     # Haversine distance & walking time formulas
│   │   └── optimizer.js    # Anti-backtracking 2-opt route optimizer
│   └── data/
│       ├── pandals.js      # 45+ curated pandal dataset
│       ├── hubs.js         # Major Kolkata transit start/end hubs
│       ├── food.js         # Famous Kolkata food spots & cabins
│       ├── amenities.js    # Metro stations, washrooms, ATMs, police booths
│       ├── transitRoutes.js# Shared auto routes, bus numbers & fares
│       └── pandalManager.js# LocalStorage persistence & remote sync
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions auto-deployment to GitHub Pages
```

---

## 📄 License
Released under the [MIT License](LICENSE).  
Created with ❤️ for Kolkata Durga Puja.
