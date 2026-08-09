export const STEP_MINUTES = 2;
const STEPS = 1440 / STEP_MINUTES;
const STEP_HOURS = STEP_MINUTES / 60;

const SUNRISE = 5 * 60 + 40;
const SUNSET = 20 * 60 + 50;

const DC_AC_RATIO = 1.2;
const EXPORT_LIMIT_KW = 750;
const IMPORT_LIMIT_KW = 500;
const SOC_TAPER_BAND = 0.22;
const CHARGE_EFFICIENCY = 0.97;
const DISCHARGE_EFFICIENCY = 0.97;
const PV_TEMP_COEFF = -0.0035;
const NOCT_RISE = 26;
const PEAK_ARBITRAGE_KW = 260;

export type BankStatus = 'charging' | 'discharging' | 'idle';
export type InverterStatus = 'online' | 'derated' | 'fault' | 'standby';
export type AlarmSeverity = 'critical' | 'warning' | 'info';
export type WeatherCondition = 'clear' | 'partly' | 'cloudy' | 'overcast' | 'rain';
export type ChargerStatus = 'charging' | 'idle' | 'fault';

export type Weather = {
  minute: number;
  cloudCover: number;
  temperature: number;
  windKph: number;
  humidity: number;
  precipitation: number;
  condition: WeatherCondition;
};

export type ForecastPoint = {
  minute: number;
  clock: string;
  condition: WeatherCondition;
  temperature: number;
  cloudCover: number;
  precipitation: number;
  pvKw: number;
};

export type ChargerSpec = {
  id: string;
  ratedKw: number;
  connectors: number;
  standard: string;
  faultConnector?: number;
};

export type ConnectorState = {
  index: number;
  status: ChargerStatus;
  powerKw: number;
  vehicleKey?: string;
  progress?: number;
  deliveredKwh?: number;
  remainingMin?: number;
};

export type ChargerState = {
  spec: ChargerSpec;
  powerKw: number;
  status: ChargerStatus;
  utilization: number;
  sessionsToday: number;
  energyTodayKwh: number;
  peakKw: number;
  connectors: ConnectorState[];
};

export type BankSpec = {
  id: string;
  capacityKwh: number;
  powerKw: number;
  soh: number;
  cycles: number;
  startSoc: number;
  chemistry: string;
  cellTempBase: number;
  socMin: number;
  socMax: number;
  dispatchBias: number;
  roundTripEfficiency: number;
};

export type InverterSpec = {
  id: string;
  block: string;
  ratedKw: number;
  strings: number;
  performance: number;
  status: InverterStatus;
};

export type BankState = {
  spec: BankSpec;
  soc: number;
  powerKw: number;
  mode: BankStatus;
  availableKwh: number;
  cellTemp: number;
};

export type StringState = {
  id: string;
  powerKw: number;
  voltage: number;
  current: number;
  ratio: number;
};

export type InverterState = {
  spec: InverterSpec;
  powerKw: number;
  efficiency: number;
  temperature: number;
  strings: StringState[];
};

export type Alarm = {
  id: string;
  severity: AlarmSeverity;
  source: string;
  time: string;
  messageKey: string;
};

export type PlantState = {
  minute: number;
  clock: string;
  pvKw: number;
  loadKw: number;
  siteLoadKw: number;
  evKw: number;
  batteryKw: number;
  gridKw: number;
  curtailedKw: number;
  shavedKw: number;
  irradiance: number;
  weather: Weather;
  forecast: ForecastPoint[];
  banks: BankState[];
  inverters: InverterState[];
  chargers: ChargerState[];
  totals: {
    socPercent: number;
    storedKwh: number;
    capacityKwh: number;
    pvYieldMwh: number;
    exportMwh: number;
    importMwh: number;
    chargedMwh: number;
    dischargedMwh: number;
    selfSufficiency: number;
    onlineInverters: number;
    activeStrings: number;
    evEnergyMwh: number;
    evSessions: number;
    evActiveConnectors: number;
    evUtilization: number;
    evSolarShare: number;
    peakImportKw: number;
    peakExportKw: number;
    shavedMwh: number;
    importLimitUse: number;
    exportLimitUse: number;
  };
  alarms: Alarm[];
};

export const BANKS: BankSpec[] = [
  {
    id: 'BESS-01',
    capacityKwh: 3000,
    powerKw: 1500,
    soh: 98.2,
    cycles: 412,
    startSoc: 0.36,
    chemistry: 'LFP 1P416S',
    cellTempBase: 24.5,
    socMin: 0.1,
    socMax: 0.95,
    dispatchBias: 1,
    roundTripEfficiency: 0.995,
  },
  {
    id: 'BESS-02',
    capacityKwh: 3000,
    powerKw: 1500,
    soh: 96.4,
    cycles: 688,
    startSoc: 0.44,
    chemistry: 'LFP 1P416S',
    cellTempBase: 26.1,
    socMin: 0.18,
    socMax: 0.9,
    dispatchBias: 0.7,
    roundTripEfficiency: 0.965,
  },
  {
    id: 'BESS-03',
    capacityKwh: 5000,
    powerKw: 2500,
    soh: 99.1,
    cycles: 214,
    startSoc: 0.29,
    chemistry: 'LFP 2P416S',
    cellTempBase: 23.8,
    socMin: 0.08,
    socMax: 0.97,
    dispatchBias: 1.3,
    roundTripEfficiency: 1,
  },
];

