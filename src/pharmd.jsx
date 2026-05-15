import React, { useState, useMemo } from 'react';
import {
  Check, GraduationCap, Calendar, Info, ExternalLink, AlertTriangle,
  Pill, FileText, Award, Send, Building2, ChevronRight, BookOpen
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
  amber:      '#B45309',
  amberPale:  '#FEF3C7',
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA — Schools (9 Texas PharmCAS programs)
// ─────────────────────────────────────────────────────────────────────────────
const SCHOOLS = [
  { id: 'tamu',     short: 'A&M',         abbrev2: ['Texas',    'A&M'],         name: 'Texas A&M University',                                  city: 'College Station' },
  { id: 'tsu',      short: 'TSU',         abbrev2: ['Texas',    'Southern'],    name: 'Texas Southern University',                              city: 'Houston' },
  { id: 'utaustin', short: 'UT Austin',   abbrev2: ['UT',       'Austin'],      name: 'The University of Texas at Austin',                      city: 'Austin' },
  { id: 'utep',     short: 'UTEP',        abbrev2: ['UT',       'El Paso'],     name: 'The University of Texas at El Paso',                     city: 'El Paso' },
  { id: 'uttyler',  short: 'UT Tyler',    abbrev2: ['UT',       'Tyler'],       name: 'The University of Texas at Tyler',                       city: 'Tyler' },
  { id: 'uh',       short: 'Houston',     abbrev2: ['',         'Houston'],     name: 'University of Houston',                                  city: 'Houston' },
  { id: 'unt',      short: 'UNT',         abbrev2: ['UNT',      'HSC'],         name: 'University of North Texas Health Science Center',        city: 'Fort Worth' },
  { id: 'uiw',      short: 'UIW',         abbrev2: ['',         'UIW'],         name: 'University of the Incarnate Word',                       city: 'San Antonio' },
  { id: 'ttuhsc',   short: 'Texas Tech',  abbrev2: ['Texas',    'Tech HSC'],    name: 'Texas Tech University Health Sciences Center',           city: 'Amarillo' },
];

// All schools default to required (req) for every course.
// Verify and adjust per source spreadsheet — set value to 'none' where a school does not require the course.
// All 9 schools agree: bachelor's degree is NOT required.
const allReq = (overrides = {}) => ({
  tamu: 'req', tsu: 'req', utaustin: 'req', utep: 'req', uttyler: 'req',
  uh: 'req', unt: 'req', uiw: 'req', ttuhsc: 'req',
  ...overrides,
});

const CATEGORIES = [
  {
    name: 'Life Sciences',
    courses: [
      { code: 'BIOL 1406', title: 'General Biology I',          reqs: allReq() },
      { code: 'BIOL 1407', title: 'General Biology II',         reqs: allReq() },
      { code: 'BIOL 3401', title: 'Genetics',                   reqs: allReq() },
      { code: 'BIOL 3313', title: 'Microbiology',               reqs: allReq() },
      { code: 'BIOL 3315', title: 'Cell Biology',               reqs: allReq() },
      { code: 'BIOL 2401', title: 'Anatomy & Physiology I',     reqs: allReq() },
      { code: 'BIOL 2402', title: 'Anatomy & Physiology II',    reqs: allReq() },
    ],
  },
  {
    name: 'Chemistry · Statistics · Physics',
    courses: [
      { code: 'CHEM 1311', title: 'General Chemistry I',  reqs: allReq() },
      { code: 'CHEM 1111', title: 'Gen Chem I Lab',       reqs: allReq() },
      { code: 'CHEM 1312', title: 'General Chemistry II', reqs: allReq() },
      { code: 'CHEM 1112', title: 'Gen Chem II Lab',      reqs: allReq() },
      { code: 'CHEM 2323', title: 'Organic Chemistry I',  reqs: allReq() },
      { code: 'CHEM 2123', title: 'Org Chem I Lab',       reqs: allReq() },
      { code: 'CHEM 2325', title: 'Organic Chemistry II', reqs: allReq() },
      { code: 'CHEM 2125', title: 'Org Chem II Lab',      reqs: allReq() },
      { code: 'CHEM 3303', title: 'Biochemistry',         reqs: allReq() },
      { code: 'STAT 3301', title: 'Statistics',           reqs: allReq() },
      { code: 'MATH 1342', title: 'Elementary Statistics', reqs: allReq() },
      { code: 'PHYS 1401', title: 'General Physics I',    reqs: allReq() },
      { code: 'PHYS 1402', title: 'General Physics II',   reqs: allReq() },
    ],
  },
  {
    name: 'Non-Sciences',
    courses: [
      { code: 'ENGL 1301', title: 'Composition I',                reqs: allReq() },
      { code: 'ENGL 1302', title: 'Composition II',               reqs: allReq() },
      { code: 'ENGL 2331', title: 'World Literature',             reqs: allReq() },
      { code: 'MATH 2413', title: 'Calculus I',                   reqs: allReq() },
      { code: 'COMM 1311', title: 'Communication · or COMM 1315', reqs: allReq() },
    ],
  },
  {
    name: 'Core Curriculum',
    courses: [
      { code: 'POLS 2305',      title: 'American Government I',        reqs: allReq() },
      { code: 'POLS 2306',      title: 'American Government II',       reqs: allReq() },
      { code: 'SOCI/PSYC/ECON', title: 'Social Science elective',      reqs: allReq() },
      { code: 'HIST 1301',      title: 'U.S. History I',               reqs: allReq() },
      { code: 'HIST 1302',      title: 'U.S. History II',              reqs: allReq() },
      { code: 'ART/MUS/THEA',   title: 'Creative Arts elective',       reqs: allReq() },
      { code: 'HUM/LANG',       title: 'Humanities or Language',       reqs: allReq() },
      { code: 'CAO',            title: 'Component Area Option course', reqs: allReq() },
    ],
  },
];

const TIMELINE = [
  {
    year: 1, label: 'First Year', focus: 'Explore and establish.',
    items: [
      'Explore pharmacy as a career and shadow a pharmacist.',
      'Meet with an advisor to map prerequisites and your degree plan.',
      'Build study skills and maintain a competitive GPA.',
      'Join pre-pharmacy or pre-health student organizations.',
      'Volunteer or work in a health care setting.',
    ],
  },
  {
    year: 2, label: 'Second Year', focus: 'Build and research.',
    items: [
      'Maintain a competitive GPA.',
      'Build faculty relationships for letters of recommendation.',
      'Add work, volunteer, clinical, and shadowing experience to your résumé.',
      'Research pharmacy programs and school-specific entrance requirements.',
      'Confirm current testing policies for the programs you plan to pursue.',
    ],
  },
  {
    year: 3, label: 'Third Year', focus: 'Prepare and apply.',
    items: [
      'Research PharmCAS and review each school\u2019s application process.',
      'Begin requesting letters of recommendation.',
      'Continue strengthening academics, service, and pharmacy exposure.',
      'Finalize the list of programs you plan to apply to.',
      'Create a budget for application and interview costs.',
    ],
  },
  {
    year: 4, label: 'Fourth Year', focus: 'Submit and finalize.',
    items: [
      'Complete prerequisite courses and degree requirements.',
      'Draft your personal statement and request official transcripts in the summer prior.',
      'Submit PharmCAS and any school-specific supplemental applications.',
      'Prepare for interviews and attend them.',
      'Review decisions, accept an offer promptly, and apply for financial aid and scholarships.',
    ],
  },
];

const PHARMCAS_STEPS = [
  {
    num: 1, title: 'You (Applicant)', Icon: Send,
    body: 'Submit application, send official transcripts, request 2\u20133 letters of recommendation, and submit PCAT scores if a target school requires them.',
  },
  {
    num: 2, title: 'PharmCAS', Icon: FileText,
    body: 'Verifies transcripts, calculates standardized GPAs, processes the application, and delivers your verified file to designated pharmacy schools.',
  },
  {
    num: 3, title: 'Pharmacy Schools', Icon: Building2,
    body: 'Review verified applications on their own timeline, conduct interviews, and make admissions decisions independently.',
  },
];

const PATHWAY = [
  { label: 'No bachelor\u2019s required',  body: 'None of the nine Texas Pharm.D. programs require a bachelor\u2019s degree. Most admitted students complete 2\u20133 years of prerequisites before applying.' },
  { label: 'Pharmacy school',               body: '4 years for the Pharm.D. \u2014 a combination of didactic coursework and pharmacy practice experiences (IPPEs and APPEs).' },
  { label: 'Licensure',                     body: 'After the Pharm.D., pass the NAPLEX and MPJE, then license in the state where you intend to practice.' },
  { label: 'Specialization (optional)',     body: 'Residency (PGY-1, PGY-2), fellowship, or board certification (BPS) in oncology, psychiatry, ambulatory care, and other specialties.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PharmDPlanningTool() {
  const [selected, setSelected] = useState(SCHOOLS.map(s => s.id));
  const [activeYear, setActiveYear] = useState(1);

  const visibleSchools = useMemo(() => SCHOOLS.filter(s => selected.includes(s.id)), [selected]);
  const allCourses = useMemo(() => CATEGORIES.flatMap(c => c.courses), []);
  const commonCourses = useMemo(() => {
    if (visibleSchools.length === 0) return [];
    return allCourses.filter(c => visibleSchools.every(s => c.reqs[s.id] === 'req'));
  }, [visibleSchools, allCourses]);

  const toggleSchool = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const StatusMark = ({ status, schoolShort }) => {
    if (status === 'req') {
      return (
        <div role="img" aria-label={`Required by ${schoolShort}`}
          className="flex items-center justify-center w-6 h-6 rounded-full mx-auto"
          style={{ backgroundColor: BRAND.orange }}>
          <Check size={13} color="white" strokeWidth={3} />
        </div>
      );
    }
    return (
      <div role="img" aria-label={`Not required at ${schoolShort}`}
        className="w-6 h-6 mx-auto flex items-center justify-center">
        <span style={{ color: '#C8C8CD', fontSize: 16, lineHeight: 1 }}>·</span>
      </div>
    );
  };

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

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header style={{ backgroundColor: 'white', borderBottom: `1px solid ${BRAND.grayLine}` }}>
        <div style={{ height: 4, backgroundColor: BRAND.orange }} />
        <div className="max-w-6xl mx-auto px-6 py-7">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.gray }}>UTRGV · Pre-Professional Development</div>
              <h1 className="font-display" style={{ fontSize: 40, color: BRAND.grayInk, marginTop: 6, lineHeight: 1.05 }}>
                Pharmacy School <span style={{ color: BRAND.orange }}>Planning Tool</span>
              </h1>
              <p style={{ color: BRAND.gray, marginTop: 8, fontSize: 15, maxWidth: 620, lineHeight: 1.5 }}>
                Compare prerequisites across the nine Texas Pharm.D. programs and map your undergraduate path through the PharmCAS application cycle.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ backgroundColor: BRAND.orangePale, color: BRAND.orangeDark }}>
              <Pill size={18} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em' }}>Pharm.D.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ── Verification banner ─────────────────────────────────────── */}
        <div className="p-4 rounded-lg flex gap-3" style={{ backgroundColor: BRAND.amberPale, border: `1px solid ${BRAND.amber}33` }}>
          <AlertTriangle size={18} style={{ color: BRAND.amber, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.amber }}>Verify school-specific exemptions</div>
            <div style={{ fontSize: 13, color: BRAND.grayInk, marginTop: 4, lineHeight: 1.5 }}>
              The source spreadsheet identifies course exemptions per school (UT Austin requires fewer courses than UT Tyler, for example), but exact column-by-column data hasn't been confirmed. This tool currently shows all courses as required for all schools. <strong>Eligibility data (GPA, PCAT, letters of recommendation) is not yet available in the source.</strong> Verify each school's published prerequisites before relying on this matrix.
            </div>
          </div>
        </div>

        {/* ── Step 1: School filter ───────────────────────────────────── */}
        <section>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.orange }}>Step 1</div>
              <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Choose your target schools</h2>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setSelected(SCHOOLS.map(s => s.id))}
                className="px-3 py-1.5 rounded transition-colors"
                style={{ fontSize: 13, color: BRAND.gray, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = BRAND.grayWash}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                Select all
              </button>
              <button onClick={() => setSelected([])}
                className="px-3 py-1.5 rounded transition-colors"
                style={{ fontSize: 13, color: BRAND.gray, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = BRAND.grayWash}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {SCHOOLS.map(school => {
              const on = selected.includes(school.id);
              return (
                <button key={school.id} onClick={() => toggleSchool(school.id)} aria-pressed={on}
                  className="text-left p-3 rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: on ? BRAND.orange : 'white',
                    color: on ? 'white' : BRAND.grayInk,
                    border: `1.5px solid ${on ? BRAND.orange : BRAND.grayLine}`,
                    boxShadow: on ? '0 1px 2px rgba(240,80,35,0.15)' : 'none',
                    cursor: 'pointer',
                  }}>
                  <div className="flex items-start justify-between gap-2">
                    <div style={{ minWidth: 0 }}>
                      <div className="font-display" style={{ fontSize: 15, lineHeight: 1.15 }}>{school.name}</div>
                      <div style={{ fontSize: 11, marginTop: 4, opacity: on ? 0.85 : 0.7 }}>
                        {school.city}, TX
                      </div>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: `1.5px solid ${on ? 'white' : '#D4D4D8'}`,
                      backgroundColor: on ? 'white' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {on && <Check size={12} color={BRAND.orange} strokeWidth={3} />}
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
              Select at least one school to see prerequisites.
            </p>
          </div>
        ) : (
          <>
            {/* Stat strip */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Schools compared"        value={visibleSchools.length} />
              <Stat label="Common required courses" value={commonCourses.length} />
              <Stat label="Tracked prerequisites"   value={allCourses.length} />
              <Stat label="Bachelor's required"     value="0" sub="of 9" />
            </section>

            {/* ── Step 2: Prereq matrix ─────────────────────────────── */}
            <section>
              <div className="mb-4">
                <div className="eyebrow" style={{ color: BRAND.orange }}>Step 2</div>
                <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Compare prerequisites</h2>
              </div>

              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 720, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: BRAND.grayInk }}>
                        <th className="text-left px-4 py-3" style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: 220 }}>
                          Course
                        </th>
                        {visibleSchools.map(s => (
                          <th key={s.id} className="px-2 py-3 text-center" style={{ color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: '0.03em' }}>
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
                              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                            }}>
                              {cat.name}
                            </td>
                          </tr>
                          {cat.courses.map(course => (
                            <tr key={course.code} style={{ borderTop: `1px solid ${BRAND.grayLine}` }}>
                              <td className="px-4 py-2.5">
                                <div className="num-rail" style={{ fontWeight: 700, fontSize: 13, color: BRAND.grayInk }}>{course.code}</div>
                                <div style={{ fontSize: 11, color: BRAND.gray, marginTop: 1 }}>{course.title}</div>
                              </td>
                              {visibleSchools.map(s => (
                                <td key={s.id} className="px-2 py-2.5">
                                  <StatusMark status={course.reqs[s.id]} schoolShort={s.short} />
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
                    <span style={{ color: '#C8C8CD', fontSize: 16, lineHeight: 1, paddingInline: 4 }}>·</span>
                    Not required
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Step 3: Timeline ────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <div className="eyebrow" style={{ color: BRAND.orange }}>Step 3</div>
            <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Plan your undergraduate years</h2>
          </div>

          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
            <div className="grid grid-cols-4" style={{ borderBottom: `1px solid ${BRAND.grayLine}` }}>
              {TIMELINE.map(t => {
                const on = activeYear === t.year;
                return (
                  <button key={t.year} onClick={() => setActiveYear(t.year)}
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
                      backgroundColor: BRAND.orangePale, color: BRAND.orangeDark,
                      fontWeight: 700, fontSize: 12, marginTop: 2,
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

        {/* ── How PharmCAS Works ────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <h2 className="font-display" style={{ fontSize: 22 }}>How PharmCAS works</h2>
            <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 4 }}>
              PharmCAS is the central application service for U.S. pharmacy schools. Application typically opens mid-July; school-specific deadlines vary widely (priority dates fall between November and March for most programs).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PHARMCAS_STEPS.map(step => (
              <div key={step.num} className="p-5 rounded-lg" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
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
              <h2 className="font-display" style={{ fontSize: 22, lineHeight: 1 }}>Educational pathway to Pharm.D.</h2>
              <p style={{ fontSize: 12, color: BRAND.gray, marginTop: 4 }}>From prerequisites through licensure and specialization.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {PATHWAY.map((p, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{
                  width: 22, height: 22,
                  backgroundColor: BRAND.orangePale, color: BRAND.orangeDark,
                  fontWeight: 700, fontSize: 11, marginTop: 2,
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

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <section className="rounded-lg p-6 md:p-8" style={{
          backgroundColor: BRAND.orange,
          color: 'white',
          backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 60%)',
        }}>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div style={{ maxWidth: 480 }}>
              <h3 className="font-display" style={{ fontSize: 26, lineHeight: 1.1 }}>Ready to start?</h3>
              <p style={{ marginTop: 8, fontSize: 14, opacity: 0.95, lineHeight: 1.5 }}>
                Schedule a meeting with the UTRGV Office of Pre-Professional Development to build your individualized pre-pharmacy plan.
              </p>
            </div>
            <a href="https://www.utrgv.edu/student-success/for-students/pre-professional/index.htm"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded transition-all"
              style={{ backgroundColor: 'white', color: BRAND.orange, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <ExternalLink size={14} />
              Visit OPPD
            </a>
          </div>
        </section>

        <p style={{ fontSize: 11, color: BRAND.gray, lineHeight: 1.6, textAlign: 'center', maxWidth: 660, margin: '0 auto' }}>
          Prerequisite data is compiled from each school's published requirements for planning purposes. Always verify with the official catalog and PharmCAS (pharmcas.liaisoncas.com) before applying.
        </p>
      </main>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
      <div className="eyebrow" style={{ color: BRAND.gray }}>{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="font-display num-rail" style={{ fontSize: 30, color: BRAND.orange, marginTop: 6, lineHeight: 1 }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: 11, color: BRAND.gray, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}
