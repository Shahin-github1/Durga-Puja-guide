// Essential Urban Amenities: Public Washrooms/Toilets, Metro Stations, Bus Termini, ATMs, and Police Helpdesks
export const AMENITIES = {
  // Public Washrooms & Sanitation points
  washrooms: [
    {
      id: "washroom_dumdum_metro",
      name: "Dum Dum Metro Public Washroom",
      bengaliName: "দমদম মেট্রো শৌচাগার",
      lat: 22.6220,
      lng: 88.3945,
      zone: "north",
      type: "metro_facility",
      accessibility: "Wheelchair accessible, 24x7 during Puja",
      cleanliness: "High",
      fee: "Free for commuters / ₹5"
    },
    {
      id: "washroom_shyam_sulabh",
      name: "Shyambazar 5-Point Sulabh Sauchalay",
      bengaliName: "শ্যামবাজার সুলভ শৌচালয়",
      lat: 22.6028,
      lng: 88.3722,
      zone: "north",
      type: "sulabh",
      accessibility: "Available 24x7",
      cleanliness: "Moderate",
      fee: "₹5"
    },
    {
      id: "washroom_bagbazar_ghat",
      name: "Bagbazar Ghat KMC Bio-Toilets",
      bengaliName: "বাগবাজার ঘাট পুরসভা শৌচালয়",
      lat: 22.6045,
      lng: 88.3675,
      zone: "north",
      type: "kmc_public",
      accessibility: "Puja special bio-toilet complex",
      cleanliness: "Moderate",
      fee: "Free"
    },
    {
      id: "washroom_sovabazar_metro",
      name: "Sovabazar Sutanuti Metro Restrooms",
      bengaliName: "শোভাবাজার মেট্রো শৌচাগার",
      lat: 22.5977,
      lng: 88.3660,
      zone: "north",
      type: "metro_facility",
      accessibility: "Inside Concourse",
      cleanliness: "High",
      fee: "Free / ₹5"
    },
    {
      id: "washroom_laketown_vip",
      name: "Lake Town Clock Tower / VIP KMC Complex",
      bengaliName: "লেকটাউন ভিআইপি পাবলিক টয়লেট",
      lat: 22.5995,
      lng: 88.4030,
      zone: "north",
      type: "kmc_public",
      accessibility: "Special Puja sanitation booth",
      cleanliness: "High",
      fee: "Free"
    },
    {
      id: "washroom_college_sq",
      name: "College Square Vidyasagar Udyan Public Toilet",
      bengaliName: "কলেজ স্কোয়ার পাবলিক টয়লেট",
      lat: 22.5760,
      lng: 88.3642,
      zone: "central",
      type: "kmc_public",
      accessibility: "Beside Lake Gate 2",
      cleanliness: "Moderate",
      fee: "₹5"
    },
    {
      id: "washroom_sealdah_stn",
      name: "Sealdah Station Main Concourse Executive Restroom",
      bengaliName: "শিয়ালদহ স্টেশন শৌচাগার",
      lat: 22.5678,
      lng: 88.3718,
      zone: "central",
      type: "railway_facility",
      accessibility: "24 Hours open, clean paid facility",
      cleanliness: "High",
      fee: "₹10"
    },
    {
      id: "washroom_esplanade_metro",
      name: "Esplanade Intermodal Metro Complex Restrooms",
      bengaliName: "এসপ্ল্যানেড মেট্রো শৌচাগার",
      lat: 22.5648,
      lng: 88.3512,
      zone: "central",
      type: "metro_facility",
      accessibility: "Green Line / Blue Line junction",
      cleanliness: "High",
      fee: "Free / ₹5"
    },
    {
      id: "washroom_santosh_mitra",
      name: "Santosh Mitra Square KMC Temporary Bio-Toilets",
      bengaliName: "সন্তোষ মিত্র স্কোয়ার শৌচালয়",
      lat: 22.5692,
      lng: 88.3675,
      zone: "central",
      type: "kmc_public",
      accessibility: "Opposite Pandal Gate",
      cleanliness: "Moderate",
      fee: "Free"
    },
    {
      id: "washroom_gariahata_ac",
      name: "Gariahat AC Market Public Restrooms",
      bengaliName: "গড়িয়াহাট শৌচালয়",
      lat: 22.5180,
      lng: 88.3665,
      zone: "south",
      type: "kmc_public",
      accessibility: "Behind Gariahat Tram Depot",
      cleanliness: "Moderate",
      fee: "₹5"
    },
    {
      id: "washroom_maddox_park",
      name: "Maddox Square Park Permanent Washroom",
      bengaliName: "ম্যাডক্স স্কোয়ার শৌচালয়",
      lat: 22.5288,
      lng: 88.3580,
      zone: "south",
      type: "kmc_public",
      accessibility: "Inside park perimeter corner",
      cleanliness: "Moderate",
      fee: "₹5"
    },
    {
      id: "washroom_kalighat_metro",
      name: "Kalighat Metro Concourse Restroom",
      bengaliName: "কালীঘাট মেট্রো শৌচালয়",
      lat: 22.5205,
      lng: 88.3458,
      zone: "south",
      type: "metro_facility",
      accessibility: "Metro Concourse Gate 1",
      cleanliness: "High",
      fee: "Free / ₹5"
    },
    {
      id: "washroom_rabindra_sarobar",
      name: "Rabindra Sarobar Southern Avenue Sulabh Complex",
      bengaliName: "রবীন্দ্র সরোবর শৌচালয়",
      lat: 22.5112,
      lng: 88.3460,
      zone: "south",
      type: "sulabh",
      accessibility: "Near Menoka Cinema",
      cleanliness: "High",
      fee: "₹5"
    },
    {
      id: "washroom_karunamoyee",
      name: "Karunamoyee Central Bus Terminus Washrooms",
      bengaliName: "করুণাময়ী টার্মিনাস শৌচাগার",
      lat: 22.5865,
      lng: 88.4208,
      zone: "east",
      type: "public_terminal",
      accessibility: "24 Hours open",
      cleanliness: "High",
      fee: "₹5"
    },
    {
      id: "washroom_suruchi_new_alipore",
      name: "New Alipore Petrol Pump KMC Sanitation Booth",
      bengaliName: "নিউ আলিপুর শৌচালয়",
      lat: 22.5125,
      lng: 88.3310,
      zone: "behala",
      type: "kmc_public",
      accessibility: "Near Suruchi Sangha entry",
      cleanliness: "Moderate",
      fee: "Free"
    },
    {
      id: "washroom_behala_chowrasta",
      name: "Behala Chowrasta Public Toilet Complex",
      bengaliName: "বেহালা চৌরাস্তা শৌচালয়",
      lat: 22.4935,
      lng: 88.3125,
      zone: "behala",
      type: "kmc_public",
      accessibility: "Behind Tram Depot",
      cleanliness: "Moderate",
      fee: "₹5"
    }
  ],

  // Metro Stations
  metroStations: [
    // Blue Line (North-South)
    { id: "metro_dakshineswar", name: "Dakshineswar Metro", zone: "north", line: "Blue Line", lat: 22.6535, lng: 88.3582 },
    { id: "metro_dumdum", name: "Dum Dum Metro", zone: "north", line: "Blue Line", lat: 22.6225, lng: 88.3948 },
    { id: "metro_belgachia", name: "Belgachia Metro", zone: "north", line: "Blue Line", lat: 22.6074, lng: 88.3842 },
    { id: "metro_shyambazar", name: "Shyambazar Metro", zone: "north", line: "Blue Line", lat: 22.6022, lng: 88.3718 },
    { id: "metro_sovabazar", name: "Sovabazar Sutanuti Metro", zone: "north", line: "Blue Line", lat: 22.5975, lng: 88.3662 },
    { id: "metro_girish_park", name: "Girish Park Metro", zone: "north", line: "Blue Line", lat: 22.5878, lng: 88.3628 },
    { id: "metro_mg_road", name: "Mahatma Gandhi Road Metro", zone: "central", line: "Blue Line", lat: 22.5815, lng: 88.3620 },
    { id: "metro_central", name: "Central Metro", zone: "central", line: "Blue Line", lat: 22.5738, lng: 88.3575 },
    { id: "metro_chandni", name: "Chandni Chowk Metro", zone: "central", line: "Blue Line", lat: 22.5684, lng: 88.3540 },
    { id: "metro_esplanade", name: "Esplanade Intermodal (Blue & Green)", zone: "central", line: "Blue & Green", lat: 22.5645, lng: 88.3516 },
    { id: "metro_park_street", name: "Park Street Metro", zone: "central", line: "Blue Line", lat: 22.5532, lng: 88.3524 },
    { id: "metro_maidaan", name: "Maidan Metro", zone: "central", line: "Blue Line", lat: 22.5458, lng: 88.3498 },
    { id: "metro_rabindra_sadan", name: "Rabindra Sadan Metro", zone: "south", line: "Blue Line", lat: 22.5385, lng: 88.3485 },
    { id: "metro_netaji_bhavan", name: "Netaji Bhavan Metro", zone: "south", line: "Blue Line", lat: 22.5332, lng: 88.3478 },
    { id: "metro_jatin_das", name: "Jatin Das Park Metro (Hazra)", zone: "south", line: "Blue Line", lat: 22.5278, lng: 88.3468 },
    { id: "metro_kalighat", name: "Kalighat Metro", zone: "south", line: "Blue Line", lat: 22.5204, lng: 88.3456 },
    { id: "metro_rabindra_sarobar", name: "Rabindra Sarobar Metro", zone: "south", line: "Blue Line", lat: 22.5115, lng: 88.3458 },
    { id: "metro_mahanayak_uttam", name: "Mahanayak Uttam Kumar (Tollygunge)", zone: "south", line: "Blue Line", lat: 22.4975, lng: 88.3444 },
    { id: "metro_gitanjali", name: "Gitanjali (Naktala) Metro", zone: "south", line: "Blue Line", lat: 22.4735, lng: 88.3638 },
    // Green Line (East-West)
    { id: "metro_sealdah", name: "Sealdah Metro Station", zone: "central", line: "Green Line", lat: 22.5675, lng: 88.3712 },
    { id: "metro_phoolbagan", name: "Phoolbagan Metro", zone: "east", line: "Green Line", lat: 22.5718, lng: 88.3912 },
    { id: "metro_saltlake_stadium", name: "Salt Lake Stadium Metro", zone: "east", line: "Green Line", lat: 22.5712, lng: 88.4068 },
    { id: "metro_karunamoyee", name: "Karunamoyee Metro", zone: "east", line: "Green Line", lat: 22.5862, lng: 88.4202 },
    { id: "metro_sector_v", name: "Salt Lake Sector V Metro", zone: "east", line: "Green Line", lat: 22.5732, lng: 88.4328 },
    { id: "metro_howrah", name: "Howrah Underwater Metro", zone: "central", line: "Green Line", lat: 22.5850, lng: 88.3426 },
    // Purple Line (Behala)
    { id: "metro_taratala", name: "Taratala Metro", zone: "behala", line: "Purple Line", lat: 22.5135, lng: 88.3184 },
    { id: "metro_behala_bazar", name: "Behala Bazar Metro", zone: "behala", line: "Purple Line", lat: 22.4965, lng: 88.3142 },
    { id: "metro_behala_chowrasta", name: "Behala Chowrasta Metro", zone: "behala", line: "Purple Line", lat: 22.4938, lng: 88.3128 }
  ],

  // Key Bus Termini & Stops
  busStops: [
    { id: "bus_dumdum_stn", name: "Dum Dum Station Bus Stand", zone: "north", lat: 22.6230, lng: 88.3955 },
    { id: "bus_laketown_vip", name: "Lake Town VIP Footbridge Stop", zone: "north", lat: 22.5992, lng: 88.4025 },
    { id: "bus_shyam_5point", name: "Shyambazar 5-Point Crossing", zone: "north", lat: 22.6020, lng: 88.3715 },
    { id: "bus_hatibagan", name: "Hatibagan Market Tram Depot", zone: "north", lat: 22.5922, lng: 88.3718 },
    { id: "bus_sealdah_flyover", name: "Sealdah Flyover Bus Terminus", zone: "central", lat: 22.5682, lng: 88.3725 },
    { id: "bus_esplanade_cstc", name: "Esplanade WBTC Central Terminus", zone: "central", lat: 22.5638, lng: 88.3508 },
    { id: "bus_college_st", name: "College Street - Calcutta University", zone: "central", lat: 22.5772, lng: 88.3635 },
    { id: "bus_gariahata", name: "Gariahat Crossing (4 directions)", zone: "south", lat: 22.5186, lng: 88.3656 },
    { id: "bus_deshapriya", name: "Deshapriya Park Bus Stop", zone: "south", lat: 22.5178, lng: 88.3552 },
    { id: "bus_hazra", name: "Hazra Crossing Stop", zone: "south", lat: 22.5275, lng: 88.3465 },
    { id: "bus_karunamoyee", name: "Karunamoyee International Bus Stand", zone: "east", lat: 22.5862, lng: 88.4202 },
    { id: "bus_ultadanga_hudco", name: "Hudco More (Ultadanga)", zone: "east", lat: 22.5942, lng: 88.3985 },
    { id: "bus_taratala", name: "Taratala Crossing Bus Stand", zone: "behala", lat: 22.5132, lng: 88.3180 },
    { id: "bus_behala_chowrasta", name: "Behala Chowrasta Tram Depot", zone: "behala", lat: 22.4940, lng: 88.3130 }
  ],

  // Working ATMs
  atms: [
    { id: "atm_sbi_dumdum", bank: "State Bank of India (SBI)", name: "SBI ATM Dum Dum Station", lat: 22.6228, lng: 88.3942, zone: "north" },
    { id: "atm_hdfc_laketown", bank: "HDFC Bank", name: "HDFC ATM Lake Town Block A", lat: 22.5998, lng: 88.4035, zone: "north" },
    { id: "atm_pnb_shyambazar", bank: "Punjab National Bank", name: "PNB ATM Shyambazar More", lat: 22.6025, lng: 88.3725, zone: "north" },
    { id: "atm_axis_hatibagan", bank: "Axis Bank", name: "Axis ATM Hatibagan", lat: 22.5935, lng: 88.3728, zone: "north" },
    { id: "atm_sbi_sealdah", bank: "State Bank of India", name: "SBI e-Corner Sealdah Station", lat: 22.5672, lng: 88.3715, zone: "central" },
    { id: "atm_icici_collegest", bank: "ICICI Bank", name: "ICICI ATM College Street", lat: 22.5765, lng: 88.3630, zone: "central" },
    { id: "atm_sbi_gariahata", bank: "SBI", name: "SBI Main Branch ATM Gariahat", lat: 22.5182, lng: 88.3650, zone: "south" },
    { id: "atm_hdfc_deshapriya", bank: "HDFC Bank", name: "HDFC ATM Deshapriya Park", lat: 22.5175, lng: 88.3560, zone: "south" },
    { id: "atm_axis_maddox", bank: "Axis Bank", name: "Axis ATM Ritchie Road", lat: 22.5290, lng: 88.3590, zone: "south" },
    { id: "atm_sbi_karunamoyee", bank: "SBI", name: "SBI ATM Central Park Salt Lake", lat: 22.5868, lng: 88.4210, zone: "east" },
    { id: "atm_pnb_new_alipore", bank: "PNB", name: "PNB ATM New Alipore Block O", lat: 22.5115, lng: 88.3318, zone: "behala" }
  ],

  // Emergency & Police Puja Assistance Booths
  policeBooths: [
    { id: "police_dumdum", name: "Dum Dum Police Puja Assistance Booth", phone: "100 / 033-2559-0000", lat: 22.6222, lng: 88.3952, zone: "north" },
    { id: "police_laketown", name: "Lake Town Police & Medical Camp (Sreebhumi)", phone: "100 / 033-2534-1122", lat: 22.5991, lng: 88.4020, zone: "north" },
    { id: "police_shyambazar", name: "Kolkata Police Shyambazar Assistance Post", phone: "100 / 033-2555-1234", lat: 22.6021, lng: 88.3719, zone: "north" },
    { id: "police_sealdah", name: "Sealdah GRP & Kolkata Police Assistance Desk", phone: "100 / 033-2350-3535", lat: 22.5676, lng: 88.3710, zone: "central" },
    { id: "police_college_sq", name: "Amherst Street Police Assistance Post", phone: "100 / 033-2241-1000", lat: 22.5765, lng: 88.3645, zone: "central" },
    { id: "police_gariahata", name: "Gariahat Police Puja Command Center", phone: "100 / 033-2464-1100", lat: 22.5185, lng: 88.3658, zone: "south" },
    { id: "police_maddox", name: "Ballygunge Police Maddox Square Assistance Camp", phone: "100 / 033-2475-2000", lat: 22.5290, lng: 88.3582, zone: "south" },
    { id: "police_karunamoyee", name: "Bidhannagar Police Commissionerate Booth", phone: "100 / 033-2335-8888", lat: 22.5864, lng: 88.4200, zone: "east" },
    { id: "police_new_alipore", name: "New Alipore Police Station Suruchi Camp", phone: "100 / 033-2400-0000", lat: 22.5120, lng: 88.3305, zone: "behala" }
  ]
};