export const CHARGERS: ChargerSpec[] = [
  { id: 'EVSE-01', ratedKw: 240, connectors: 2, standard: 'CCS2 · 500 A' },
  { id: 'EVSE-02', ratedKw: 200, connectors: 2, standard: 'CCS2 · 400 A' },
  { id: 'EVSE-03', ratedKw: 180, connectors: 2, standard: 'CCS2 · 375 A', faultConnector: 2 },
  { id: 'EVSE-04', ratedKw: 160, connectors: 1, standard: 'CCS2 · 350 A' },
];

const RATED_KW = [125, 125, 120, 120, 110, 110, 110, 100, 100, 125, 120, 115, 110, 105, 100, 125, 120, 110];
const STRING_COUNT = [6, 6, 5, 5, 4, 5, 6, 4, 4, 6, 5, 5, 4, 6, 4, 6, 5, 4];
const PERFORMANCE = [
  0.981, 0.974, 0.968, 0.986, 0.955, 0.972, 0.938, 0.964, 0.979, 0.991, 0.947, 0.962, 0.928, 0.976, 0.958,
  0.983, 0.951, 0.969,
];
const STATUS_OVERRIDES: Record<string, InverterStatus> = {
  'INV-07': 'derated',
  'INV-13': 'fault',
  'INV-16': 'standby',
};

const padId = (prefix: string, index: number) => `${prefix}-${String(index).padStart(2, '0')}`;

export const INVERTERS: InverterSpec[] = RATED_KW.map((ratedKw, index) => {
  const id = padId('INV', index + 1);
  return {
    id,
    block: `Block ${String.fromCharCode(65 + Math.floor(index / 6))}`,
    ratedKw,
    strings: STRING_COUNT[index],
    performance: PERFORMANCE[index],
    status: STATUS_OVERRIDES[id] || 'online',
  };
});

export const PLANT = {
  name: 'Solterra Hybrid Park',
  acCapacityKw: RATED_KW.reduce((sum, kw) => sum + kw, 0),
  dcCapacityKwp: Math.round(RATED_KW.reduce((sum, kw) => sum + kw, 0) * DC_AC_RATIO),
  storageCapacityKwh: BANKS.reduce((sum, bank) => sum + bank.capacityKwh, 0),
  storagePowerKw: BANKS.reduce((sum, bank) => sum + bank.powerKw, 0),
  inverterCount: INVERTERS.length,
  stringCount: STRING_COUNT.reduce((sum, count) => sum + count, 0),
  exportLimitKw: EXPORT_LIMIT_KW,
  importLimitKw: IMPORT_LIMIT_KW,
  chargerCount: CHARGERS.length,
  chargerPowerKw: CHARGERS.reduce((sum, charger) => sum + charger.ratedKw, 0),
  connectorCount: CHARGERS.reduce((sum, charger) => sum + charger.connectors, 0),
};

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const STRING_FAULTS: Record<string, number> = {
  'INV-04:STR-03': 0.61,
  'INV-09:STR-02': 0.44,
  'INV-11:STR-02': 0.78,
  'INV-02:STR-06': 0.83,
  'INV-17:STR-01': 0.87,
};

const STRING_RATIOS: number[][] = INVERTERS.map((inverter, inverterIndex) => {
  const random = mulberry32(1337 + inverterIndex * 97);
  return Array.from({ length: inverter.strings }, (_, stringIndex) => {
    const key = `${inverter.id}:${padId('STR', stringIndex + 1)}`;
    if (STRING_FAULTS[key]) return STRING_FAULTS[key];
    return Number((0.9 + random() * 0.12).toFixed(3));
  });
});

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const bell = (minute: number, center: number, width: number, amplitude: number) =>
  amplitude * Math.exp(-(((minute - center) / width) ** 2));

const cloudCoverAt = (minute: number): number => {
  const nightHaze = bell(minute, 2 * 60, 210, 0.2);
  const morningCumulus = bell(minute, 10 * 60 + 30, 165, 0.32);
  const afternoonFront = bell(minute, 16 * 60 + 40, 110, 0.68);
  const ripple = 0.05 * Math.sin(minute / 53.3) + 0.035 * Math.sin(minute / 23.7);
  return clamp01(0.1 + nightHaze + morningCumulus + afternoonFront + ripple);
};

