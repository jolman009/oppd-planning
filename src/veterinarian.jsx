import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, X as XIcon, Calendar, Info, ExternalLink,
  FileText, Award, Send, Building2, Stethoscope, ChevronRight, ArrowLeft
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// BRAND TOKENS (UTRGV)
// ─────────────────────────────────────────────────────────────────────────────
const BRAND = {
  orange:     '#F05023',
  orangeDark: '#C73E16',
  orangePale: '#FEF1EA',
  orangeWash: '#FCE4D9',
  gray:       '#646469',
  grayInk:    '#1A1A1F',
  grayLine:   '#E8E8EA',
  grayWash:   '#F7F7F8',
  paper:      '#FAFAFB',
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA — Verify against each school's current catalog before publishing.
// ─────────────────────────────────────────────────────────────────────────────
const SCHOOLS = [
  {
    id: 'tamu',
    name: 'Texas A&M University',
    short: 'A&M',
    city: 'College Station',
    elig: { bachelor: false, letters: true, gpa: 2.9, gre: false, animalExp: true, shadowHours: 100 },
  },
  {
    id: 'ttu',
    name: 'Texas Tech University',
    short: 'Tech',
    city: 'Amarillo',
    elig: { bachelor: false, letters: true, gpa: 2.6, gre: false, animalExp: true, shadowHours: 'Required' },
  },
];

// status values: 'required' | 'none'
const CATEGORIES = [
  {
    name: 'Life Sciences',
    courses: [
      { code: 'BIOL 1406', title: 'General Biology I',           tamu: 'required', ttu: 'required' },
      { code: 'BIOL 1407', title: 'General Biology II',          tamu: 'required', ttu: 'none' },
      { code: 'BIOL 3401', title: 'Genetics',                    tamu: 'required', ttu: 'required' },
      { code: 'BIOL 3313', title: 'Microbiology',                tamu: 'required', ttu: 'required' },
      { code: 'BIOL 3345', title: 'Animal Nutrition (or NUTR 2315)', tamu: 'required', ttu: 'required' },
    ],
  },
  {
    name: 'Chemistry · Mathematics · Physics',
    courses: [
      { code: 'CHEM 1311', title: 'General Chemistry I',  tamu: 'required', ttu: 'required' },
      { code: 'CHEM 1111', title: 'Gen Chem I Lab',       tamu: 'required', ttu: 'required' },
      { code: 'CHEM 1312', title: 'General Chemistry II', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 1112', title: 'Gen Chem II Lab',      tamu: 'required', ttu: 'required' },
      { code: 'CHEM 2323', title: 'Organic Chemistry I',  tamu: 'required', ttu: 'required' },
      { code: 'CHEM 2123', title: 'Org Chem I Lab',       tamu: 'required', ttu: 'required' },
      { code: 'CHEM 2325', title: 'Organic Chemistry II', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 2125', title: 'Org Chem II Lab',      tamu: 'required', ttu: 'none' },
      { code: 'CHEM 3303', title: 'Biochemistry',         tamu: 'required', ttu: 'none' },
      { code: 'MATH 1342', title: 'Statistics',           tamu: 'required', ttu: 'required' },
      { code: 'PHYS 1401', title: 'General Physics I',    tamu: 'required', ttu: 'required' },
    ],
  },
  {
    name: 'Non-Sciences',
    courses: [
      { code: 'ENGL 1301', title: 'Composition I',  tamu: 'required', ttu: 'required' },
      { code: 'COMM 1315', title: 'Public Speaking', tamu: 'required', ttu: 'none' },
    ],
  },
];

const TIMELINE = [
  {
    year: 1, label: 'First Year', focus: 'Explore and establish.',
    items: [
      'Research and determine if veterinary medicine is the right career fit.',
      'Map out a plan to complete vet school prerequisites with an advisor.',
      'Develop study skills and maintain a competitive GPA.',
      'Research pre-veterinary or similar student organizations.',
      'Volunteer or work in a veterinary medicine environment.',
      'Shadow a veterinarian — small animal, large animal, or mixed practice.',
    ],
  },
  {
    year: 2, label: 'Second Year', focus: 'Build and research.',
    items: [
      'Maintain a competitive GPA.',
      'Build relationships with faculty for letters of recommendation (most schools require ≥1 letter from a DVM).',
      'Continue building your résumé — work, volunteer, seek clinical and shadowing opportunities.',
      'Begin planning and preparation for the GRE (required by some schools).',
      'Research veterinary schools and prerequisites — they vary by school.',
    ],
  },
  {
    year: 3, label: 'Third Year', focus: 'Prepare and apply.',
    items: [
      'Research VMCAS and review veterinary school application processes.',
      'Begin formally requesting letters of recommendation.',
      'Research schools of interest; check each school\u2019s specific prerequisites.',
      'Continue building your résumé — work, volunteer, seek clinical and shadowing opportunities.',
      'Register for and take the GRE (during or summer after third year).',
      'Create a budget for vet school admissions (VMCAS: $220 first program + $120 each additional).',
    ],
  },
  {
    year: 4, label: 'Fourth Year', focus: 'Submit and finalize.',
    items: [
      'Complete prerequisite courses and degree requirements.',
      'Prepare your personal statement (summer prior — 3,000 character max in VMCAS).',
      'Request official transcripts of all college work attempted (summer prior).',
      'Prepare and submit applications through VMCAS (summer prior to early fall).',
      'Monitor your application status regularly on the Check Status tab.',
    ],
  },
];

const DEADLINES = [
  { date: 'Jan ~20', label: 'VMCAS Application Opens',          detail: 'Personal Information, Academic History, and Supporting Information sections available immediately.' },
  { date: 'May ~12', label: 'Program Materials Section Opens',  detail: 'Select programs, complete program-specific questions, and submit.' },
  { date: 'Aug ~12', label: 'PTE Service Deadline',             detail: 'Enroll by this date if using Professional Transcript Entry. Peak processing: July–September.' },
  { date: 'Sep 15',  label: 'VMCAS Application Deadline',       detail: 'All materials due by 11:59 p.m. ET. ≥3 letters of recommendation required. No exceptions or refunds.' },
  { date: 'Apr 15',  label: 'AAVMC Common Reply Date',          detail: 'No AAVMC member school may require a decision before April 15. Accept or decline all offers by this date.' },
];

const VMCAS_STEPS = [
  {
    num: 1,
    title: 'You (Applicant)',
    Icon: Send,
    body: 'Submit application, send all official transcripts, request 3+ letters of recommendation, submit GRE scores if required.',
  },
  {
    num: 2,
    title: 'VMCAS',
    Icon: FileText,
    body: 'Verifies transcripts, calculates VMCAS GPAs, processes the application, and delivers your verified file to designated vet schools.',
  },
  {
    num: 3,
    title: 'Vet Schools',
    Icon: Building2,
    body: 'Review verified applications, conduct interviews, and make individual admissions decisions independently.',
  },
];

const PATHWAY = [
  { label: 'Bachelor\u2019s degree',  body: 'Most U.S. vet schools do not require a bachelor\u2019s — you may apply after 2+ years if prerequisites are complete. Most accepted students do hold a bachelor\u2019s or advanced degree.' },
  { label: 'Veterinary school',        body: '4 years total — 3 years didactic coursework plus 1 year of clinical rotations.' },
  { label: 'Licensure',                body: 'After DVM: pass the NAVLE (North American Veterinary Licensing Exam) and obtain a state license.' },
  { label: 'Specialization (optional)', body: 'Residency, internship, or board certification through ABVS — 22 AVMA-recognized organizations across 46 specialties.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DVMPlanningTool() {
  const [selected, setSelected] = useState(SCHOOLS.map(s => s.id));
  const [activeYear, setActiveYear] = useState(1);

  const visibleSchools = useMemo(
    () => SCHOOLS.filter(s => selected.includes(s.id)),
    [selected]
  );

  const allCourses = useMemo(() => CATEGORIES.flatMap(c => c.courses), []);

  const commonCourses = useMemo(() => {
    if (visibleSchools.length === 0) return [];
    return allCourses.filter(c => visibleSchools.every(s => c[s.id] === 'required'));
  }, [visibleSchools, allCourses]);

  const toggleSchool = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const StatusMark = ({ status, schoolShort }) => {
    if (status === 'required') {
      return (
        <div role="img" aria-label={`Required by ${schoolShort}`}
          className="flex items-center justify-center w-7 h-7 rounded-full mx-auto"
          style={{ backgroundColor: BRAND.orange }}>
          <Check size={16} color="white" strokeWidth={3} />
        </div>
      );
    }
    return (
      <div role="img" aria-label={`Not required at ${schoolShort}`}
        className="w-7 h-7 mx-auto flex items-center justify-center">
        <span style={{ color: '#C8C8CD', fontSize: 18, lineHeight: 1 }}>·</span>
      </div>
    );
  };

  const ReqRow = ({ label, met, value }) => (
    <div className="flex items-center justify-between py-2" style={{ borderTop: `1px solid ${BRAND.grayLine}` }}>
      <span style={{ fontSize: 13, color: BRAND.grayInk, fontWeight: 500 }}>{label}</span>
      <div className="flex items-center gap-2">
        {value !== undefined && (
          <span style={{ fontSize: 13, fontWeight: 700, color: BRAND.grayInk }}>{value}</span>
        )}
        {met === true && (
          <div className="flex items-center justify-center w-5 h-5 rounded-full" style={{ backgroundColor: BRAND.orange }}>
            <Check size={12} color="white" strokeWidth={3} />
          </div>
        )}
        {met === false && (
          <div className="flex items-center justify-center w-5 h-5 rounded-full" style={{ backgroundColor: BRAND.grayWash, border: `1px solid ${BRAND.grayLine}` }}>
            <XIcon size={11} color={BRAND.gray} strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );

  const activeTimeline = TIMELINE.find(t => t.year === activeYear);

  return (
    <div style={{ fontFamily: "'Red Hat Display', system-ui, -apple-system, sans-serif", backgroundColor: BRAND.paper, minHeight: '100vh', color: BRAND.grayInk }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patua+One&family=Red+Hat+Display:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Patua One', Georgia, serif; letter-spacing: -0.01em; }
        .eyebrow { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; }
        .num-rail { font-variant-numeric: tabular-nums; }
        button:focus-visible { outline: 2px solid ${BRAND.orange}; outline-offset: 2px; }
      `}</style>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header style={{ backgroundColor: 'white', borderBottom: `1px solid ${BRAND.grayLine}` }}>
        <div style={{ height: 4, backgroundColor: BRAND.orange }} />
        <div className="max-w-6xl mx-auto px-6 py-7">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-4" style={{ fontSize: 13, color: BRAND.gray, fontWeight: 600, textDecoration: 'none' }}>
            <ArrowLeft size={14} />
            All Planning Tools
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.gray }}>
                UTRGV · Pre-Professional Development
              </div>
              <h1 className="font-display" style={{ fontSize: 40, color: BRAND.grayInk, marginTop: 6, lineHeight: 1.05 }}>
                Veterinary School <span style={{ color: BRAND.orange }}>Planning Tool</span>
              </h1>
              <p style={{ color: BRAND.gray, marginTop: 8, fontSize: 15, maxWidth: 580, lineHeight: 1.5 }}>
                Compare eligibility, prerequisites, and the VMCAS cycle for Texas veterinary schools. Map your path to a DVM.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ backgroundColor: BRAND.orangePale, color: BRAND.orangeDark }}>
              <Stethoscope size={18} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em' }}>D.V.M.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ── Step 1: School filter ─────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.orange }}>Step 1</div>
              <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Choose your target schools</h2>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSelected(SCHOOLS.map(s => s.id))}
                className="px-3 py-1.5 rounded transition-colors"
                style={{ fontSize: 13, color: BRAND.gray, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = BRAND.grayWash}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                Select all
              </button>
              <button
                onClick={() => setSelected([])}
                className="px-3 py-1.5 rounded transition-colors"
                style={{ fontSize: 13, color: BRAND.gray, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = BRAND.grayWash}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SCHOOLS.map(school => {
              const on = selected.includes(school.id);
              return (
                <button
                  key={school.id}
                  onClick={() => toggleSchool(school.id)}
                  aria-pressed={on}
                  className="text-left p-4 rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: on ? BRAND.orange : 'white',
                    color: on ? 'white' : BRAND.grayInk,
                    border: `1.5px solid ${on ? BRAND.orange : BRAND.grayLine}`,
                    boxShadow: on ? '0 1px 2px rgba(240,80,35,0.15)' : 'none',
                    cursor: 'pointer',
                  }}>
                  <div className="flex items-start justify-between gap-3">
                    <div style={{ minWidth: 0 }}>
                      <div className="font-display" style={{ fontSize: 20, lineHeight: 1.15 }}>{school.name}</div>
                      <div style={{ fontSize: 12, marginTop: 6, opacity: on ? 0.85 : 0.7 }}>
                        {school.city}, TX
                      </div>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: 5,
                      border: `1.5px solid ${on ? 'white' : '#D4D4D8'}`,
                      backgroundColor: on ? 'white' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {on && <Check size={14} color={BRAND.orange} strokeWidth={3} />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {visibleSchools.length === 0 ? (
          <div className="text-center py-14 rounded-lg" style={{ backgroundColor: 'white', border: `1px dashed ${BRAND.grayLine}` }}>
            <Info size={28} style={{ color: BRAND.gray, margin: '0 auto' }} />
            <p style={{ color: BRAND.gray, marginTop: 10, fontSize: 14 }}>
              Select at least one school to see its eligibility and prerequisites.
            </p>
          </div>
        ) : (
          <>
            {/* ── Step 2: Eligibility ─────────────────────────────────── */}
            <section>
              <div className="mb-4">
                <div className="eyebrow" style={{ color: BRAND.orange }}>Step 2</div>
                <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Review eligibility requirements</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleSchools.map(s => (
                  <div key={s.id} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                    <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BRAND.grayLine}` }}>
                      <div className="font-display" style={{ fontSize: 22, color: BRAND.grayInk, lineHeight: 1.1 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: BRAND.gray, marginTop: 4 }}>{s.city}, TX · D.V.M.</div>
                    </div>

                    {/* Hero stats */}
                    <div className="grid grid-cols-2" style={{ borderBottom: `1px solid ${BRAND.grayLine}` }}>
                      <div className="p-4" style={{ borderRight: `1px solid ${BRAND.grayLine}` }}>
                        <div className="eyebrow" style={{ color: BRAND.gray }}>Minimum GPA</div>
                        <div className="font-display num-rail" style={{ fontSize: 38, color: BRAND.orange, lineHeight: 1, marginTop: 4 }}>
                          {s.elig.gpa.toFixed(1)}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="eyebrow" style={{ color: BRAND.gray }}>Shadow hours</div>
                        <div className="font-display num-rail" style={{ fontSize: 38, color: BRAND.orange, lineHeight: 1, marginTop: 4 }}>
                          {typeof s.elig.shadowHours === 'number' ? `${s.elig.shadowHours}+` : 'Req'}
                        </div>
                        {typeof s.elig.shadowHours !== 'number' && (
                          <div style={{ fontSize: 11, color: BRAND.gray, marginTop: 4, lineHeight: 1.3 }}>
                            Required, no published minimum
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Requirement rows */}
                    <div className="px-5 pb-3">
                      <ReqRow label="Letters of recommendation"  met={s.elig.letters} />
                      <ReqRow label="Animal experience"          met={s.elig.animalExp} />
                      <ReqRow label="GRE"                        met={s.elig.gre} />
                      <ReqRow label="Bachelor's degree"          met={s.elig.bachelor} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Stat strip */}
            <section className="grid grid-cols-3 gap-3">
              <Stat label="Schools compared"        value={visibleSchools.length} />
              <Stat label="Common required courses" value={commonCourses.length} />
              <Stat label="Tracked prerequisites"   value={allCourses.length} />
            </section>

            {/* ── Step 3: Prereq matrix ─────────────────────────────── */}
            <section>
              <div className="mb-4">
                <div className="eyebrow" style={{ color: BRAND.orange }}>Step 3</div>
                <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Compare prerequisites</h2>
              </div>

              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 480, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: BRAND.grayInk }}>
                        <th className="text-left px-4 py-3" style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: 220 }}>
                          Course
                        </th>
                        {visibleSchools.map(s => (
                          <th key={s.id} className="px-3 py-3 text-center" style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em' }}>
                            {s.short}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CATEGORIES.map(cat => (
                        <React.Fragment key={cat.name}>
                          <tr>
                            <td colSpan={visibleSchools.length + 1} className="px-4 py-2" style={{
                              backgroundColor: BRAND.orangePale,
                              color: BRAND.orangeDark,
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                            }}>
                              {cat.name}
                            </td>
                          </tr>
                          {cat.courses.map(course => (
                            <tr key={course.code} style={{ borderTop: `1px solid ${BRAND.grayLine}` }}>
                              <td className="px-4 py-3">
                                <div className="num-rail" style={{ fontWeight: 700, fontSize: 14, color: BRAND.grayInk }}>{course.code}</div>
                                <div style={{ fontSize: 12, color: BRAND.gray, marginTop: 2 }}>{course.title}</div>
                              </td>
                              {visibleSchools.map(s => (
                                <td key={s.id} className="px-3 py-3">
                                  <StatusMark status={course[s.id]} schoolShort={s.short} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 flex flex-wrap gap-5 items-center" style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: BRAND.grayWash }}>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600 }}>
                    <div className="flex items-center justify-center w-5 h-5 rounded-full" style={{ backgroundColor: BRAND.orange }}>
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                    Required
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600 }}>
                    <span style={{ color: '#C8C8CD', fontSize: 18, lineHeight: 1, paddingInline: 4 }}>·</span>
                    Not required
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Step 4: Timeline ────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <div className="eyebrow" style={{ color: BRAND.orange }}>Step 4</div>
            <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Plan your undergraduate years</h2>
          </div>

          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
            <div className="grid grid-cols-4" style={{ borderBottom: `1px solid ${BRAND.grayLine}` }}>
              {TIMELINE.map(t => {
                const on = activeYear === t.year;
                return (
                  <button
                    key={t.year}
                    onClick={() => setActiveYear(t.year)}
                    className="py-4 px-2 text-center transition-colors"
                    style={{
                      backgroundColor: on ? 'white' : BRAND.grayWash,
                      color: on ? BRAND.orange : BRAND.gray,
                      borderBottom: on ? `3px solid ${BRAND.orange}` : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                    aria-pressed={on}>
                    <div className="font-display num-rail" style={{ fontSize: 28, lineHeight: 1 }}>{t.year}</div>
                    <div style={{ fontSize: 11, marginTop: 4, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {t.label}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="p-6 md:p-8">
              <div style={{ fontSize: 14, color: BRAND.orange, fontWeight: 600, marginBottom: 14, fontStyle: 'italic' }}>
                {activeTimeline.focus}
              </div>
              <ul className="space-y-3.5">
                {activeTimeline.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{
                      width: 24, height: 24,
                      backgroundColor: BRAND.orangePale,
                      color: BRAND.orangeDark,
                      fontWeight: 700, fontSize: 12,
                      marginTop: 2,
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: 15, color: BRAND.grayInk, lineHeight: 1.55 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Step 5: Deadlines ──────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.orange }}>Step 5</div>
              <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Key VMCAS deadlines</h2>
            </div>
            <span style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600, letterSpacing: '0.02em' }}>
              Approximate · verify at vmcas.liaisoncas.com
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEADLINES.map(d => (
              <div key={d.date} className="p-4 rounded-lg flex gap-4" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                <div className="flex flex-col items-center justify-center rounded flex-shrink-0" style={{ width: 72, height: 64, backgroundColor: BRAND.orange, color: 'white' }}>
                  <Calendar size={14} strokeWidth={2.5} />
                  <div className="font-display num-rail" style={{ fontSize: 14, marginTop: 4, lineHeight: 1 }}>{d.date}</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: BRAND.grayInk, lineHeight: 1.3 }}>{d.label}</div>
                  <div style={{ fontSize: 12, color: BRAND.gray, marginTop: 4, lineHeight: 1.45 }}>{d.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How VMCAS Works ────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <h2 className="font-display" style={{ fontSize: 22 }}>How VMCAS works</h2>
            <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 4 }}>
              VMCAS is the central application service for U.S. veterinary schools. Here's the three-party flow:
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3">
            {VMCAS_STEPS.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="p-5 rounded-lg" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center rounded-md" style={{ width: 36, height: 36, backgroundColor: BRAND.orange, color: 'white' }}>
                      <step.Icon size={18} strokeWidth={2.25} />
                    </div>
                    <div>
                      <div className="eyebrow" style={{ color: BRAND.gray }}>Step {step.num}</div>
                      <div className="font-display" style={{ fontSize: 16, lineHeight: 1.1, marginTop: 2 }}>{step.title}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: BRAND.grayInk, lineHeight: 1.5 }}>{step.body}</p>
                </div>
                {idx < VMCAS_STEPS.length - 1 && (
                  <div className="hidden md:flex absolute" style={{
                    left: `calc(${(idx + 1) * 33.333}% - 12px)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1,
                  }}>
                    <div className="flex items-center justify-center rounded-full" style={{
                      width: 24, height: 24,
                      backgroundColor: BRAND.paper,
                      border: `1px solid ${BRAND.grayLine}`,
                      color: BRAND.gray,
                    }}>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ── Educational Pathway ────────────────────────────────────── */}
        <section className="rounded-lg p-6 md:p-7" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center rounded-md" style={{ width: 36, height: 36, backgroundColor: BRAND.orangePale, color: BRAND.orangeDark }}>
              <Award size={18} strokeWidth={2.25} />
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: 22, lineHeight: 1 }}>Educational pathway to D.V.M.</h2>
              <p style={{ fontSize: 12, color: BRAND.gray, marginTop: 4 }}>The full road, from prerequisites through licensure.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {PATHWAY.map((p, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{
                  width: 22, height: 22,
                  backgroundColor: BRAND.orangePale,
                  color: BRAND.orangeDark,
                  fontWeight: 700, fontSize: 11,
                  marginTop: 2,
                }}>
                  {idx + 1}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.grayInk }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: BRAND.gray, marginTop: 2, lineHeight: 1.5 }}>{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="rounded-lg p-6 md:p-8" style={{
          backgroundColor: BRAND.orange,
          color: 'white',
          backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 60%)',
        }}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div style={{ maxWidth: 480 }}>
              <h3 className="font-display" style={{ fontSize: 26, lineHeight: 1.1 }}>Ready to start?</h3>
              <p style={{ marginTop: 8, fontSize: 14, opacity: 0.95, lineHeight: 1.5 }}>
                Schedule a meeting with the UTRGV Office of Pre-Professional Development to build your individualized pre-veterinary plan.
              </p>
            </div>
            <a
              href="https://www.utrgv.edu/student-success/for-students/pre-professional/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded transition-all"
              style={{ backgroundColor: 'white', color: BRAND.orange, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <ExternalLink size={14} />
              Visit OPPD
            </a>
          </div>
        </section>

        {/* ── Disclaimer ───────────────────────────────────────────────── */}
        <p style={{ fontSize: 11, color: BRAND.gray, lineHeight: 1.6, textAlign: 'center', maxWidth: 620, margin: '0 auto' }}>
          Prerequisite and eligibility data is compiled from each school's published requirements for planning purposes. Always verify with the official catalog and the VMCAS portal (vmcas.liaisoncas.com) before applying.
        </p>
      </main>
    </div>
  );
}

// ─── Small sub-component ───────────────────────────────────────────────────
function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
      <div className="eyebrow" style={{ color: BRAND.gray }}>{label}</div>
      <div className="font-display num-rail" style={{ fontSize: 34, color: BRAND.orange, marginTop: 6, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
