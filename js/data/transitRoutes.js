// Comprehensive Kolkata Transit Routes: Bus Numbers, Auto-Rickshaw Routes, and Metro Connections

export const AUTO_ROUTES = [
  {
    name: "Shyambazar ➔ Bagbazar Ghat",
    zone: "north",
    standLocation: "Shyambazar 5-Point (Near Metro Gate 1)",
    route: "Shyambazar ➔ Girish Mancha ➔ Bagbazar Street ➔ Bagbazar Ghat",
    fare: "₹15",
    pandalsServed: ["pandal_bagbazar", "pandal_sovabazar_rajbari"]
  },
  {
    name: "Shyambazar ➔ Ultadanga / Hudco",
    zone: "north",
    standLocation: "Shyambazar Tram Depot / RG Kar Road",
    route: "Shyambazar ➔ RG Kar Hospital ➔ Belgachia ➔ Ultadanga Hudco",
    fare: "₹18",
    pandalsServed: ["pandal_tala_barowari", "pandal_telengabagan"]
  },
  {
    name: "Dum Dum Jn ➔ Dum Dum Park / Nagerbazar",
    zone: "north",
    standLocation: "Dum Dum Station Auto Stand (Under Metro Bridge)",
    route: "Dum Dum Station ➔ Private Road ➔ Nagerbazar ➔ Dum Dum Park",
    fare: "₹18 - ₹20",
    pandalsServed: ["pandal_dumdum_tarun_sangha", "pandal_dumdum_bharat_chakra", "pandal_dumdum_tarun_dal"]
  },
  {
    name: "Ultadanga ➔ Lake Town / Sreebhumi",
    zone: "north",
    standLocation: "Ultadanga Station / VIP Road Ramp",
    route: "Ultadanga ➔ Golaghata ➔ Sreebhumi Clock Tower ➔ Lake Town VIP Crossing",
    fare: "₹18",
    pandalsServed: ["pandal_sreebhumi"]
  },
  {
    name: "Sovabazar ➔ Girish Park / Hatibagan",
    zone: "north",
    standLocation: "Sovabazar Metro Gate 2 / BK Paul Ave",
    route: "Sovabazar ➔ BK Paul Ave ➔ Rabindra Sarani ➔ Hatibagan",
    fare: "₹15",
    pandalsServed: ["pandal_kumartuli_park", "pandal_ahiritola", "pandal_hatibagan_sarbojanin"]
  },
  {
    name: "Sealdah ➔ College Street / MG Road",
    zone: "central",
    standLocation: "Sealdah Big Bazar / Station Flyover",
    route: "Sealdah ➔ Baithakkhana ➔ College Street ➔ MG Road",
    fare: "₹15",
    pandalsServed: ["pandal_college_square", "pandal_santosh_mitra_sq"]
  },
  {
    name: "Sealdah ➔ Central / Wellington",
    zone: "central",
    standLocation: "Sealdah Court / BB Ganguly Street",
    route: "Sealdah ➔ Bowbazar ➔ Central Avenue ➔ Subodh Mullick Square",
    fare: "₹15",
    pandalsServed: ["pandal_santosh_mitra_sq", "pandal_bowbazar_sarbojanin", "pandal_subodh_mullick_sq"]
  },
  {
    name: "Gariahat ➔ Rashbehari (Kalighat)",
    zone: "south",
    standLocation: "Gariahat Pantaloons / Ballygunge Phari",
    route: "Gariahat Crossing ➔ Dover Lane ➔ Deshapriya Park ➔ Lake Mall ➔ Kalighat Metro",
    fare: "₹16",
    pandalsServed: ["pandal_ekdalia_evergreen", "pandal_singhi_park", "pandal_deshapriya_park", "pandal_tridhara_sammilani", "pandal_badamtala_ashar"]
  },
  {
    name: "Gariahat ➔ Golpark / Dhakuria / Jodhpur Park",
    zone: "south",
    standLocation: "Gariahat AC Market (Behind Tram Depot)",
    route: "Gariahat ➔ Golpark ➔ Dhakuria Station ➔ Jodhpur Park",
    fare: "₹15",
    pandalsServed: ["pandal_babu_bagan", "pandal_jodhpur_park"]
  },
  {
    name: "Hazra ➔ Kalighat ➔ Chetla",
    zone: "south",
    standLocation: "Jatin Das Park / Hazra Crossing",
    route: "Hazra ➔ Kalighat Fire Station ➔ Chetla Central Road",
    fare: "₹15",
    pandalsServed: ["pandal_chetla_agrani", "pandal_66_pally"]
  },
  {
    name: "Rabindra Sarobar ➔ Mudiali / Southern Ave",
    zone: "south",
    standLocation: "Rabindra Sarobar Metro Gate 1",
    route: "Sarobar Metro ➔ Menoka Cinema ➔ Lake Temple Road ➔ Mudiali",
    fare: "₹15",
    pandalsServed: ["pandal_mudiali_club", "pandal_shiv_mandir"]
  },
  {
    name: "Taratala ➔ Behala Chowrasta / Sakher Bazar",
    zone: "behala",
    standLocation: "Taratala Crossing (Under Flyover)",
    route: "Taratala ➔ Behala Tram Depot ➔ Behala Chowrasta ➔ Sakher Bazar",
    fare: "₹18",
    pandalsServed: ["pandal_behala_club", "pandal_behala_notun_dal", "pandal_barisha_club"]
  },
  {
    name: "Taratala ➔ New Alipore (Suruchi)",
    zone: "behala",
    standLocation: "Taratala Petrol Pump",
    route: "Taratala ➔ SN Roy Road ➔ Suruchi Sangha Ground",
    fare: "₹15",
    pandalsServed: ["pandal_suruchi_sangha"]
  },
  {
    name: "Karunamoyee ➔ Salt Lake Sector V / FD Block",
    zone: "east",
    standLocation: "Karunamoyee Bus Terminus",
    route: "Karunamoyee ➔ Central Park ➔ FD Block ➔ Sector V",
    fare: "₹16",
    pandalsServed: ["pandal_saltlake_fd_block", "pandal_saltlake_bj_block", "pandal_saltlake_ak_block"]
  }
];

