'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  AlertTriangle,
  CheckCircle2,
  HardHat,
  Shield,
  Layers,
  Calendar,
  Factory,
  Flame,
  Box,
  Zap,
  ArrowUpRight,
  Pickaxe,
} from 'lucide-react';
import { AdaptiveTypeFields } from '@/components/permits/AdaptiveTypeFields';
import { ConflictAlertBanner } from '@/components/permits/ConflictAlertBanner';
import { getPermitTypeDefinition } from '@/lib/permit-types';
import { PermitTypeId } from '@/lib/types/permit';

const PPE_OPTIONS = [
  'Safety Helmet (EN 397 with chinstrap)',
  'Safety Footwear (Steel toe & anti-puncture midsole)',
  'Safety Glasses / UV Eye Protection',
  'Full Body Harness (EN 361) with Dual Shock Lanyard',
  'Welding Helmet / Auto-Darkening Shield',
  'Leather Welding Gauntlets / Apron',
  'Chemical Resistant Gloves (Nitrile / Neoprene)',
  'Particulate Respirator (N95 / FFP2)',
  'Full Face Supplied Air Breathing Apparatus (SABA / SCBA)',
  'Multi-Gas Atmospheric Detector (Continuous personal monitor)',
  'Hearing Protection (Ear Plugs / Muffs Class 5)',
  'Arc Flash Protective Face Shield & Balaclava (12+ cal/cm2)',
];

