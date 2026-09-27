const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive PTW CMMS database seed...');

  // Clean existing tables (order matters for foreign keys)
  await prisma.workLog.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.permit.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.area.deleteMany();
  await prisma.plant.deleteMany();

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create Plants
  console.log('Creating Plants...');
  const plantChennai = await prisma.plant.create({
    data: {
      name: 'Chennai Heavy Manufacturing Complex',
      code: 'CH-01',
      location: 'Ambattur Industrial Estate, Chennai, Tamil Nadu',
    },
  });

  const plantSriperumbudur = await prisma.plant.create({
    data: {
      name: 'Sriperumbudur Chemical & Processing Plant',
      code: 'SP-02',
      location: 'SIPCOT Industrial Park Phase II, Sriperumbudur, Tamil Nadu',
    },
  });

  // 2. Create Areas for each plant
  console.log('Creating Plant Areas...');
  const areaBoilerHouse = await prisma.area.create({
    data: {
      name: 'Boiler & Utilities House',
      code: 'BLR-01',
      plantId: plantChennai.id,
    },
  });

  const areaAssembly = await prisma.area.create({
    data: {
      name: 'Heavy Assembly Line 1',
      code: 'ASM-01',
      plantId: plantChennai.id,
    },
  });

  const areaPaintShop = await prisma.area.create({
    data: {
      name: 'Electrostatic Paint Shop',
      code: 'PNT-02',
      plantId: plantChennai.id,
    },
  });

  const areaReactorBay = await prisma.area.create({
    data: {
      name: 'Polymer Reactor Bay',
      code: 'RCT-01',
      plantId: plantSriperumbudur.id,
    },
  });

  const areaSolventStorage = await prisma.area.create({
    data: {
      name: 'Volatile Solvent Tank Farm',
      code: 'SLV-01',
      plantId: plantSriperumbudur.id,
    },
  });

  // 3. Create Equipment items (~6 items across areas)
  console.log('Creating Equipment Items...');
  const eqBoiler = await prisma.equipment.create({
    data: {
      name: 'High Pressure Water-Tube Boiler HP-01',
      tag: 'BOILER-HP-01',
      areaId: areaBoilerHouse.id,
      criticality: 'CRITICAL',
    },
  });

  const eqSteamLine = await prisma.equipment.create({
    data: {
      name: 'Main High-Pressure Steam Distribution Header A',
      tag: 'STM-LINE-A',
      areaId: areaBoilerHouse.id,
      criticality: 'HIGH',
    },
  });

  const eqOverheadCrane = await prisma.equipment.create({
    data: {
      name: '50-Ton Heavy Bay Overhead Gantry Crane C1',
      tag: 'CRN-OVH-C1',
      areaId: areaAssembly.id,
      criticality: 'HIGH',
    },
  });

  const eqPaintBooth = await prisma.equipment.create({
    data: {
      name: 'Automated Downdraft Paint Spray Booth 02',
      tag: 'PNT-BTH-02',
      areaId: areaPaintShop.id,
      criticality: 'HIGH',
    },
  });

  const eqReactor = await prisma.equipment.create({
    data: {
      name: 'Jacketed Polymerization Reactor Vessel R-101',
      tag: 'RCT-VESSEL-R101',
      areaId: areaReactorBay.id,
      criticality: 'CRITICAL',
    },
  });

  const eqSolventPump = await prisma.equipment.create({
    data: {
      name: 'Ex-Proof Chemical Solvent Transfer Pump P-04',
      tag: 'SLV-PMP-P04',
      areaId: areaSolventStorage.id,
      criticality: 'HIGH',
    },
  });

  // 4. Create 4 Users (one per role)
  console.log('Creating Users...');
  const userRequester = await prisma.user.create({
    data: {
      email: 'rajesh.technician@opmaint.com',
      password: hashedPassword,
      name: 'Rajesh Kumar',
      role: 'REQUESTER',
      department: 'Mechanical Maintenance Department',
      phone: '+91 98401 23456',
    },
  });

  const userAreaOwner = await prisma.user.create({
    data: {
      email: 'suresh.areaowner@opmaint.com',
      password: hashedPassword,
      name: 'Suresh Raina',
      role: 'AREA_OWNER',
      department: 'Boiler & Utilities Operations',
      phone: '+91 98402 34567',
      assignedAreaId: areaBoilerHouse.id, // Assigned to Boiler House
    },
  });

  const userSafetyOfficer = await prisma.user.create({
    data: {
      email: 'priya.safety@opmaint.com',
      password: hashedPassword,
      name: 'Priya Sharma',
      role: 'SAFETY_OFFICER',
      department: 'Environmental Health & Safety (EHS)',
      phone: '+91 98403 45678',
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      email: 'admin@opmaint.com',
      password: hashedPassword,
      name: 'K. Admin',
      role: 'ADMIN',
      department: 'Plant Operations Management',
      phone: '+91 98404 56789',
    },
  });

  // Times reference
  const now = new Date();
  const past2h = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const past6h = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const past48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const future1h = new Date(now.getTime() + 1 * 60 * 60 * 1000); // For expiring soon!
  const future4h = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  const future8h = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const future24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  console.log('Creating 11 Permits spanning all lifecycle states...');

  // PERMIT 1: DRAFT (Hot Work)
  const p1 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0001',
      title: 'TIG Welding on Steam Line A Bypass Manifold',
      description: 'Replace corroded 4-inch bypass valve flange and re-weld schedule 80 carbon steel pipe elbow on Steam Line A.',
      permitType: 'HOT_WORK',
      status: 'DRAFT',
      plantId: plantChennai.id,
      areaId: areaBoilerHouse.id,
      equipmentId: eqSteamLine.id,
      requesterId: userRequester.id,
      contractorTeam: 'Apex Industrial Piping Ltd.',
      plannedStartTime: future4h,
      plannedEndTime: future8h,
      hazardsIdentified: JSON.stringify([
        'Flammable gas / vapor release',
        'Sparks / slag ignition of combustible material',
        'Flash burn / radiant heat injury',
      ]),
      ppeRequired: JSON.stringify([
        'Welding Helmet (Auto-darkening)',
        'Leather Welding Gloves & Apron',
        'Safety Boots (Steel Toe)',
        'Safety Glasses (UV Filter)',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Combustible materials removed or covered within 10 meters radius', verified: true },
        { text: 'Dedicated Fire Watch assigned with immediate continuous monitoring', verified: true },
        { text: 'Appropriate pressurized Fire Extinguisher inspected & positioned at point of work', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: 'welding',
        fireWatchAssigned: 'K. Balaji (Badge #FW-102)',
        fireExtinguisherType: 'DCP',
        combustiblesClearedRadiusMeters: 10,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: '2026-09-27 10:00',
          testerName: 'Rajesh Kumar',
        },
      }),
    },
  });

  await prisma.auditLog.create({
    data: {
      permitId: p1.id,
      userId: userRequester.id,
      userName: userRequester.name,
      userRole: userRequester.role,
      action: 'CREATED_DRAFT',
      fromStatus: null,
      toStatus: 'DRAFT',
      comment: 'Initial draft permit created by technician.',
    },
  });

  // PERMIT 2: PENDING_APPROVAL (Hot Work awaiting both approvals)
  const p2 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0002',
      title: 'Structural Bracket Welding onto Boiler Framework',
      description: 'Weld support gusset plates onto primary boiler structure frame to mount auxiliary feed line.',
      permitType: 'HOT_WORK',
      status: 'PENDING_APPROVAL',
      plantId: plantChennai.id,
      areaId: areaBoilerHouse.id,
      equipmentId: eqBoiler.id,
      requesterId: userRequester.id,
      contractorTeam: 'TVS Infrastructure Maintenance',
      plannedStartTime: future4h,
      plannedEndTime: future8h,
      hazardsIdentified: JSON.stringify([
        'Open flame and hot slag spatter',
        'Adjacent hot thermal oil pipe exposure',
        'High noise levels',
      ]),
      ppeRequired: JSON.stringify([
        'Safety Helmet',
        'Welding Face Shield',
        'Heavy Split-Cowhide Leather Sleeves',
        'Ear Plugs',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Combustible materials removed or covered within 10 meters radius', verified: true },
        { text: 'Dedicated Fire Watch assigned with immediate continuous monitoring', verified: true },
        { text: 'Appropriate pressurized Fire Extinguisher inspected & positioned at point of work', verified: true },
        { text: 'Gas atmospheric testing verified safe (< 1% LEL, 19.5% - 23.5% O2)', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: 'welding',
        fireWatchAssigned: 'M. Selvam (Badge #FW-309)',
        fireExtinguisherType: 'CO2',
        combustiblesClearedRadiusMeters: 12,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.8,
          testTime: '2026-09-27 12:30',
          testerName: 'S. Ramanathan',
        },
      }),
    },
  });

  await prisma.auditLog.create({
    data: {
      permitId: p2.id,
      userId: userRequester.id,
      userName: userRequester.name,
      userRole: userRequester.role,
      action: 'SUBMITTED',
      fromStatus: 'DRAFT',
      toStatus: 'PENDING_APPROVAL',
      comment: 'Permit submitted for dual Area Owner and Safety Officer sign-off.',
    },
  });

  // PERMIT 3: PENDING_APPROVAL (Confined Space Entry with Area Owner approved, waiting Safety Officer)
  const p3 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0003',
      title: 'Internal Inspection of Boiler Mud Drum HP-01',
      description: 'Perform internal non-destructive ultrasonic wall thickness testing and sludge scale descaling inside lower boiler drum.',
      permitType: 'CONFINED_SPACE',
      status: 'PENDING_APPROVAL',
      plantId: plantChennai.id,
      areaId: areaBoilerHouse.id,
      equipmentId: eqBoiler.id,
      requesterId: userRequester.id,
      contractorTeam: 'TUV Industrial Inspection Services',
      plannedStartTime: future4h,
      plannedEndTime: future8h,
      hazardsIdentified: JSON.stringify([
        'Oxygen deficiency (< 19.5%)',
        'Restricted ingress / egress manway (18-inch oval hatch)',
        'Residual heat and chemical scale dust',
      ]),
      ppeRequired: JSON.stringify([
        'Full Body Harness with Rescue D-ring',
        'Hard Hat with Chin Strap',
        'Particulate Respirator N95',
        'Intrinsically Safe Headlamp (Zone 0)',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Positive mechanical isolation (blanks / blinds installed, lines drained and tagged)', verified: true },
        { text: 'Electrical LOTO applied to all internal agitators and pumps', verified: true },
        { text: 'Continuous forced ventilation operating prior to and throughout entry', verified: true },
        { text: 'Multi-gas detector calibrated and running continuous 4-gas monitoring', verified: true },
        { text: 'Standby attendant stationed continuously outside entrance', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        spaceId: 'BOILER-DRUM-MD01',
        entryPoint: 'Lower Mud Drum Oval Manway MW-01',
        standbyAttendantName: 'V. Krishnan (Safety Attendant #SA-44)',
        ventilationMethod: 'forced_air',
        rescuePlan: 'SOP-CSE-BLR-04 (Tripod Winch + 15m Retrieval Line + SCBA On Standby)',
        atmosphericTest: {
          o2Percent: 20.9,
          lelPercent: 0,
          h2sPpm: 0,
          coPpm: 0,
          testTime: '2026-09-27 13:00',
        },
      }),
    },
  });

  // Suresh (Area Owner) approved p3
  await prisma.approval.create({
    data: {
      permitId: p3.id,
      approverId: userAreaOwner.id,
      roleAtApproval: 'AREA_OWNER',
      status: 'APPROVED',
      comment: 'Boiler feed water lines isolated and mud drum blowdown locked out. Area cleared for entry.',
      digitalSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    },
  });

  await prisma.auditLog.create({
    data: {
      permitId: p3.id,
      userId: userAreaOwner.id,
      userName: userAreaOwner.name,
      userRole: userAreaOwner.role,
      action: 'APPROVED',
      fromStatus: 'PENDING_APPROVAL',
      toStatus: 'PENDING_APPROVAL',
      comment: 'Area Owner approval granted. Awaiting final Safety Officer authorization.',
    },
  });

  // PERMIT 4: APPROVED (Ready to activate)
  const p4 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0004',
      title: 'Painting & Corrosion Protection on Overhead Crane Girders',
      description: 'Surface scraping, primer application, and high-build polyurethane topcoat application on runway beam C1 at 8m height.',
      permitType: 'WORKING_AT_HEIGHT',
      status: 'APPROVED',
      plantId: plantChennai.id,
      areaId: areaAssembly.id,
      equipmentId: eqOverheadCrane.id,
      requesterId: userRequester.id,
      contractorTeam: 'CleanCoat Coatings Ltd.',
      plannedStartTime: now, // Ready to start now!
      plannedEndTime: future8h,
      hazardsIdentified: JSON.stringify([
        'Falls from elevation (8 meters)',
        'Dropped tools or paint cans',
        'Crane busbar electrical hazards (Isolated)',
      ]),
      ppeRequired: JSON.stringify([
        'EN 361 Full Body Safety Harness',
        'Twin Shock-Absorbing Lanyards with Scaffold Hooks',
        'Chin-strapped Safety Helmet',
        'Anti-slip Work Boots',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Full body harness with dual shock-absorbing lanyards (100% tie-off)', verified: true },
        { text: 'Certified anchor points (> 22.2 kN rating) verified and tagged before use', verified: true },
        { text: 'Safety barricades, warning tape, and "Danger: Overhead Work" signage below', verified: true },
        { text: 'Tool lanyards and tethering bags secured to prevent dropped objects', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        heightInMeters: 8.5,
        accessMethod: 'MEWP',
        fallArrestEquipment: 'Karam PN 56 Full Body Harness with Energy Absorber Lanyard',
        anchorPointChecked: true,
        barricadingBelow: true,
      }),
    },
  });

  // Both approved
  await prisma.approval.create({
    data: {
      permitId: p4.id,
      approverId: userAreaOwner.id,
      roleAtApproval: 'AREA_OWNER',
      status: 'APPROVED',
      comment: 'Crane runway busbar electrically tagged out. Area floor supervisor notified.',
    },
  });
  await prisma.approval.create({
    data: {
      permitId: p4.id,
      approverId: userSafetyOfficer.id,
      roleAtApproval: 'SAFETY_OFFICER',
      status: 'APPROVED',
      comment: 'Boom lift inspection tag current. Harnesses verified unexpired. Approved for activation.',
    },
  });
  await prisma.auditLog.create({
    data: {
      permitId: p4.id,
      userId: userSafetyOfficer.id,
      userName: userSafetyOfficer.name,
      userRole: userSafetyOfficer.role,
      action: 'APPROVED',
      fromStatus: 'PENDING_APPROVAL',
      toStatus: 'APPROVED',
      comment: 'All dual approvals satisfied. Permit status upgraded to APPROVED.',
    },
  });

  // PERMIT 5: ACTIVE (Hot Work active with countdown timer)
  const p5 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0005',
      title: 'Abrasive Cutting & Pipe Support Modification',
      description: 'Angle grinding and cut-off of obsolete mounting brackets near paint booth exhaust ducts.',
      permitType: 'HOT_WORK',
      status: 'ACTIVE',
      plantId: plantChennai.id,
      areaId: areaPaintShop.id,
      equipmentId: eqPaintBooth.id,
      requesterId: userRequester.id,
      contractorTeam: 'Madras Industrial Fabricators',
      plannedStartTime: past2h,
      plannedEndTime: future4h,
      actualStartTime: past2h,
      hazardsIdentified: JSON.stringify([
        'High speed abrasive wheel breakage / fragments',
        'Sparks flying toward paint ventilation intake',
        'High decibel grinding noise',
      ]),
      ppeRequired: JSON.stringify([
        'Full Face Polycarbonate Grinding Shield',
        'Safety Goggles with side shields',
        'Heavy Leather Welding Gauntlets',
        'Ear Muffs Class 5',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Combustible materials removed or covered within 10 meters radius', verified: true },
        { text: 'Dedicated Fire Watch assigned with immediate continuous monitoring', verified: true },
        { text: 'Appropriate pressurized Fire Extinguisher inspected & positioned at point of work', verified: true },
        { text: 'Surrounding sewers, drains, and pipe openings sealed or blanketed', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: 'grinding',
        fireWatchAssigned: 'D. Pandian (Badge #FW-501)',
        fireExtinguisherType: 'DCP',
        combustiblesClearedRadiusMeters: 10,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: '2026-09-27 11:30',
          testerName: 'Priya Sharma (Safety Officer)',
        },
      }),
    },
  });

  await prisma.approval.create({
    data: {
      permitId: p5.id,
      approverId: userAreaOwner.id,
      roleAtApproval: 'AREA_OWNER',
      status: 'APPROVED',
      comment: 'Paint spray operations halted in Booth 02.',
    },
  });
  await prisma.approval.create({
    data: {
      permitId: p5.id,
      approverId: userSafetyOfficer.id,
      roleAtApproval: 'SAFETY_OFFICER',
      status: 'APPROVED',
      comment: 'Site inspected. Fire blankets installed on duct joints. Approved.',
    },
  });
  await prisma.auditLog.create({
    data: {
      permitId: p5.id,
      userId: userRequester.id,
      userName: userRequester.name,
      userRole: userRequester.role,
      action: 'ACTIVATED',
      fromStatus: 'APPROVED',
      toStatus: 'ACTIVE',
      comment: 'Permit activated. Work started on site.',
    },
  });
  await prisma.workLog.create({
    data: {
      permitId: p5.id,
      loggedById: userRequester.id,
      loggedByName: userRequester.name,
      action: 'Grinding of bracket 1 & 2 completed',
      notes: 'Fire watch continuous. Zero spark travel beyond designated fire blanket zone.',
    },
  });

  // PERMIT 6: ACTIVE & EXPIRING SOON (< 2 Hours remaining)
  const p6 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0006',
      title: 'Reactor Vessel R-101 Manway Inspection (Expiring Soon)',
      description: 'Internal visual weld inspection and agitator paddle clearance measurement inside reactor vessel.',
      permitType: 'CONFINED_SPACE',
      status: 'ACTIVE',
      plantId: plantSriperumbudur.id,
      areaId: areaReactorBay.id,
      equipmentId: eqReactor.id,
      requesterId: userRequester.id,
      contractorTeam: 'Apex Precision Engineering',
      plannedStartTime: past6h,
      plannedEndTime: future1h, // Exactly 1 hour remaining! Triggers "Expiring in < 2 hours" badge!
      actualStartTime: past6h,
      hazardsIdentified: JSON.stringify([
        'Confined space entrapment',
        'Trace monomer vapors',
        'Physical slip hazard on curved vessel bottom',
      ]),
      ppeRequired: JSON.stringify([
        'Chemical Resistant Coverall (Tychem C)',
        'Full Face Air-Purifying Respirator with Organic Vapor Cartridges',
        'Safety Harness with Retrieval Y-lanyard',
        'Nitrile Chemical Gloves',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Positive mechanical isolation (blanks / blinds installed, lines drained and tagged)', verified: true },
        { text: 'Electrical LOTO applied to all internal agitators and pumps', verified: true },
        { text: 'Continuous forced ventilation operating prior to and throughout entry', verified: true },
        { text: 'Multi-gas detector calibrated and running continuous 4-gas monitoring', verified: true },
        { text: 'Standby attendant stationed continuously outside entrance', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        spaceId: 'RCT-R101-INTERNAL',
        entryPoint: 'Top Flanged Manhole MH-01',
        standbyAttendantName: 'G. Arumugam (Safety Attendant #SA-12)',
        ventilationMethod: 'forced_air',
        rescuePlan: 'SOP-CSE-RCT-02 (Davit Arm + Winch System Mounted Over Manhole)',
        atmosphericTest: {
          o2Percent: 20.8,
          lelPercent: 0,
          h2sPpm: 0,
          coPpm: 0,
          testTime: '2026-09-27 08:00',
        },
      }),
    },
  });

  await prisma.approval.create({
    data: {
      permitId: p6.id,
      approverId: userAreaOwner.id,
      roleAtApproval: 'AREA_OWNER',
      status: 'APPROVED',
      comment: 'Reactor completely purged with nitrogen and flushed with fresh air for 24h.',
    },
  });
  await prisma.approval.create({
    data: {
      permitId: p6.id,
      approverId: userSafetyOfficer.id,
      roleAtApproval: 'SAFETY_OFFICER',
      status: 'APPROVED',
      comment: 'Gas readings certified zero toxic VOCs. Approved.',
    },
  });
  await prisma.auditLog.create({
    data: {
      permitId: p6.id,
      userId: userRequester.id,
      userName: userRequester.name,
      userRole: userRequester.role,
      action: 'ACTIVATED',
      fromStatus: 'APPROVED',
      toStatus: 'ACTIVE',
      comment: 'Technicians entered vessel with harness attached.',
    },
  });

  // PERMIT 7: SUSPENDED (Hot Work suspended due to gas alarm / weather)
  const p7 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0007',
      title: 'Flange Nut Torch Heating on Solvent Transfer Line',
      description: 'Oxy-acetylene micro-flame torch heating to loosen seized 2-inch stainless steel flange bolts on Solvent Pump P-04.',
      permitType: 'HOT_WORK',
      status: 'SUSPENDED',
      plantId: plantSriperumbudur.id,
      areaId: areaSolventStorage.id,
      equipmentId: eqSolventPump.id,
      requesterId: userRequester.id,
      contractorTeam: 'Apex Industrial Piping Ltd.',
      plannedStartTime: past6h,
      plannedEndTime: future4h,
      actualStartTime: past6h,
      suspensionReason: 'Fixed combustible gas sensor detected 4% LEL surge from neighboring drain trench. Instant safety halt triggered by Safety Officer.',
      hazardsIdentified: JSON.stringify([
        'Open flame in volatile solvent farm',
        'Nearby solvent vapor accumulation',
        'Flash fire risk',
      ]),
      ppeRequired: JSON.stringify([
        'Flame Retardant Nomex Coveralls',
        'Welding Mask',
        'Heavy Leather Gloves',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Combustible materials removed or covered within 10 meters radius', verified: true },
        { text: 'Dedicated Fire Watch assigned with immediate continuous monitoring', verified: true },
        { text: 'Appropriate pressurized Fire Extinguisher inspected & positioned at point of work', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: 'cutting',
        fireWatchAssigned: 'T. Murugesan (Badge #FW-801)',
        fireExtinguisherType: 'Foam',
        combustiblesClearedRadiusMeters: 15,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: '2026-09-27 07:45',
          testerName: 'Priya Sharma',
        },
      }),
    },
  });

  await prisma.approval.create({
    data: {
      permitId: p7.id,
      approverId: userSafetyOfficer.id,
      roleAtApproval: 'SAFETY_OFFICER',
      status: 'APPROVED',
      comment: 'Initial conditions satisfied.',
    },
  });
  await prisma.auditLog.create({
    data: {
      permitId: p7.id,
      userId: userSafetyOfficer.id,
      userName: userSafetyOfficer.name,
      userRole: userSafetyOfficer.role,
      action: 'SUSPENDED',
      fromStatus: 'ACTIVE',
      toStatus: 'SUSPENDED',
      comment: 'Emergency suspension: Neighboring solvent sump showed 4% LEL gas alarm. All torches extinguished immediately.',
    },
  });

  // PERMIT 8: CLOSED (Awaiting Safety Officer verification)
  const p8 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0008',
      title: 'MCC Panel Breaker Replacement (LOTO)',
      description: 'De-energize 415V MCC panel cubicle 04, replace burnt mold case circuit breaker, and test insulation resistance.',
      permitType: 'ELECTRICAL_LOTO',
      status: 'CLOSED',
      plantId: plantChennai.id,
      areaId: areaBoilerHouse.id,
      equipmentId: eqBoiler.id,
      requesterId: userRequester.id,
      contractorTeam: 'Schneider Electric Field Service',
      plannedStartTime: past6h,
      plannedEndTime: past2h,
      actualStartTime: past6h,
      actualEndTime: past2h,
      completionNotes: 'Circuit breaker replacement completed successfully. Megger insulation test passed (> 50 Mega-ohms). All personal locks removed. Line ready for final EHS verification.',
      hazardsIdentified: JSON.stringify([
        'Electrocution / electric shock from live conductors',
        'Arc flash explosion',
        'Accidental re-energization',
      ]),
      ppeRequired: JSON.stringify([
        'Arc Flash Face Shield 12 cal/cm2',
        '1000V Insulated Electrical Gloves with Leather Protectors',
        'Cotton Undergarments & FR Outerwear',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Equipment positively de-energized and open circuit breaker visually confirmed', verified: true },
        { text: 'Padlocks and standardized Danger Tags installed on every energy isolation point', verified: true },
        { text: 'Tested dead with calibrated voltage detector before touch (Live-Dead-Live method)', verified: true },
        { text: 'Portable safety grounding/earthing clusters applied where required', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        equipmentTag: 'MCC-BLR-01-BKR04',
        voltageLevel: '415V',
        lockNumbers: 'LOK-8801, LOK-8802',
        tagNumbers: 'TAG-E-901, TAG-E-902',
        earthingApplied: true,
        testedDeadByWhom: 'K. Senthil Nathan (Sr. Electrical Engineer #EE-302)',
      }),
    },
  });

  await prisma.approval.create({
    data: {
      permitId: p8.id,
      approverId: userAreaOwner.id,
      roleAtApproval: 'AREA_OWNER',
      status: 'APPROVED',
      comment: 'Approved for electrical maintenance.',
    },
  });
  await prisma.approval.create({
    data: {
      permitId: p8.id,
      approverId: userSafetyOfficer.id,
      roleAtApproval: 'SAFETY_OFFICER',
      status: 'APPROVED',
      comment: 'LOTO verified.',
    },
  });
  await prisma.auditLog.create({
    data: {
      permitId: p8.id,
      userId: userRequester.id,
      userName: userRequester.name,
      userRole: userRequester.role,
      action: 'CLOSED',
      fromStatus: 'ACTIVE',
      toStatus: 'CLOSED',
      comment: 'Work completed. Lockout removed, area cleared, handed over to Safety Officer for site walk-down verification.',
    },
  });

  // PERMIT 9: CLOSED_VERIFIED (Fully closed & verified by Safety Officer)
  const p9 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0009',
      title: 'Scaffolding Erection for Roof Truss Inspection',
      description: 'Erect heavy-duty cup-lock modular scaffolding up to 6.5 meters height under northern roof bay.',
      permitType: 'WORKING_AT_HEIGHT',
      status: 'CLOSED_VERIFIED',
      plantId: plantChennai.id,
      areaId: areaAssembly.id,
      equipmentId: eqOverheadCrane.id,
      requesterId: userRequester.id,
      contractorTeam: 'Altrad Industrial Scaffolding Ltd.',
      plannedStartTime: past48h,
      plannedEndTime: past24h,
      actualStartTime: past48h,
      actualEndTime: past24h,
      completionNotes: 'Scaffold structure completed with base plates, toe boards, double guard rails, and access ladder.',
      verificationNotes: 'Safety Officer Priya Sharma completed physical walk-around. Green Scaffold Inspection Tag #GT-409 attached. Ground area barricades cleared. Permit officially verified and archived.',
      hazardsIdentified: JSON.stringify([
        'Falls from elevation',
        'Scaffold instability / overturning',
        'Dropped tube clamps',
      ]),
      ppeRequired: JSON.stringify([
        'Full Body Harness with 1.8m Shock Absorber',
        'Hard Hat with Chinstrap',
        'Gripper Gloves',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Full body harness with dual shock-absorbing lanyards (100% tie-off)', verified: true },
        { text: 'Certified anchor points (> 22.2 kN rating) verified and tagged before use', verified: true },
        { text: 'Scaffold inspected by competent person with Green Tag displayed', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        heightInMeters: 6.5,
        accessMethod: 'scaffold',
        fallArrestEquipment: 'Karam PN 56 Double Lanyard System',
        anchorPointChecked: true,
        barricadingBelow: true,
      }),
    },
  });

  await prisma.auditLog.create({
    data: {
      permitId: p9.id,
      userId: userSafetyOfficer.id,
      userName: userSafetyOfficer.name,
      userRole: userSafetyOfficer.role,
      action: 'VERIFIED',
      fromStatus: 'CLOSED',
      toStatus: 'CLOSED_VERIFIED',
      comment: 'Physical walk-around completed. Housekeeping verified satisfactory. Final permit closure certified.',
    },
  });

  // PERMIT 10: REJECTED (Confined space entry rejected due to missing rescue plan)
  const p10 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0010',
      title: 'Underground Sewer Manhole Desilting & Jetting',
      description: 'Manual entry into stormwater & effluent manhole pit to clear blockages and silt accumulation.',
      permitType: 'CONFINED_SPACE',
      status: 'REJECTED',
      plantId: plantChennai.id,
      areaId: areaPaintShop.id,
      requesterId: userRequester.id,
      contractorTeam: 'City Clean Drainage Contractors',
      plannedStartTime: past24h,
      plannedEndTime: past6h,
      rejectionReason: 'REJECTED by Safety Officer: No certified rescue tripod listed. Contractor does not have continuous multi-gas monitor calibrated within 30 days. High H2S toxic hazard present.',
      hazardsIdentified: JSON.stringify([
        'Lethal H2S gas accumulation (> 50 ppm)',
        'Oxygen deficient atmosphere (< 19.5%)',
        'Drowning / engulfment in sludge',
      ]),
      ppeRequired: JSON.stringify([
        'Full Body Harness',
        'Supplied Air Breathing Apparatus (SABA)',
        'Rubber Chest Waders',
      ]),
      precautionsChecklist: JSON.stringify([
        { text: 'Continuous forced ventilation operating prior to and throughout entry', verified: false },
        { text: 'Multi-gas detector calibrated and running continuous 4-gas monitoring', verified: false },
      ]),
      typeSpecificData: JSON.stringify({
        spaceId: 'MANHOLE-MH-09',
        entryPoint: 'Grade level cast iron manhole cover',
        standbyAttendantName: 'Unassigned',
        ventilationMethod: 'natural',
        rescuePlan: 'None specified',
        atmosphericTest: {
          o2Percent: 18.2,
          lelPercent: 5,
          h2sPpm: 24,
          coPpm: 12,
          testTime: '2026-09-26 09:00',
        },
      }),
    },
  });

  await prisma.approval.create({
    data: {
      permitId: p10.id,
      approverId: userSafetyOfficer.id,
      roleAtApproval: 'SAFETY_OFFICER',
      status: 'REJECTED',
      rejectionReason: 'Atmospheric test showed 18.2% O2 (Deficient) and 24 ppm H2S (Above OSHA PEL). Rescue plan was absent. Fatal risk.',
    },
  });
  await prisma.auditLog.create({
    data: {
      permitId: p10.id,
      userId: userSafetyOfficer.id,
      userName: userSafetyOfficer.name,
      userRole: userSafetyOfficer.role,
      action: 'REJECTED',
      fromStatus: 'PENDING_APPROVAL',
      toStatus: 'REJECTED',
      comment: 'Permit rejected. Severe atmospheric violation and uncertified contractor.',
    },
  });

  // PERMIT 11: EXPIRED (Past validity window)
  const p11 = await prisma.permit.create({
    data: {
      permitNumber: 'PTW-2026-0011',
      title: 'Emergency Pipe Support Welding near Assembly Bay',
      description: 'Hot work torch cutting on redundant structural bracket.',
      permitType: 'HOT_WORK',
      status: 'EXPIRED',
      plantId: plantChennai.id,
      areaId: areaAssembly.id,
      equipmentId: eqOverheadCrane.id,
      requesterId: userRequester.id,
      contractorTeam: 'Apex Industrial Piping Ltd.',
      plannedStartTime: past48h,
      plannedEndTime: past24h,
      hazardsIdentified: JSON.stringify(['Hot slag', 'Overhead work']),
      ppeRequired: JSON.stringify(['Welding Mask', 'Leather Gloves']),
      precautionsChecklist: JSON.stringify([
        { text: 'Combustible materials removed or covered within 10 meters radius', verified: true },
      ]),
      typeSpecificData: JSON.stringify({
        hotWorkType: 'welding',
        fireWatchAssigned: 'K. Kumar',
        fireExtinguisherType: 'CO2',
        combustiblesClearedRadiusMeters: 10,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: '2026-09-25 10:00',
          testerName: 'Rajesh Kumar',
        },
      }),
    },
  });

  await prisma.auditLog.create({
    data: {
      permitId: p11.id,
      userName: 'System Auto-Expiry Engine',
      userRole: 'SYSTEM',
      action: 'EXPIRED',
      fromStatus: 'APPROVED',
      toStatus: 'EXPIRED',
      comment: 'Permit validity window elapsed at planned end time. Auto-expired per CMMS safety rule.',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('Created:');
  console.log(' - 4 Users (Requester, Area Owner, Safety Officer, Admin)');
  console.log(' - 2 Industrial Plants (Chennai & Sriperumbudur)');
  console.log(' - 5 Plant Areas');
  console.log(' - 6 Equipment Items');
  console.log(' - 11 Permits across all lifecycle states');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