const precipitationAt = (minute: number): number => {
  const cover = cloudCoverAt(minute);
  if (cover < 0.74) return 0;
  const intensity = (cover - 0.74) / 0.26;
  return intensity * 4.2 * bell(minute, 16 * 60 + 50, 75, 1);
};

const temperatureAt = (minute: number): number =>
  18.6 +
  7.4 * Math.sin((2 * Math.PI * (minute - 570)) / 1440) -
  3.4 * cloudCoverAt(minute) -
  1.8 * Math.min(1, precipitationAt(minute));

const windAt = (minute: number): number =>
  8.5 +
  4.5 * Math.sin((2 * Math.PI * (minute - 420)) / 1440) +
  5.5 * cloudCoverAt(minute) +
  1.4 * Math.sin(minute / 41.3);

const humidityAt = (minute: number): number =>
  Math.max(0.3, Math.min(0.97, 0.72 - 0.015 * (temperatureAt(minute) - 18) + 0.19 * cloudCoverAt(minute) + 0.07 * Math.min(1, precipitationAt(minute))));

const conditionFor = (cloudCover: number, precipitation: number): WeatherCondition => {
  if (precipitation > 0.2) return 'rain';
  if (cloudCover >= 0.82) return 'overcast';
  if (cloudCover >= 0.55) return 'cloudy';
  if (cloudCover >= 0.26) return 'partly';
  return 'clear';
};

export const weatherAt = (minute: number): Weather => {
  const safeMinute = ((minute % 1440) + 1440) % 1440;
  const cloudCover = cloudCoverAt(safeMinute);
  const precipitation = precipitationAt(safeMinute);
  return {
    minute: safeMinute,
    cloudCover,
    temperature: temperatureAt(safeMinute),
    windKph: windAt(safeMinute),
    humidity: humidityAt(safeMinute),
    precipitation,
    condition: conditionFor(cloudCover, precipitation),
  };
};

const irradianceAt = (minute: number): number => {
  if (minute <= SUNRISE || minute >= SUNSET) return 0;
  const x = (minute - SUNRISE) / (SUNSET - SUNRISE);
  const clearSky = Math.sin(Math.PI * x) ** 1.25;
  const transmission = 1 - 0.78 * cloudCoverAt(minute) ** 1.55;
  return Math.max(0, clearSky * transmission);
};

const moduleDerate = (ambient: number, irradiance: number): number =>
  Math.max(0.78, 1 + PV_TEMP_COEFF * (ambient + NOCT_RISE * irradiance - 25));

const siteLoadAt = (minute: number): number =>
  238 +
  bell(minute, 9 * 60, 125, 172) +
  bell(minute, 19 * 60, 155, 248) +
  34 * Math.sin(minute / 77) +
  18 * Math.sin(minute / 29);

const statusFactor = (status: InverterStatus): number => {
  if (status === 'fault' || status === 'standby') return 0;
  if (status === 'derated') return 0.62;
  return 1;
};

const inverterPowerAt = (inverter: InverterSpec, irradiance: number, derate: number): number => {
  const dcAvailable = inverter.ratedKw * DC_AC_RATIO * irradiance * derate;
  const clipped = Math.min(dcAvailable, inverter.ratedKw);
  return clipped * inverter.performance * statusFactor(inverter.status);
};

const pvPotentialAt = (irradiance: number, derate: number): number =>
  INVERTERS.reduce((sum, inverter) => sum + inverterPowerAt(inverter, irradiance, derate), 0);

type Session = {
  id: string;
  connector: number;
  start: number;
  end: number;
  peakKw: number;
  energyKwh: number;
  vehicleKey: string;
};

const VEHICLES = [
  { key: 'SEDAN', batteryKwh: 82, maxKw: 195 },
  { key: 'SUV', batteryKwh: 100, maxKw: 250 },
  { key: 'COMPACT', batteryKwh: 58, maxKw: 125 },
  { key: 'VAN', batteryKwh: 110, maxKw: 165 },
  { key: 'TRUCK', batteryKwh: 336, maxKw: 350 },
];

const SESSION_SHAPE_AVG = 0.87;

const sessionShape = (progress: number): number =>
  progress < 0.6 ? 1 : 1 - 0.65 * ((progress - 0.6) / 0.4);

const arrivalWeight = (minute: number): number =>
  clamp01(
    0.04 +
      bell(minute, 2 * 60 + 30, 110, 0.33) +
      bell(minute, 8 * 60, 95, 0.7) +
      bell(minute, 12 * 60 + 40, 115, 0.42) +
      bell(minute, 18 * 60, 125, 0.86),
  );

const energyDemandFactor = (minute: number): number => {
  const temperature = temperatureAt(minute);
  return 1 + Math.max(0, 12 - temperature) * 0.024 + Math.max(0, temperature - 28) * 0.016;
};