export const BUS_ROUTES = [
  // VIP Road / North Corridor (Dum Dum, Lake Town, Sreebhumi, Ultadanga)
  {
    corridor: "VIP Road ➔ Ultadanga ➔ Shyambazar",
    busNumbers: ["30C", "211", "L238", "AC-37", "DN-18", "VS-2", "V-1"],
    stops: ["Dum Dum Park", "Lake Town VIP", "Sreebhumi", "Ultadanga Hudco", "Shyambazar 5-Point"],
    zones: ["north", "east"]
  },
  // Bidhan Sarani / Central Avenue Heritage Corridor (Shyambazar, Hatibagan, College St)
  {
    corridor: "Shyambazar ➔ Hatibagan ➔ MG Road ➔ College Square",
    busNumbers: ["234", "215", "30B", "3C/1", "205", "S-10", "AC-24"],
    stops: ["Shyambazar", "Hatibagan", "Hedua Park", "Girish Park", "MG Road / College St"],
    zones: ["north", "central"]
  },
  // Sealdah & Central Express Corridor
  {
    corridor: "Sealdah ➔ Bowbazar ➔ Central / Esplanade",
    busNumbers: ["24A", "71", "73", "206", "30B/1", "Mini-Sealdah/Howrah"],
    stops: ["Sealdah Station", "Lebutala / Santosh Mitra", "Bowbazar", "Chandni Chowk", "Esplanade"],
    zones: ["central"]
  },
  // North-South Arterial Corridor (Shyambazar to Gariahat / Hazra)
  {
    corridor: "North to South Arterial Corridor",
    busNumbers: ["S-9", "AC-1", "37A", "45B", "212", "E-1"],
    stops: ["Shyambazar", "Sealdah", "Park Circus", "Gariahat", "Golpark"],
    zones: ["north", "central", "south"]
  },
  // Rashbehari / Gariahat Corridor (Ekdalia, Singhi Park, Maddox, Kalighat)
  {
    corridor: "Gariahat ➔ Deshapriya ➔ Kalighat",
    busNumbers: ["1", "1A", "218", "AC-4A", "37", "33"],
    stops: ["Gariahat Crossing", "Deshapriya Park", "Lake Market", "Kalighat Metro", "Hazra"],
    zones: ["south"]
  },
  // Southern Avenue / Lake Corridor
  {
    corridor: "Southern Avenue ➔ Mudiali ➔ Tollygunge",
    busNumbers: ["208", "218", "AC-24", "41"],
    stops: ["Southern Ave", "Menoka Cinema", "Mudiali", "Tollygunge Metro"],
    zones: ["south"]
  },
  // Behala Diamond Harbour Road Corridor
  {
    corridor: "Taratala ➔ Behala Chowrasta ➔ Sakher Bazar",
    busNumbers: ["37", "37A", "12C", "AC-1", "SD-16", "235"],
    stops: ["Taratala", "Behala Tram Depot", "Behala Chowrasta", "Sakher Bazar", "Thakurpukur"],
    zones: ["behala"]
  },
  // Salt Lake Corridor
  {
    corridor: "Ultadanga ➔ Karunamoyee ➔ Sector V",
    busNumbers: ["215A", "201", "AC-39", "S-30", "44A"],
    stops: ["Ultadanga", "Labony", "Central Park", "Karunamoyee", "FD Block", "Sector V"],
    zones: ["east"]
  }
];

