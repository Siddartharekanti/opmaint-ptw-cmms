import { UserRole } from './types/permit';

export const DEMO_USERS = [
  {
    role: 'REQUESTER' as UserRole,
    email: 'rajesh.technician@opmaint.com',
    name: 'Rajesh Kumar',
    department: 'Mechanical Maintenance',
    designation: 'Contractor Supervisor / Technician',
    passwordHint: 'Password123!',
  },
  {
    role: 'AREA_OWNER' as UserRole,
    email: 'suresh.areaowner@opmaint.com',
    name: 'Suresh Raina',
    department: 'Boiler & Utilities Operations',
    designation: 'Area Owner (Boiler House & Reactor Bay)',
    passwordHint: 'Password123!',
  },
  {
    role: 'SAFETY_OFFICER' as UserRole,
    email: 'priya.safety@opmaint.com',
    name: 'Priya Sharma',
    department: 'EHS (Environmental Health & Safety)',
    designation: 'Lead Plant Safety Officer',
    passwordHint: 'Password123!',
  },
  {
    role: 'ADMIN' as UserRole,
    email: 'admin@opmaint.com',
    name: 'K. Admin',
    department: 'Plant Operations Directorate',
    designation: 'CMMS Super Admin',
    passwordHint: 'Password123!',
  },
];