const buildSessions = (spec: ChargerSpec, index: number): Session[] => {
  const random = mulberry32(4200 + index * 977);
  const sessions: Session[] = [];
  const freeAt = Array.from({ length: spec.connectors }, () => 0);
  let minute = random() * 45;
  let counter = 0;

  while (minute < 23 * 60 + 40) {
    const rainDamping = 1 - Math.min(0.6, precipitationAt(minute) * 0.26);
    const chance = clamp01(0.05 + arrivalWeight(minute) * 0.82) * rainDamping;

    if (random() < chance) {
      const connector = freeAt.findIndex(
        (free, slot) => free <= minute && spec.faultConnector !== slot + 1,
      );

      if (connector >= 0) {
        const vehicle = VEHICLES[Math.floor(random() * VEHICLES.length)];
        const socStart = 0.08 + random() * 0.3;
        const socEnd = Math.min(0.95, socStart + 0.34 + random() * 0.38);
        const energyKwh = vehicle.batteryKwh * (socEnd - socStart) * energyDemandFactor(minute);
        const peakKw = Math.min(vehicle.maxKw, spec.ratedKw);
        const end = minute + (energyKwh / (peakKw * SESSION_SHAPE_AVG)) * 60;
        counter += 1;

        sessions.push({
          id: `${spec.id}-S${String(counter).padStart(2, '0')}`,
          connector: connector + 1,
          start: minute,
          end,
          peakKw,
          energyKwh,
          vehicleKey: `_BESS_VEH_${vehicle.key}`,
        });

        freeAt[connector] = end + 5 + random() * 14;
      }
    }

    minute += 9 + random() * 15;
  }

  return sessions;
};

type EvModel = {
  sessions: Session[][];
  perCharger: number[][];
  total: number[];
  cumulativeKwh: number[][];
  peaks: number[][];
  occupied: number[][];
};

let evCache: EvModel | null = null;

const ev = (): EvModel => {
  if (evCache) return evCache;

  const sessions = CHARGERS.map((spec, index) => buildSessions(spec, index));
  const perCharger = CHARGERS.map(() => new Array<number>(STEPS).fill(0));
  const total = new Array<number>(STEPS).fill(0);
  const cumulativeKwh = CHARGERS.map(() => new Array<number>(STEPS).fill(0));
  const peaks = CHARGERS.map(() => new Array<number>(STEPS).fill(0));
  const occupied = CHARGERS.map(() => new Array<number>(STEPS).fill(0));

  CHARGERS.forEach((spec, chargerIndex) => {
    let energy = 0;
    let peak = 0;
    let busySteps = 0;

    for (let step = 0; step < STEPS; step += 1) {
      const minute = step * STEP_MINUTES;
      let power = 0;
      let active = 0;

      for (const session of sessions[chargerIndex]) {
        if (minute < session.start || minute >= session.end) continue;
        power += session.peakKw * sessionShape((minute - session.start) / (session.end - session.start));
        active += 1;
      }

      if (power > spec.ratedKw) power = spec.ratedKw;
      if (active > 0) busySteps += 1;

      energy += power * STEP_HOURS;
      peak = Math.max(peak, power);

      perCharger[chargerIndex][step] = power;
      total[step] += power;
      cumulativeKwh[chargerIndex][step] = energy;
      peaks[chargerIndex][step] = peak;
      occupied[chargerIndex][step] = busySteps;
    }
  });

  evCache = { sessions, perCharger, total, cumulativeKwh, peaks, occupied };
  return evCache;
};

type Step = {
  pvKw: number;
  loadKw: number;
  siteLoadKw: number;
  evKw: number;
  batteryKw: number;
  gridKw: number;
  curtailedKw: number;
  shavedKw: number;
  peakImportKw: number;
  peakExportKw: number;
  shavedMwh: number;
  irradiance: number;
  derate: number;
  socs: number[];
  bankPowers: number[];
  pvYieldMwh: number;
  exportMwh: number;
  importMwh: number;
  chargedMwh: number;
  dischargedMwh: number;
  loadMwh: number;
  selfServedMwh: number;
  evEnergyMwh: number;
  evGreenMwh: number;
};

const taper = (bank: BankSpec, soc: number, charging: boolean): number => {
  const headroom = charging ? bank.socMax - soc : soc - bank.socMin;
  return Math.max(0, Math.min(1, headroom / SOC_TAPER_BAND));
};

