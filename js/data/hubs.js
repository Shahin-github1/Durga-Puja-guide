// Major Transit Hubs & Landmarks in Kolkata & Suburbs categorized by Zone
export const TRANSIT_HUBS = [
  // North Kolkata & Suburban Transit Hubs
  {
    id: "hub_dumdum_jn",
    name: "Dum Dum Junction Station",
    bengaliName: "দমদম জংশন",
    zone: "north",
    lat: 22.6225,
    lng: 88.3948,
    type: "railway_metro",
    description: "Major suburban railway terminal & North Kolkata Metro hub. Ideal starting point for North & VIP Road pandals."
  },
  {
    id: "hub_dumdum_cantt",
    name: "Dum Dum Cantonment",
    bengaliName: "দমদম ক্যান্টনমেন্ট",
    zone: "north",
    lat: 22.6450,
    lng: 88.4060,
    type: "railway",
    description: "Gateway for North 24 Parganas & airport vicinity."
  },
  {
    id: "hub_airport",
    name: "Kolkata Airport (NSCBI)",
    bengaliName: "কলকাতা বিমানবন্দর",
    zone: "north",
    lat: 22.6547,
    lng: 88.4467,
    type: "airport",
    description: "Netaji Subhash Chandra Bose International Airport."
  },
  {
    id: "hub_shyambazar",
    name: "Shyambazar Five-Point Crossing",
    bengaliName: "শ্যামবাজার পাঁচমাথার মোড়",
    zone: "north",
    lat: 22.6022,
    lng: 88.3718,
    type: "metro_bus",
    description: "Historic crossroads of North Kolkata, landmark Netaji statue, Shyambazar Metro."
  },
  {
    id: "hub_sovabazar",
    name: "Sovabazar Metro Station",
    bengaliName: "শোভাবাজার মেট্রো",
    zone: "north",
    lat: 22.5975,
    lng: 88.3662,
    type: "metro",
    description: "Heart of heritage North Kolkata, gateway to Bagbazar & Kumartuli."
  },
  {
    id: "hub_belgachia",
    name: "Belgachia Metro Station",
    bengaliName: "বেলগাছিয়া মেট্রো",
    zone: "north",
    lat: 22.6074,
    lng: 88.3842,
    type: "metro",
    description: "Connecting RG Kar, Tala Park and VIP Road entry."
  },
  {
    id: "hub_hatibagan",
    name: "Hatibagan Crossing",
    bengaliName: "হাতিবাগান",
    zone: "north",
    lat: 22.5925,
    lng: 88.3716,
    type: "bus_tram",
    description: "Vibrant shopping and pandal corridor on Bidhan Sarani."
  },

  // Central Kolkata Transit Hubs
  {
    id: "hub_sealdah",
    name: "Sealdah Railway & Metro Station",
    bengaliName: "শিয়ালদহ স্টেশন",
    zone: "central",
    lat: 22.5675,
    lng: 88.3712,
    type: "railway_metro",
    description: "Busiest railway hub connecting eastern suburbs, Green Line Metro, Central Kolkata."
  },
  {
    id: "hub_howrah",
    name: "Howrah Railway & Green Line Metro",
    bengaliName: "হাওড়া স্টেশন",
    zone: "central",
    lat: 22.5850,
    lng: 88.3426,
    type: "railway_metro",
    description: "Iconic terminus, connects Howrah Bridge, underwater metro to Kolkata."
  },
  {
    id: "hub_esplanade",
    name: "Esplanade Intermodal Hub",
    bengaliName: "এসপ্ল্যানেড",
    zone: "central",
    lat: 22.5645,
    lng: 88.3516,
    type: "metro_bus",
    description: "Central transit node connecting Blue Line, Green Line, and major bus terminals."
  },
  {
    id: "hub_mg_road",
    name: "MG Road Metro Station",
    bengaliName: "মহাত্মা গান্ধী রোড মেট্রো",
    zone: "central",
    lat: 22.5815,
    lng: 88.3620,
    type: "metro",
    description: "Near College Street, Burrabazar, College Square pandal."
  },
  {
    id: "hub_chandni",
    name: "Chandni Chowk Metro Station",
    bengaliName: "চাঁদনী চক মেট্রো",
    zone: "central",
    lat: 22.5684,
    lng: 88.3540,
    type: "metro",
    description: "Near Bowbazar, Central Avenue, Wellington."
  },
  {
    id: "hub_park_street",
    name: "Park Street Metro Station",
    bengaliName: "পার্ক স্ট্রিট মেট্রো",
    zone: "central",
    lat: 22.5532,
    lng: 88.3524,
    type: "metro",
    description: "Food & nightlife corridor, dining hub connecting to Maidan."
  },

  // South Kolkata Transit Hubs
  {
    id: "hub_gariahata",
    name: "Gariahat Crossing",
    bengaliName: "গড়িয়াহাট মোড়",
    zone: "south",
    lat: 22.5186,
    lng: 88.3656,
    type: "bus_tram",
    description: "Epicenter of South Kolkata pandal hopping: Ekdalia, Singhi Park, Ballygunge."
  },
  {
    id: "hub_rabindra_sarobar",
    name: "Rabindra Sarobar Metro Station",
    bengaliName: "রবীন্দ্র সরোবর মেট্রো",
    zone: "south",
    lat: 22.5115,
    lng: 88.3458,
    type: "metro",
    description: "Gateway to Mudiali Club, Shiv Mandir, Lake Kali Bari."
  },
  {
    id: "hub_kalighat",
    name: "Kalighat Metro Station",
    bengaliName: "কালীঘাট মেট্রো",
    zone: "south",
    lat: 22.5204,
    lng: 88.3456,
    type: "metro",
    description: "Near Kalighat Temple, Deshapriya Park, Badamtala Ashar Sangha."
  },
  {
    id: "hub_tollygunge",
    name: "Mahanayak Uttam Kumar (Tollygunge)",
    bengaliName: "টালিগঞ্জ মেট্রো",
    zone: "south",
    lat: 22.4975,
    lng: 88.3444,
    type: "metro",
    description: "South Kolkata transit hub connecting Kudghat, Ranikuthi, Jadavpur."
  },
  {
    id: "hub_jadavpur_8b",
    name: "Jadavpur 8B Bus Stand",
    bengaliName: "যাদবপুর ৮বি",
    zone: "south",
    lat: 22.4988,
    lng: 88.3718,
    type: "bus",
    description: "Major southern junction, university hub, connecting Santoshpur."
  },
  {
    id: "hub_hazra",
    name: "Jatin Das Park (Hazra Crossing)",
    bengaliName: "হাজরা মোড়",
    zone: "south",
    lat: 22.5278,
    lng: 88.3468,
    type: "metro_bus",
    description: "Connects Ashutosh Mukherjee Road, SP Mukherjee Road, Maddox Square."
  },

  // Salt Lake & East Kolkata Transit Hubs
  {
    id: "hub_karunamoyee",
    name: "Karunamoyee Bus & Metro Terminal",
    bengaliName: "করুণাময়ী",
    zone: "east",
    lat: 22.5862,
    lng: 88.4202,
    type: "metro_bus",
    description: "Central hub of Salt Lake (Bidhannagar), Central Park, Green Line Metro."
  },
  {
    id: "hub_ultadanga",
    name: "Ultadanga / Bidhannagar Road Station",
    bengaliName: "উল্টোডাঙা / বিধাননগর রোড",
    zone: "east",
    lat: 22.5936,
    lng: 88.3978,
    type: "railway_bus",
    description: "Major transit interchange between EM Bypass, VIP Road, and North Kolkata."
  },
  {
    id: "hub_sector_v",
    name: "Salt Lake Sector V Metro Hub",
    bengaliName: "সেক্টর ফাইভ মেট্রো",
    zone: "east",
    lat: 22.5732,
    lng: 88.4328,
    type: "metro",
    description: "Tech hub terminus of Green Line Metro, connecting New Town."
  },
  {
    id: "hub_science_city",
    name: "Science City (EM Bypass & Park Circus Connector)",
    bengaliName: "সায়েন্স সিটি মোড়",
    zone: "east",
    lat: 22.5401,
    lng: 88.3957,
    type: "bus",
    description: "Key intersection connecting South, East, and Central Kolkata on EM Bypass."
  },

  // Behala & South West Transit Hubs
  {
    id: "hub_behala_chowrasta",
    name: "Behala Chowrasta",
    bengaliName: "বেহালা চৌরাস্তা",
    zone: "behala",
    lat: 22.4938,
    lng: 88.3128,
    type: "bus_metro",
    description: "Heart of Behala, connecting Diamond Harbour Road and legendary community pandals."
  },
  {
    id: "hub_taratala",
    name: "Taratala Crossing & Metro",
    bengaliName: "তারাতলা",
    zone: "behala",
    lat: 22.5135,
    lng: 88.3184,
    type: "metro_bus",
    description: "Gateway from New Alipore to Behala, Purple Line Metro."
  },
  {
    id: "hub_new_alipore",
    name: "New Alipore Petrol Pump Crossing",
    bengaliName: "নিউ আলিপুর",
    zone: "behala",
    lat: 22.5120,
    lng: 88.3312,
    type: "bus",
    description: "Connects Suruchi Sangha, Chetla, and South Kolkata."
  }
];
