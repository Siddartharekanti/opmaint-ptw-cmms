export type UserRole = 'REQUESTER' | 'AREA_OWNER' | 'SAFETY_OFFICER' | 'ADMIN';

export type PermitStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'CLOSED'
  | 'CLOSED_VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type PermitTypeId =
  | 'HOT_WORK'
  | 'CONFINED_SPACE'
  | 'WORKING_AT_HEIGHT'
  | 'ELECTRICAL_LOTO'
  | 'EXCAVATION';

// Specific data schemas for each permit type
export interface HotWorkData {
  hotWorkType: 'welding' | 'grinding' | 'cutting' | 'soldering';
  fireWatchAssigned: string;
  fireExtinguisherType: 'CO2' | 'DCP' | 'Foam' | 'Water';
  combustiblesClearedRadiusMeters: number;
  gasTestReadings: {
    lelPercent: number;
    o2Percent: number;
    testTime: string;
    testerName: string;
  };
}

export interface ConfinedSpaceData {
  spaceId: string;
  entryPoint: string;
  atmosphericTest: {
    o2Percent: number;
    lelPercent: number;
    h2sPpm: number;
    coPpm: number;
    testTime: string;
  };
  standbyAttendantName: string;
  rescuePlan: string;
  ventilationMethod: 'natural' | 'forced_air' | 'exhaust';
  entryExitLog?: Array<{
    personName: string;
    entryTime: string;
    exitTime?: string;
  }>;
}

export interface WorkingAtHeightData {
  heightInMeters: number;
  accessMethod: 'scaffold' | 'ladder' | 'MEWP' | 'rope';
  fallArrestEquipment: string;
  anchorPointChecked: boolean;
  barricadingBelow: boolean;
}

export interface ElectricalLOTOData {
  equipmentTag: string;
  voltageLevel: string; // e.g. "415V", "11kV"
  isolationPointsList: Array<{
    location: string;
    breakerId: string;
    isolated: boolean;
  }>;
  lockNumbers: string[];
  tagNumbers: string[];
  earthingApplied: boolean;
  testedDeadByWhom: string;
}

export interface ExcavationData {
  depthInMeters: number;
  undergroundServicesChecked: boolean;
  shoringOrBenchingInstalled: boolean;
  spoilPlacementDistanceMeters: number;
  gasTestingRequired: boolean;
}

export type TypeSpecificDataMap = {
  HOT_WORK: HotWorkData;
  CONFINED_SPACE: ConfinedSpaceData;
  WORKING_AT_HEIGHT: WorkingAtHeightData;
  ELECTRICAL_LOTO: ElectricalLOTOData;
  EXCAVATION: ExcavationData;
  [key: string]: Record<string, any>;
};

// Form Field Definition for Extensible Type Registry
export type FieldType = 'text' | 'number' | 'select' | 'boolean' | 'nested_group' | 'array_items';

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  unit?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  helperText?: string;
  nestedFields?: FieldDefinition[];
}

export interface PermitTypeDefinition {
  id: PermitTypeId;
  label: string;
  code: string;
  description: string;
  badgeColor: string;
  borderColor: string;
  bgLightColor: string;
  iconName: string;
  defaultHazards: string[];
  defaultPrecautions: string[];
  fields: FieldDefinition[];
}