export default function CreatePermitPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [masterData, setMasterData] = useState<any>({
    plants: [],
    areas: [],
    equipment: [],
    permitTypes: [],
  });

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [permitType, setPermitType] = useState<PermitTypeId>('HOT_WORK');
  const [plantId, setPlantId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [contractorTeam, setContractorTeam] = useState('Apex Mechanical Maintenance Ltd.');

  // Default datetimes: planned for now to +6 hours
  const nowStr = new Date().toISOString().slice(0, 16);
  const sixHoursLaterStr = new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 16);
  const [plannedStartTime, setPlannedStartTime] = useState(nowStr);
  const [plannedEndTime, setPlannedEndTime] = useState(sixHoursLaterStr);

  // Dynamic Type-Specific Data
  const [typeSpecificData, setTypeSpecificData] = useState<Record<string, any>>({});

  // Hazards & PPE
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [selectedPpe, setSelectedPpe] = useState<string[]>([
    'Safety Helmet (EN 397 with chinstrap)',
    'Safety Footwear (Steel toe & anti-puncture midsole)',
    'Safety Glasses / UV Eye Protection',
  ]);

  // Precautions Checklist
  const [precautions, setPrecautions] = useState<Array<{ text: string; verified: boolean }>>([]);

  // Live Conflict Detection State
  const [conflictWarnings, setConflictWarnings] = useState<any[]>([]);
  const [checkingConflicts, setCheckingConflicts] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load master data on mount
  useEffect(() => {
    fetch('/api/master-data')
      .then((res) => res.json())
      .then((data) => {
        setMasterData(data);
        if (data.plants?.length > 0) setPlantId(data.plants[0].id);
        if (data.areas?.length > 0) setAreaId(data.areas[0].id);
      })
      .catch(console.error);
  }, []);

  // Update default hazards & precautions when permit type changes
  useEffect(() => {
    const def = getPermitTypeDefinition(permitType);
    setSelectedHazards(def.defaultHazards);
    setPrecautions(def.defaultPrecautions.map((text) => ({ text, verified: false })));

    // Reset type specific data with initial template
    if (permitType === 'HOT_WORK') {
      setTypeSpecificData({
        hotWorkType: 'welding',
        fireWatchAssigned: '',
        fireExtinguisherType: 'DCP',
        combustiblesClearedRadiusMeters: 10,
        gasTestReadings: {
          lelPercent: 0,
          o2Percent: 20.9,
          testTime: new Date().toISOString().slice(0, 16),
          testerName: '',
        },
      });
    } else if (permitType === 'CONFINED_SPACE') {
      setTypeSpecificData({
        spaceId: '',
        entryPoint: '',
        standbyAttendantName: '',
        ventilationMethod: 'forced_air',
        rescuePlan: '',
        atmosphericTest: {
          o2Percent: 20.9,
          lelPercent: 0,
          h2sPpm: 0,
          coPpm: 0,
          testTime: new Date().toISOString().slice(0, 16),
        },
      });
    } else if (permitType === 'WORKING_AT_HEIGHT') {
      setTypeSpecificData({
        heightInMeters: 3.5,
        accessMethod: 'scaffold',
        fallArrestEquipment: '',
        anchorPointChecked: true,
        barricadingBelow: true,
      });
    } else if (permitType === 'ELECTRICAL_LOTO') {
      setTypeSpecificData({
        equipmentTag: '',
        voltageLevel: '415V',
        lockNumbers: '',
        tagNumbers: '',
        earthingApplied: true,
        testedDeadByWhom: '',
      });
    } else if (permitType === 'EXCAVATION') {
      setTypeSpecificData({
        depthInMeters: 1.5,
        undergroundServicesChecked: true,
        shoringOrBenchingInstalled: true,
        spoilPlacementDistanceMeters: 1.5,
        gasTestingRequired: false,
      });
    }
  }, [permitType]);

  // Check live conflicts when reaching review step or changing location/time
  const runConflictCheck = async () => {
    if (!areaId || !plannedStartTime || !plannedEndTime) return;
    setCheckingConflicts(true);
    try {
      const res = await fetch('/api/permits/check-conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          permitType,
          areaId,
          equipmentId: equipmentId || null,
          plannedStartTime,
          plannedEndTime,
        }),
      });
      const data = await res.json();
      setConflictWarnings(data.conflicts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingConflicts(false);
    }
  };

  const handleNextStep = async () => {
    setError(null);
    if (currentStep === 1) {
      if (!title.trim() || !description.trim() || !plantId || !areaId) {
        setError('Please fill in all mandatory core location and job details.');
        return;
      }
      if (new Date(plannedEndTime).getTime() <= new Date(plannedStartTime).getTime()) {
        setError('Planned end time must be later than planned start time.');
        return;
      }
    }

    if (currentStep === 3) {
      await runConflictCheck();
    }

    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSavePermit = async (submitImmediately: boolean) => {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        permitType,
        plantId,
        areaId,
        equipmentId: equipmentId || null,
        contractorTeam,
        plannedStartTime,
        plannedEndTime,
        hazardsIdentified: selectedHazards,
        ppeRequired: selectedPpe,
        precautionsChecklist: precautions,
        typeSpecificData,
        submitImmediately,
      };

      const res = await fetch('/api/permits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save permit');
      }

      router.push(`/permits/${data.permit.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the permit.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAreas = masterData.areas?.filter((a: any) => a.plantId === plantId) || [];
  const filteredEquipment = masterData.equipment?.filter((e: any) => e.areaId === areaId) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Permits Dashboard</span>
          </Link>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            Raise Permit to Work (PTW)
          </h1>
          <p className="text-xs text-slate-400">
            Multi-step dynamic authorization wizard conforming to CMMS high-hazard safety standards.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Step</span>
          <span className="h-6 w-6 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center">
            {currentStep}
          </span>
          <span className="text-slate-500">/ 4</span>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
        {[
          { step: 1, label: '1. Core Details' },
          { step: 2, label: '2. Type Technicals' },
          { step: 3, label: '3. Hazards & PPE' },
          { step: 4, label: '4. Safety & Review' },
        ].map((item) => (
          <div
            key={item.step}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              currentStep === item.step
                ? 'bg-orange-600/20 border-orange-500 text-orange-300 font-bold'
                : currentStep > item.step
                ? 'bg-slate-900 border-emerald-800 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {item.label}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl flex items-start gap-2.5 shadow-lg">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Wizard Step 1: Core Details */}
      {currentStep === 1 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Layers className="h-4 w-4 text-orange-400" />
            <span>Select Permit Type & Work Location</span>
          </h2>

          {/* Permit Type Selector Pills */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Hazardous Permit Type Classification <span className="text-red-400">*</span>:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  id: 'HOT_WORK',
                  label: 'Hot Work',
                  icon: <Flame className="h-4 w-4 text-amber-400" />,
                  desc: 'Welding, grinding, cutting, flame torches',
                },
                {
                  id: 'CONFINED_SPACE',
                  label: 'Confined Space Entry',
                  icon: <Box className="h-4 w-4 text-purple-400" />,
                  desc: 'Vessels, tanks, boilers, silos, trenches',
                },
                {
                  id: 'WORKING_AT_HEIGHT',
                  label: 'Working at Height',
                  icon: <ArrowUpRight className="h-4 w-4 text-blue-400" />,
                  desc: 'Elevation > 1.8m, scaffolds, boom lifts',
                },
                {
                  id: 'ELECTRICAL_LOTO',
                  label: 'Electrical / Isolation (LOTO)',
                  icon: <Zap className="h-4 w-4 text-red-400" />,
                  desc: 'MCC panels, transformers, de-energization',
                },
                {
                  id: 'EXCAVATION',
                  label: 'Excavation & Trenching',
                  icon: <Pickaxe className="h-4 w-4 text-emerald-400" />,
                  desc: 'Trench digging > 1.2m, underground scans',
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPermitType(t.id as PermitTypeId)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    permitType === t.id
                      ? 'bg-slate-800 border-orange-500 shadow-md ring-2 ring-orange-500/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-100">
                    {t.icon}
                    <span>{t.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Job Title and Description */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Permit Title / Work Scope Summary <span className="text-red-400">*</span>:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flange Replacement & TIG Welding on High Pressure Steam Header A"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Detailed Work Description & Method Statement <span className="text-red-400">*</span>:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe exact task, sequence of operations, equipment to be unbolted or welded..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          {/* Plant, Area, Equipment Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Plant Facility <span className="text-red-400">*</span>:
              </label>
              <select
                value={plantId}
                onChange={(e) => {
                  setPlantId(e.target.value);
                  const matchingArea = masterData.areas?.find((a: any) => a.plantId === e.target.value);
                  if (matchingArea) setAreaId(matchingArea.id);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {masterData.plants?.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Plant Area / Unit <span className="text-red-400">*</span>:
              </label>
              <select
                value={areaId}
                onChange={(e) => {
                  setAreaId(e.target.value);
                  setEquipmentId('');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {filteredAreas.map((a: any) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Equipment Tag (Optional):
              </label>
              <select
                value={equipmentId}
                onChange={(e) => setEquipmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="">No specific equipment tag</option>
                {filteredEquipment.map((eq: any) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.name} ({eq.tag})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contractor Team & Planned Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Contractor / Maintenance Agency <span className="text-red-400">*</span>:
              </label>
              <input
                type="text"
                value={contractorTeam}
                onChange={(e) => setContractorTeam(e.target.value)}
                placeholder="e.g. Apex Industrial Fabricators Ltd."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Planned Start Datetime <span className="text-red-400">*</span>:
              </label>
              <input
                type="datetime-local"
                value={plannedStartTime}
                onChange={(e) => setPlannedStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Planned End Datetime <span className="text-red-400">*</span>:
              </label>
              <input
                type="datetime-local"
                value={plannedEndTime}
                onChange={(e) => setPlannedEndTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Wizard Step 2: Adaptive Type-Specific Fields */}
      {currentStep === 2 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <AdaptiveTypeFields
            permitType={permitType}
            values={typeSpecificData}
            onChange={setTypeSpecificData}
            readOnly={false}
          />
        </div>
      )}

      {/* Wizard Step 3: Hazards Identification & PPE */}
      {currentStep === 3 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Shield className="h-4 w-4 text-orange-400" />
            <span>Hazard Identification & Required PPE</span>
          </h2>

          {/* Identified Hazards */}
          <div>
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2">
              Identified Site Hazards for this Job:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {getPermitTypeDefinition(permitType).defaultHazards.map((hazard) => {
                const isSelected = selectedHazards.includes(hazard);
                return (
                  <label
                    key={hazard}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-700 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedHazards([...selectedHazards, hazard]);
                        } else {
                          setSelectedHazards(selectedHazards.filter((h) => h !== hazard));
                        }
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-amber-600"
                    />
                    <span>{hazard}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Mandatory PPE */}
          <div>
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2">
              Mandatory Personal Protective Equipment (PPE):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PPE_OPTIONS.map((item) => {
                const isSelected = selectedPpe.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-700 text-sky-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPpe([...selectedPpe, item]);
                        } else {
                          setSelectedPpe(selectedPpe.filter((p) => p !== item));
                        }
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-600"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Wizard Step 4: Precautions & Final Review */}
      {currentStep === 4 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Safety Precautions Verification & Conflict Check</span>
          </h2>

          {/* Live Conflict Warnings Alert */}
          {checkingConflicts ? (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="animate-spin text-orange-400">⏳</span>
              <span>Scanning CMMS database for hazardous permit collisions and proximity conflicts...</span>
            </div>
          ) : conflictWarnings.length > 0 ? (
            <ConflictAlertBanner conflicts={conflictWarnings} />
          ) : (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Safety Collision Check Passed: No overlapping permits detected in this area/time window.</span>
            </div>
          )}

          {/* Mandatory Safety Precautions Checklist */}
          <div>
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-2">
              Mandatory Prerequisite Precautions Checklist:
            </label>
            <div className="space-y-2">
              {precautions.map((prec, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    prec.verified
                      ? 'bg-emerald-950/30 border-emerald-700 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={prec.verified}
                    onChange={(e) => {
                      const updated = [...precautions];
                      updated[idx].verified = e.target.checked;
                      setPrecautions(updated);
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-600"
                  />
                  <span className="leading-relaxed">{prec.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
            <h4 className="font-bold text-slate-100 uppercase text-[11px]">Permit Summary:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400">Type:</span> <strong>{permitType}</strong>
              </div>
              <div>
                <span className="text-slate-400">Contractor:</span> <strong>{contractorTeam}</strong>
              </div>
              <div>
                <span className="text-slate-400">Start Time:</span>{' '}
                <span className="font-mono">{new Date(plannedStartTime).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400">End Time:</span>{' '}
                <span className="font-mono">{new Date(plannedEndTime).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation and Submission Buttons Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous Step</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-950/40 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <>
              {/* Save as DRAFT */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSavePermit(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="h-4 w-4 text-slate-400" />
                <span>Save as DRAFT</span>
              </button>

              {/* Submit for Approval */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSavePermit(true)}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black shadow-lg shadow-orange-950/50 transition-all hover:scale-[1.02] flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? 'Submitting...' : 'Submit for Dual Approval'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