/**
 * Returns structured transit options (walk, auto, bus, metro) between two geographic stops
 */
export function getTransitGuidance(from, to, distanceKm) {
  const result = {
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    primaryRecommendation: "",
    walking: null,
    auto: null,
    bus: null,
    metro: null
  };

  // 1. Walking guidance (always calculated)
  const walkMins = Math.max(2, Math.round((distanceKm / 4.0) * 60 * 1.3));
  result.walking = {
    distanceKm: distanceKm,
    formattedDist: distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)} km`,
    durationMins: walkMins,
    instruction: distanceKm <= 1.0 
      ? `Comfortable ${walkMins}-minute festival walk along vibrant pandal street stalls` 
      : `Walk ~${distanceKm.toFixed(1)} km (~${walkMins} mins)`
  };

  // 2. Check for relevant Auto Route
  const matchingAuto = AUTO_ROUTES.find(r => {
    const fromPandalId = from.id;
    const toPandalId = to.id;
    if (fromPandalId && r.pandalsServed.includes(fromPandalId)) return true;
    if (toPandalId && r.pandalsServed.includes(toPandalId)) return true;
    return (from.zone === r.zone && to.zone === r.zone && distanceKm > 0.8 && distanceKm < 3.5);
  });

  if (matchingAuto && distanceKm > 0.7) {
    const autoMins = Math.max(3, Math.round(distanceKm * 3.2 + 2));
    result.auto = {
      name: matchingAuto.name,
      stand: matchingAuto.standLocation,
      route: matchingAuto.route,
      fare: matchingAuto.fare,
      durationMins: autoMins,
      instruction: `Take Shared Auto / Toto from ${matchingAuto.standLocation} (~${matchingAuto.fare}, ${autoMins} mins)`
    };
  }

  // 3. Check for Bus Corridor & Bus Numbers
  const matchingBus = BUS_ROUTES.find(b => {
    return b.zones.includes(from.zone) || b.zones.includes(to.zone);
  });

  if (matchingBus && distanceKm > 0.8) {
    const busMins = Math.max(5, Math.round(distanceKm * 2.8 + 4));
    result.bus = {
      corridor: matchingBus.corridor,
      numbers: matchingBus.busNumbers.slice(0, 5),
      fromStop: from.nearestBusStop || from.name,
      toStop: to.nearestBusStop || to.name,
      durationMins: busMins,
      instruction: `Board Bus ${matchingBus.busNumbers.slice(0, 4).join(', ')} from ${from.nearestBusStop || from.name} (~${busMins} mins)`
    };
  }

  // 4. Check for Metro Route
  if (from.nearestMetro && to.nearestMetro && from.nearestMetro !== to.nearestMetro && distanceKm > 1.2) {
    result.metro = {
      fromStation: from.nearestMetro,
      toStation: to.nearestMetro,
      durationMins: Math.max(4, Math.round(distanceKm * 1.5 + 4)),
      instruction: `Take Metro from ${from.nearestMetro} towards ${to.nearestMetro}`
    };
  }

  // Determine Primary Recommendation
  if (distanceKm <= 0.9) {
    result.primaryRecommendation = `🚶 Walk ${result.walking.formattedDist} (~${walkMins} mins)`;
  } else if (result.auto) {
    result.primaryRecommendation = `🛺 ${result.auto.name} (~${result.auto.fare}, ${result.auto.durationMins} mins)`;
  } else if (result.metro && distanceKm > 2.2) {
    result.primaryRecommendation = `🚇 Metro: ${result.metro.fromStation} ➔ ${result.metro.toStation} (~${result.metro.durationMins} mins)`;
  } else if (result.bus) {
    result.primaryRecommendation = `🚌 Bus: ${result.bus.numbers.slice(0, 3).join(', ')} (~${result.bus.durationMins} mins)`;
  } else {
    result.primaryRecommendation = `🚶 Walk ~${result.walking.formattedDist} or grab local Toto / Rickshaw`;
  }

  return result;
}