const allocate = (command: number, socs: number[]): number[] => {
  if (Math.abs(command) < 1) return BANKS.map(() => 0);
  const charging = command < 0;
  const weights = BANKS.map((bank, index) => {
    const headroom = charging ? bank.socMax - socs[index] : socs[index] - bank.socMin;
    return headroom <= 0 ? 0 : bank.powerKw * headroom * bank.dispatchBias;
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return BANKS.map(() => 0);

  return BANKS.map((bank, index) => {
    const share = (command * weights[index]) / total;
    const limit = bank.powerKw * (bank.soh / 100) * taper(bank, socs[index], charging);
    return Math.max(-limit, Math.min(limit, share));
  });
};

const buildDay = (initialSocs: number[]): { steps: Step[]; endSocs: number[] } => {
  const steps: Step[] = [];
  let socs = [...initialSocs];
  let pvYield = 0;
  let exported = 0;
  let imported = 0;
  let charged = 0;
  let discharged = 0;
  let loadEnergy = 0;
  let selfServed = 0;
  let evEnergy = 0;
  let evGreen = 0;
  let shavedEnergy = 0;
  let peakImport = 0;
  let peakExport = 0;
  const evPower = ev().total;

  for (let step = 0; step < STEPS; step += 1) {
    const minute = step * STEP_MINUTES;
    const irradiance = irradianceAt(minute);
    const derate = moduleDerate(temperatureAt(minute), irradiance);
    let pvKw = pvPotentialAt(irradiance, derate);
    const siteLoadKw = siteLoadAt(minute);
    const evKw = evPower[step];
    const loadKw = siteLoadKw + evKw;
    const surplus = pvKw - loadKw;

    const isEveningPeak = minute >= 17 * 60 + 30 && minute < 22 * 60;
    const isOffPeak = minute < 6 * 60 || minute >= 23 * 60;

    let command: number;
    if (surplus > 25) {
      command = -surplus;
    } else if (isEveningPeak) {
      command = Math.max(0, loadKw * 0.95 - Math.max(0, pvKw)) + PEAK_ARBITRAGE_KW;
    } else if (isOffPeak) {
      command = Math.max(0, -surplus) * 0.35;
    } else {
      command = Math.max(0, -surplus) * 0.85;
    }

    let bankPowers = allocate(command, socs);
    let batteryKw = bankPowers.reduce((sum, power) => sum + power, 0);
    let gridKw = loadKw - pvKw - batteryKw;

    let shavedKw = 0;
    if (gridKw > IMPORT_LIMIT_KW) {
      const boosted = allocate(command + (gridKw - IMPORT_LIMIT_KW), socs);
      const boostedKw = boosted.reduce((sum, power) => sum + power, 0);
      shavedKw = Math.max(0, boostedKw - batteryKw);
      bankPowers = boosted;
      batteryKw = boostedKw;
      gridKw = loadKw - pvKw - batteryKw;
    }

    let curtailedKw = 0;
    if (gridKw < -EXPORT_LIMIT_KW) {
      curtailedKw = Math.min(-gridKw - EXPORT_LIMIT_KW, pvKw);
      pvKw -= curtailedKw;
      gridKw = loadKw - pvKw - batteryKw;
    }

    socs = socs.map((soc, index) => {
      const bank = BANKS[index];
      const power = bankPowers[index];
      const capacity = bank.capacityKwh;
      const delta =
        power < 0
          ? (-power * STEP_HOURS * CHARGE_EFFICIENCY * bank.roundTripEfficiency) / capacity
          : -(power * STEP_HOURS) / (DISCHARGE_EFFICIENCY * bank.roundTripEfficiency * capacity);
      return Math.max(bank.socMin, Math.min(bank.socMax, soc + delta));
    });

    const pvToLoad = Math.min(pvKw, loadKw);
    const batteryToLoad = Math.min(Math.max(batteryKw, 0), loadKw - pvToLoad);
    const greenShare = loadKw > 0 ? (pvToLoad + batteryToLoad) / loadKw : 1;

    pvYield += (pvKw * STEP_HOURS) / 1000;
    loadEnergy += (loadKw * STEP_HOURS) / 1000;
    selfServed += ((pvToLoad + batteryToLoad) * STEP_HOURS) / 1000;
    evEnergy += (evKw * STEP_HOURS) / 1000;
    evGreen += (evKw * greenShare * STEP_HOURS) / 1000;
    shavedEnergy += (shavedKw * STEP_HOURS) / 1000;
    peakImport = Math.max(peakImport, gridKw);
    peakExport = Math.max(peakExport, -gridKw);
    if (gridKw < 0) exported += (-gridKw * STEP_HOURS) / 1000;
    else imported += (gridKw * STEP_HOURS) / 1000;
    if (batteryKw < 0) charged += (-batteryKw * STEP_HOURS) / 1000;
    else discharged += (batteryKw * STEP_HOURS) / 1000;

    steps.push({
      pvKw,
      loadKw,
      siteLoadKw,
      evKw,
      batteryKw,
      gridKw,
      curtailedKw,
      shavedKw,
      peakImportKw: peakImport,
      peakExportKw: peakExport,
      shavedMwh: shavedEnergy,
      irradiance,
      derate,
      socs: [...socs],
      bankPowers,
      pvYieldMwh: pvYield,
      exportMwh: exported,
      importMwh: imported,
      chargedMwh: charged,
      dischargedMwh: discharged,
      loadMwh: loadEnergy,
      selfServedMwh: selfServed,
      evEnergyMwh: evEnergy,
      evGreenMwh: evGreen,
    });
  }

  return { steps, endSocs: socs };
};

let dayCache: Step[] | null = null;
const day = (): Step[] => {
  if (!dayCache) {
    let socs = BANKS.map(bank => bank.startSoc);
    let run = buildDay(socs);
    for (let pass = 0; pass < 12; pass += 1) {
      const drift = run.endSocs.reduce((max, soc, index) => Math.max(max, Math.abs(soc - socs[index])), 0);
      if (drift < 0.0005) break;
      socs = run.endSocs;
      run = buildDay(socs);
    }
    dayCache = run.steps;
  }
  return dayCache;
};

export const clampMinute = (minute: number): number => ((minute % 1440) + 1440) % 1440;

export const formatClock = (minute: number): string => {
  const m = Math.floor(clampMinute(minute));
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

export const powerMode = (powerKw: number): BankStatus => {
  if (powerKw < -5) return 'charging';
  if (powerKw > 5) return 'discharging';
  return 'idle';
};

const buildChargers = (minute: number, step: number): ChargerState[] => {
  const model = ev();
  const elapsedSteps = step + 1;

  return CHARGERS.map((spec, index) => {
    const powerKw = model.perCharger[index][step];
    const active = model.sessions[index].filter(
      session => minute >= session.start && minute < session.end,
    );
    const requested = active.reduce(
      (sum, session) => sum + session.peakKw * sessionShape((minute - session.start) / (session.end - session.start)),
      0,
    );
    const scale = requested > spec.ratedKw ? spec.ratedKw / requested : 1;

    const connectors: ConnectorState[] = Array.from({ length: spec.connectors }, (_, slot) => {
      const index1 = slot + 1;
      if (spec.faultConnector === index1) {
        return { index: index1, status: 'fault' as ChargerStatus, powerKw: 0 };
      }

      const session = active.find(item => item.connector === index1);
      if (!session) {
        const status: ChargerStatus = spec.faultConnector === index1 ? 'fault' : 'idle';
        return { index: index1, status, powerKw: 0 };
      }

      const progress = (minute - session.start) / (session.end - session.start);
      return {
        index: index1,
        status: 'charging' as ChargerStatus,
        powerKw: session.peakKw * sessionShape(progress) * scale,
        vehicleKey: session.vehicleKey,
        progress,
        deliveredKwh: session.energyKwh * progress,
        remainingMin: Math.max(0, Math.round(session.end - minute)),
      };
    });

    const faulted = spec.faultConnector !== undefined;
    const status: ChargerStatus = powerKw > 0.5 ? 'charging' : faulted ? 'fault' : 'idle';

    return {
      spec,
      powerKw,
      status,
      utilization: (model.occupied[index][step] / elapsedSteps) * 100,
      sessionsToday: model.sessions[index].filter(session => session.start <= minute).length,
      energyTodayKwh: model.cumulativeKwh[index][step],
      peakKw: model.peaks[index][step],
      connectors,
    };
  });
};

export const getForecast = (minute: number, hours = 8): ForecastPoint[] => {
  const start = Math.ceil((clampMinute(minute) + 1) / 60) * 60;

  return Array.from({ length: hours }, (_, index) => {
    const raw = start + index * 60;
    const safeMinute = clampMinute(raw);
    const forecast = weatherAt(safeMinute);
    const irradiance = irradianceAt(safeMinute);

    return {
      minute: safeMinute,
      clock: formatClock(safeMinute),
      condition: forecast.condition,
      temperature: forecast.temperature,
      cloudCover: forecast.cloudCover,
      precipitation: forecast.precipitation,
      pvKw: pvPotentialAt(irradiance, moduleDerate(forecast.temperature, irradiance)),
    };
  });
};

const buildInverters = (irradiance: number, minute: number, derate: number, curtailFactor: number): InverterState[] =>
  INVERTERS.map((spec, inverterIndex) => {
    const powerKw = inverterPowerAt(spec, irradiance, derate) * curtailFactor;
    const ratios = STRING_RATIOS[inverterIndex];
    const ratioSum = ratios.reduce((sum, ratio) => sum + ratio, 0);
    const loadRatio = powerKw / spec.ratedKw;

    const strings: StringState[] = ratios.map((ratio, stringIndex) => {
      const stringPower = ratioSum > 0 ? (powerKw * ratio) / ratioSum : 0;
      const voltage = powerKw > 0 ? 742 + ratio * 46 - irradiance * 28 : 0;
      const current = voltage > 0 ? (stringPower * 1000) / voltage : 0;
      return {
        id: padId('STR', stringIndex + 1),
        powerKw: stringPower,
        voltage,
        current,
        ratio,
      };
    });

    const efficiency = powerKw > 0 ? 96.4 + Math.min(2.2, loadRatio * 2.6) - (spec.status === 'derated' ? 1.6 : 0) : 0;
    const temperature =
      spec.status === 'fault'
        ? 21 + 4 * Math.sin(minute / 180)
        : 26 + loadRatio * 26 + (spec.status === 'derated' ? 12 : 0) + 3 * Math.sin(minute / 97 + inverterIndex);

    return { spec, powerKw, efficiency, temperature, strings };
  });

const buildAlarms = (curtailedKw: number, evKw: number, shavedKw: number): Alarm[] => {
  const alarms: Alarm[] = [
    { id: 'a1', severity: 'critical', source: 'INV-13', time: '06:42', messageKey: '_BESS_ALARM_M1' },
    { id: 'a2', severity: 'warning', source: 'INV-09 / STR-02', time: '09:05', messageKey: '_BESS_ALARM_M2' },
    { id: 'a3', severity: 'warning', source: 'INV-07', time: '12:18', messageKey: '_BESS_ALARM_M3' },
    { id: 'a4', severity: 'warning', source: 'INV-04 / STR-03', time: '07:51', messageKey: '_BESS_ALARM_M4' },
    { id: 'a7', severity: 'warning', source: 'EVSE-03 / CON-02', time: '10:26', messageKey: '_BESS_ALARM_M7' },
    { id: 'a5', severity: 'info', source: 'BESS-02', time: '04:10', messageKey: '_BESS_ALARM_M5' },
    { id: 'a6', severity: 'info', source: 'INV-16', time: '05:30', messageKey: '_BESS_ALARM_M6' },
  ];

  if (curtailedKw > 1) {
    alarms.unshift({
      id: 'a0',
      severity: 'warning',
      source: 'AC BUS / POI',
      time: '—',
      messageKey: '_BESS_ALARM_M0',
    });
  }

  if (shavedKw > 1) {
    alarms.unshift({
      id: 'a9',
      severity: 'warning',
      source: 'POI / BESS',
      time: '—',
      messageKey: '_BESS_ALARM_M9',
    });
  }

  if (evKw > PLANT.chargerPowerKw * 0.7) {
    alarms.unshift({
      id: 'a8',
      severity: 'info',
      source: 'EV HUB',
      time: '—',
      messageKey: '_BESS_ALARM_M8',
    });
  }

  return alarms;
};

export const getPlantState = (minute: number): PlantState => {
  const safeMinute = clampMinute(minute);
  const steps = day();
  const stepIndex = Math.min(STEPS - 1, Math.floor(safeMinute / STEP_MINUTES));
  const step = steps[stepIndex];
  const uncurtailed = step.pvKw + step.curtailedKw;
  const curtailFactor = uncurtailed > 0 ? step.pvKw / uncurtailed : 1;
  const inverters = buildInverters(step.irradiance, safeMinute, step.derate, curtailFactor);
  const chargers = buildChargers(safeMinute, stepIndex);

  const banks: BankState[] = BANKS.map((spec, index) => {
    const soc = step.socs[index];
    const powerKw = step.bankPowers[index];
    return {
      spec,
      soc,
      powerKw,
      mode: powerMode(powerKw),
      availableKwh: Math.max(0, soc - spec.socMin) * spec.capacityKwh * (spec.soh / 100),
      cellTemp: spec.cellTempBase + Math.abs(powerKw) / 155 + 1.4 * Math.sin(safeMinute / 141 + index),
    };
  });

  const storedKwh = banks.reduce((sum, bank) => sum + bank.soc * bank.spec.capacityKwh, 0);
  const activeStrings = inverters.reduce(
    (sum, inverter) => sum + inverter.strings.filter(item => item.powerKw > 0.2).length,
    0,
  );
  const activeConnectors = chargers.reduce(
    (sum, charger) => sum + charger.connectors.filter(item => item.status === 'charging').length,
    0,
  );
  const usableConnectors = CHARGERS.reduce(
    (sum, charger) => sum + charger.connectors - (charger.faultConnector === undefined ? 0 : 1),
    0,
  );

  return {
    minute: safeMinute,
    clock: formatClock(safeMinute),
    pvKw: step.pvKw,
    loadKw: step.loadKw,
    siteLoadKw: step.siteLoadKw,
    evKw: step.evKw,
    batteryKw: step.batteryKw,
    gridKw: step.gridKw,
    curtailedKw: step.curtailedKw,
    shavedKw: step.shavedKw,
    irradiance: step.irradiance,
    weather: weatherAt(safeMinute),
    forecast: getForecast(safeMinute),
    banks,
    inverters,
    chargers,
    totals: {
      socPercent: (storedKwh / PLANT.storageCapacityKwh) * 100,
      storedKwh,
      capacityKwh: PLANT.storageCapacityKwh,
      pvYieldMwh: step.pvYieldMwh,
      exportMwh: step.exportMwh,
      importMwh: step.importMwh,
      chargedMwh: step.chargedMwh,
      dischargedMwh: step.dischargedMwh,
      selfSufficiency: step.loadMwh > 0 ? Math.min(100, (step.selfServedMwh / step.loadMwh) * 100) : 100,
      onlineInverters: INVERTERS.filter(inverter => inverter.status === 'online' || inverter.status === 'derated')
        .length,
      activeStrings,
      evEnergyMwh: step.evEnergyMwh,
      evSessions: chargers.reduce((sum, charger) => sum + charger.sessionsToday, 0),
      evActiveConnectors: activeConnectors,
      evUtilization: usableConnectors > 0 ? (activeConnectors / usableConnectors) * 100 : 0,
      evSolarShare: step.evEnergyMwh > 0 ? (step.evGreenMwh / step.evEnergyMwh) * 100 : 0,
      peakImportKw: step.peakImportKw,
      peakExportKw: step.peakExportKw,
      shavedMwh: step.shavedMwh,
      importLimitUse: (Math.max(0, step.gridKw) / IMPORT_LIMIT_KW) * 100,
      exportLimitUse: (Math.max(0, -step.gridKw) / EXPORT_LIMIT_KW) * 100,
    },
    alarms: buildAlarms(step.curtailedKw, step.evKw, step.shavedKw),
  };
};

export type SeriesPoint = {
  minute: number;
  pvKw: number;
  loadKw: number;
  evKw: number;
  batteryKw: number;
  gridKw: number;
  socPercent: number;
};

export const getDaySeries = (resolutionMinutes = 20): SeriesPoint[] => {
  const steps = day();
  const points: SeriesPoint[] = [];
  for (let minute = 0; minute <= 1440 - resolutionMinutes; minute += resolutionMinutes) {
    const step = steps[Math.min(STEPS - 1, Math.floor(minute / STEP_MINUTES))];
    const stored = step.socs.reduce((sum, soc, index) => sum + soc * BANKS[index].capacityKwh, 0);
    points.push({
      minute,
      pvKw: step.pvKw,
      loadKw: step.loadKw,
      evKw: step.evKw,
      batteryKw: step.batteryKw,
      gridKw: step.gridKw,
      socPercent: (stored / PLANT.storageCapacityKwh) * 100,
    });
  }
  return points;
};

export type HourlyExchange = {
  hour: number;
  importKwh: number;
  exportKwh: number;
  peakImportKw: number;
  peakExportKw: number;
  evKwh: number;
  pvKwh: number;
  elapsed: boolean;
};

export const getHourlyExchange = (minute: number): HourlyExchange[] => {
  const steps = day();
  const current = clampMinute(minute);

  return Array.from({ length: 24 }, (_, hour) => {
    const from = Math.floor((hour * 60) / STEP_MINUTES);
    const to = Math.floor(((hour + 1) * 60) / STEP_MINUTES);
    let importKwh = 0;
    let exportKwh = 0;
    let peakImportKw = 0;
    let peakExportKw = 0;
    let evKwh = 0;
    let pvKwh = 0;

    for (let index = from; index < to; index += 1) {
      const step = steps[index];
      if (step.gridKw > 0) {
        importKwh += step.gridKw * STEP_HOURS;
        peakImportKw = Math.max(peakImportKw, step.gridKw);
      } else {
        exportKwh += -step.gridKw * STEP_HOURS;
        peakExportKw = Math.max(peakExportKw, -step.gridKw);
      }
      evKwh += step.evKw * STEP_HOURS;
      pvKwh += step.pvKw * STEP_HOURS;
    }

    return {
      hour,
      importKwh,
      exportKwh,
      peakImportKw,
      peakExportKw,
      evKwh,
      pvKwh,
      elapsed: hour * 60 <= current,
    };
  });
};

export const INITIAL_MINUTE = 13 * 60 + 20;

export const formatPower = (kw: number, digits = 0): string => {
  const abs = Math.abs(kw);
  if (abs >= 1000) return `${(kw / 1000).toFixed(2)} MW`;
  return `${kw.toFixed(digits)} kW`;
};

export const formatKw = (kw: number, digits = 0): string => `${kw.toFixed(digits)} kW`;

export const formatMwh = (mwh: number, digits = 1): string => `${mwh.toFixed(digits)} MWh`;

export const stringHealth = (ratio: number): 'good' | 'fair' | 'watch' | 'poor' => {
  if (ratio >= 0.96) return 'good';
  if (ratio >= 0.9) return 'fair';
  if (ratio >= 0.8) return 'watch';
  return 'poor';
};
