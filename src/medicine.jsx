import React, { useState, useMemo } from 'react';
import {
  Check, ExternalLink, Info, AlertTriangle, Stethoscope, Award,
  FileText, Send, Building2, CalendarClock
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
// COURSE CATEGORIES (24 prerequisites)
// ─────────────────────────────────────────────────────────────────────────────
const COURSE_CATEGORIES = [
  {
    name: 'Life Sciences',
    courses: [
      { code: 'BIOL 1406', title: 'General Biology I' },
      { code: 'BIOL 1407', title: 'General Biology II' },
      { code: 'BIOL 3313', title: 'Microbiology' },
      { code: 'BIOL 3315', title: 'Cell Biology' },
      { code: 'BIOL 3401', title: 'Genetics' },
    ],
  },
  {
    name: 'Chemistry & Biochemistry',
    courses: [
      { code: 'CHEM 3303', title: 'Biochemistry' },
      { code: 'CHEM 1311', title: 'General Chemistry I' },
      { code: 'CHEM 1111', title: 'General Chem I Lab' },
      { code: 'CHEM 1312', title: 'General Chemistry II' },
      { code: 'CHEM 1112', title: 'General Chem II Lab' },
      { code: 'CHEM 2323', title: 'Organic Chemistry I' },
      { code: 'CHEM 2123', title: 'Organic Chem I Lab' },
      { code: 'CHEM 2325', title: 'Organic Chemistry II' },
      { code: 'CHEM 2125', title: 'Organic Chem II Lab' },
    ],
  },
  {
    name: 'Physics · Math',
    courses: [
      { code: 'PHYS 1401', title: 'General Physics I' },
      { code: 'PHYS 1402', title: 'General Physics II' },
      { code: 'MATH 2413', title: 'Calculus I' },
      { code: 'MATH 1342', title: 'Statistics' },
    ],
  },
  {
    name: 'English · Languages',
    courses: [
      { code: 'ENGL 1301', title: 'Composition I' },
      { code: 'ENGL 1302', title: 'Composition II' },
      { code: 'SPAN 1311', title: 'Beginning Spanish I' },
    ],
  },
  {
    name: 'Humanities & Behavioral',
    courses: [
      { code: 'MUSI/ARTS', title: 'Music or Art Appreciation' },
      { code: 'PSYC 2301', title: 'General Psychology' },
      { code: 'PHIL 1301', title: 'Introduction to Philosophy' },
    ],
  },
];
const ALL_COURSE_CODES = COURSE_CATEGORIES.flatMap(c => c.courses.map(x => x.code));

// ─────────────────────────────────────────────────────────────────────────────
// SCHOOLS (14 Texas medical schools) with explicit course Y/N data
// 24 positions, true = required, false = not required
// Footnotes: ^ indicates a value interpolated from source gaps (verify)
// ─────────────────────────────────────────────────────────────────────────────
const T = true, F = false;
const SCHOOLS = [
  { id: 'baylor',     name: 'Baylor College of Medicine',                            short: 'Baylor',                 city: 'Houston',
    courses: [F,F,T,F,F, T,F,F,F,F,T,F,T,F, F,F,F,T, T,F,T, T,T,T] },
  { id: 'longsom',    name: 'Long School of Medicine (UT San Antonio)',              short: 'Long (UT San Antonio)',  city: 'San Antonio',
    courses: [T,T,T,T,F, T,T,T,T,T,T,T,T,T, T,F,T,T, T,F,F, F,F,F], notes: 'PHIL 1301 interpolated' },
  { id: 'mcgovern',   name: 'McGovern Medical School (UT Houston)',                  short: 'McGovern (UT Houston)',  city: 'Houston',
    courses: [T,T,T,T,T, T,T,T,T,T,T,T,T,T, T,T,F,F, T,T,F, F,F,F], notes: 'PHYS 1401/1402 interpolated' },
  { id: 'samhouston', name: 'Sam Houston State College of Osteopathic Medicine',     short: 'Sam Houston (DO)',       city: 'Conroe',
    courses: [T,T,F,F,F, F,T,T,T,T,T,T,T,T, T,T,T,T, T,T,F, F,F,F] },
  { id: 'tamu',       name: 'Texas A&M Vashisht College of Medicine',                short: 'Texas A&M',              city: 'Bryan',
    courses: [T,T,T,F,F, T,T,T,T,T,T,T,T,T, T,T,F,T, T,T,F, F,F,F] },
  { id: 'ttuelpaso',  name: 'TTU HSC Paul L. Foster School of Medicine',             short: 'TTU El Paso (Foster)',   city: 'El Paso',
    courses: [T,T,T,F,T, T,T,T,T,T,T,T,T,T, T,F,T,T, T,F,F, F,F,F], notes: 'PHIL 1301 interpolated' },
  { id: 'ttulubbock', name: 'TTU HSC School of Medicine at Lubbock',                 short: 'TTU Lubbock',            city: 'Lubbock',
    courses: [T,T,T,F,F, T,T,T,T,T,T,T,T,T, T,T,F,T, T,T,F, F,F,F] },
  { id: 'fertitta',   name: 'Fertitta Family College of Medicine (UH)',              short: 'Fertitta (UH)',          city: 'Houston',
    courses: [T,T,T,F,F, T,T,T,T,T,T,T,T,T, T,T,F,T, T,T,F, F,F,F] },
  { id: 'unthsc',     name: 'UNT Health Fort Worth, Texas College of Osteopathic Medicine', short: 'UNT HSC (DO)',    city: 'Fort Worth',
    courses: [T,T,T,T,T, F,T,T,T,T,T,T,T,T, T,T,F,T, T,T,F, F,F,F] },
  { id: 'dell',       name: 'Dell Medical School (UT Austin)',                       short: 'Dell (UT Austin)',       city: 'Austin',
    courses: [T,T,T,F,F, T,T,T,F,F,T,T,T,T, T,T,F,T, T,F,F, F,F,F] },
  { id: 'johnsealy',  name: 'John Sealy School of Medicine (UTMB Galveston)',        short: 'John Sealy (UTMB)',      city: 'Galveston',
    courses: [T,T,T,T,F, T,T,T,T,T,T,T,T,T, T,T,F,T, T,T,F, F,F,F] },
  { id: 'utrgvsom',   name: 'UT Rio Grande Valley School of Medicine',               short: 'UT Rio Grande Valley',   city: 'Edinburg',
    courses: [T,T,T,T,F, T,T,T,T,T,T,T,T,T, T,T,F,T, T,T,F, F,F,F] },
  { id: 'utsw',       name: 'UT Southwestern Medical School',                        short: 'UT Southwestern',        city: 'Dallas',
    courses: [T,T,T,F,T, T,T,T,F,F,T,T,F,F, T,T,T,T, T,T,F, F,F,F], notes: 'PSYC 2301 / PHIL 1301 interpolated' },
  { id: 'uttyler',    name: 'UT Tyler School of Medicine',                           short: 'UT Tyler',               city: 'Tyler',
    courses: [T,T,T,T,T, T,T,T,T,T,T,T,T,T, T,T,F,T, T,T,F, F,F,F] },
];

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINES
// ─────────────────────────────────────────────────────────────────────────────
const UNDERGRAD_TIMELINE = [
  {
    year: 1, label: 'First Year', focus: 'Explore and establish.',
    items: [
      'Explore medicine as a career; shadow physicians (both M.D. and D.O.).',
      'Meet with a pre-med advisor to map prerequisites and your MCAT timeline.',
      'Develop strong study skills; admitted classes typically carry GPAs of 3.5 and above.',
      'Join pre-medical student organizations and pre-health honor societies.',
      'Begin gaining clinical exposure through volunteering or healthcare employment.',
    ],
  },
  {
    year: 2, label: 'Second Year', focus: 'Build experience and research.',
    items: [
      'Maintain a competitive GPA in upper-level science courses.',
      'Continue accumulating clinical and shadowing experience — quality over quantity.',
      'Build relationships with faculty for letters of evaluation or a committee letter.',
      'Consider research opportunities; many programs value research experience.',
      'Plan your MCAT prep timeline — typically taken in spring/summer of year 3.',
    ],
  },
  {
    year: 3, label: 'Third Year', focus: 'Test, research, and prepare.',
    items: [
      'Take the MCAT early enough to allow a retake if needed.',
      'Identify Texas (TMDSAS) and out-of-state (AMCAS / AACOMAS) target schools.',
      'Request a committee letter or 3\u20135 individual letters of evaluation.',
      'Continue strengthening clinical, research, and service experience.',
      'Begin drafting the TMDSAS personal essay set (personal, optional, and most meaningful experiences).',
    ],
  },
  {
    year: 4, label: 'Fourth Year', focus: 'Submit and interview.',
    items: [
      'Submit TMDSAS as early as possible \u2014 the application opens May 1.',
      'Submit any secondary applications for out-of-state programs (AMCAS / AACOMAS).',
      'Prepare for and attend interviews (typically October through January).',
      'Submit your Texas Match preference rankings by Jan 29.',
      'Receive match results Feb 12; complete enrollment steps promptly.',
    ],
  },
];

// TMDSAS dates — Entry Year 2027
const TMDSAS_DATES = [
  { mo: 'May', d: '1',  day: 'Fri', tag: 'Opens',           title: 'TMDSAS Application Available',            note: 'Begin gathering all supporting materials', kind: 'open' },
  { mo: 'May', d: '15', day: 'Fri', tag: 'Submission',      title: 'TMDSAS Submission Opens',                 note: 'Complete and begin submitting your application', kind: 'open' },
  { mo: 'Aug', d: '3',  day: 'Mon', tag: 'Early Decision',  title: 'UTRGV SOM Early Decision Deadline',       note: 'Application submission deadline for ED program', kind: 'early', star: true },
  { mo: 'Aug', d: '14', day: 'Fri', tag: 'Early Decision',  title: 'Early Decision Supporting Docs Due',      note: 'Transcripts, letters, test scores received by TMDSAS', kind: 'early', star: true },
  { mo: 'Oct', d: '1',  day: 'Thu', tag: 'Final Deadline',  title: 'Application Submission + ED Decisions',   note: '11:59 p.m. CST · TMDSAS does not grant extensions', kind: 'deadline' },
  { mo: 'Oct', d: '15', day: 'Thu', tag: 'Interviews',      title: 'Schools Begin Extending Offers',          note: 'Rolling admissions begin · letters due by this date', kind: 'interview' },
  { mo: 'Jan', d: '29', day: 'Fri', tag: 'Match',           title: 'School Preference Ranking Deadline',      note: 'Texas Match preference rankings · 5 p.m. CST', kind: 'match' },
  { mo: 'Feb', d: '12', day: '',    tag: 'Match Results',   title: 'TMDSAS Match Results Released',           note: 'Review placement and proceed with enrollment', kind: 'match' },
];

const TMDSAS_STEPS = [
  {
    num: 1, title: 'You (Applicant)', Icon: Send,
    body: 'Complete prerequisites and MCAT, submit your TMDSAS application by Oct 1, request 3\u20135 letters of evaluation (or a committee letter), and send official transcripts.',
  },
  {
    num: 2, title: 'TMDSAS', Icon: FileText,
    body: 'Processes and verifies your application, calculates standardized GPAs, and distributes your verified file to the Texas medical schools you designate.',
  },
  {
    num: 3, title: 'Medical Schools', Icon: Building2,
    body: 'Review on a rolling basis, conduct interviews (typically October\u2013January), and participate in the Texas Match. Out-of-state schools use AMCAS or AACOMAS instead.',
  },
];

const PATHWAY = [
  { label: "Bachelor's degree",  body: 'Required by all 14 Texas medical schools. Any major is acceptable; complete the prerequisite science coursework alongside your degree.' },
  { label: 'Medical school',     body: 'Four years \u2014 typically two years of preclinical sciences followed by two years of clinical rotations. Graduates earn an M.D. or D.O.' },
  { label: 'Residency',          body: 'Three to seven years of postgraduate specialty training. Placement occurs through the NRMP Match for both M.D. and D.O. graduates.' },
  { label: 'Licensure & practice', body: 'Pass USMLE Steps 1\u20133 (or COMLEX for D.O. graduates), obtain state licensure, and optionally pursue fellowship and board certification.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function MedicinePlanningTool() {
  const [selected, setSelected] = useState(SCHOOLS.map(s => s.id));
  const [activeYear, setActiveYear] = useState(1);

  const visibleSchools = useMemo(() => SCHOOLS.filter(s => selected.includes(s.id)), [selected]);
  const totalCourses = ALL_COURSE_CODES.length;

  const stats = useMemo(() => {
    const rows = visibleSchools;
    const allReqsCount = c => rows.filter(s => s.courses[ALL_COURSE_CODES.indexOf(c)]).length;
    // courses required by all visible
    const universal = ALL_COURSE_CODES.filter(c => allReqsCount(c) === rows.length).length;
    const avg = rows.length
      ? Math.round(rows.reduce((sum, s) => sum + s.courses.filter(Boolean).length, 0) / rows.length)
      : 0;
    return { count: rows.length, universal, avg };
  }, [visibleSchools]);

  const toggleSchool = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const Yes = ({ size = 22 }) => (
    <div role="img" aria-label="Required" className="flex items-center justify-center rounded-full mx-auto"
      style={{ width: size, height: size, backgroundColor: BRAND.orange }}>
      <Check size={Math.round(size * 0.55)} color="white" strokeWidth={3} />
    </div>
  );
  const Dash = () => (
    <div role="img" aria-label="Not required" className="text-center" style={{ color: '#C8C8CD', fontSize: 17, lineHeight: 1 }}>—</div>
  );

  const activeTimeline = UNDERGRAD_TIMELINE.find(t => t.year === activeYear);

  const flatCourses = COURSE_CATEGORIES.flatMap(c => c.courses);

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
                Medical School <span style={{ color: BRAND.orange }}>Planning Tool</span>
              </h1>
              <p style={{ color: BRAND.gray, marginTop: 8, fontSize: 15, maxWidth: 640, lineHeight: 1.5 }}>
                Compare course prerequisites across the fourteen Texas medical schools, and map your path through the TMDSAS application cycle for Entry Year 2027.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ backgroundColor: BRAND.orangePale, color: BRAND.orangeDark }}>
              <Stethoscope size={18} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em' }}>M.D. / D.O.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ── Verification banner ─────────────────────────────────────── */}
        <div className="p-4 rounded-lg flex gap-3" style={{ backgroundColor: BRAND.amberPale, border: `1px solid ${BRAND.amber}33` }}>
          <AlertTriangle size={18} style={{ color: BRAND.amber, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.amber }}>What's in this matrix — and what isn't</div>
            <div style={{ fontSize: 13, color: BRAND.grayInk, marginTop: 4, lineHeight: 1.5 }}>
              This guide shows <strong>course prerequisites only</strong>, transcribed directly from the source data. Four rows had 1\u20132 cells interpolated from source gaps based on each program's published requirements: Long School (PHIL 1301), McGovern (PHYS 1401/1402), TTU El Paso (PHIL 1301), and UT Southwestern (PSYC 2301, PHIL 1301). All 14 schools also require the <strong>MCAT, a bachelor's degree, 3\u20135 letters of evaluation</strong> (or a committee letter), the <strong>TMDSAS personal essay set</strong>, and significant clinical and service experience — those are not shown here. Verify each program's published requirements before applying.
            </div>
          </div>
        </div>

        {/* ── Step 1: Choose schools ─────────────────────────────────── */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
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
                      <div className="font-display" style={{ fontSize: 13, lineHeight: 1.18 }}>{school.name}</div>
                      <div style={{ fontSize: 11, marginTop: 4, opacity: on ? 0.85 : 0.7 }}>{school.city}, TX</div>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: `1.5px solid ${on ? 'white' : '#D4D4D8'}`,
                      backgroundColor: on ? 'white' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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
              Select at least one school to compare prerequisites.
            </p>
          </div>
        ) : (
          <>
            {/* Stat strip */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Schools compared"           value={stats.count} />
              <Stat label="Universal prereqs"          value={stats.universal} sub={`of ${totalCourses}`} />
              <Stat label="Avg. courses required"      value={stats.avg}       sub={`of ${totalCourses}`} />
              <Stat label="Apply via"                  value="TMDSAS"          sub="for Texas schools" />
            </section>

            {/* ── Step 2: Course matrix ───────────────────────────── */}
            <section>
              <div className="mb-4">
                <div className="eyebrow" style={{ color: BRAND.orange }}>Step 2</div>
                <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Compare course prerequisites</h2>
              </div>

              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 920, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: BRAND.grayInk }}>
                        <th rowSpan={2} className="text-left px-4 py-2" style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: 200, verticalAlign: 'bottom' }}>
                          School
                        </th>
                        {COURSE_CATEGORIES.map(cat => (
                          <th key={cat.name} colSpan={cat.courses.length} className="px-2 py-1.5 text-center"
                            style={{ color: BRAND.orangePale, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', borderLeft: `1px solid #3A3A40` }}>
                            {cat.name}
                          </th>
                        ))}
                      </tr>
                      <tr style={{ backgroundColor: '#2A2A30' }}>
                        {flatCourses.map(course => (
                          <th key={course.code} className="px-1 py-2 text-center" style={{ color: 'white', fontSize: 9, fontWeight: 700, lineHeight: 1.2 }}>
                            {course.code.split(' ').map((part, i) => <div key={i}>{part}</div>)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleSchools.map((s, idx) => (
                        <tr key={s.id} style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: s.id === 'utrgvsom' ? BRAND.orangePale : (idx % 2 ? 'white' : '#FCFCFC') }}>
                          <td className="px-4 py-2.5">
                            <div style={{ fontWeight: 700, fontSize: 12.5, color: BRAND.grayInk, lineHeight: 1.2 }}>{s.short}</div>
                            <div style={{ fontSize: 10.5, color: BRAND.gray, marginTop: 1 }}>{s.city}{s.notes ? ` · ${s.notes}` : ''}</div>
                          </td>
                          {s.courses.map((req, i) => (
                            <td key={i} className="px-1 py-2.5 text-center">
                              {req ? <Yes size={18} /> : <Dash />}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 flex flex-wrap gap-5 items-center" style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: BRAND.grayWash }}>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600 }}>
                    <Yes size={18} /> Required
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600 }}>
                    <span style={{ color: '#C8C8CD', fontSize: 16, paddingInline: 6 }}>—</span> Not required
                  </div>
                  <div style={{ fontSize: 11, color: BRAND.gray, marginLeft: 'auto' }}>
                    UTRGV row highlighted · scroll to see all 24 courses
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Step 3: Undergraduate timeline ───────────────────────────── */}
        <section>
          <div className="mb-4">
            <div className="eyebrow" style={{ color: BRAND.orange }}>Step 3</div>
            <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Plan your undergraduate years</h2>
          </div>

          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
            <div className="grid grid-cols-4" style={{ borderBottom: `1px solid ${BRAND.grayLine}` }}>
              {UNDERGRAD_TIMELINE.map(t => {
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

        {/* ── Step 4: TMDSAS cycle dates ─────────────────────────────── */}
        <section>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.orange }}>Step 4</div>
              <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>TMDSAS application cycle</h2>
              <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 6, maxWidth: 640, lineHeight: 1.5 }}>
                Key dates for the TMDSAS Entry Year 2027 application cycle. TMDSAS does <strong>not grant deadline extensions</strong> under any circumstances — submit before October 1.
              </p>
            </div>
            <div className="text-right">
              <div className="eyebrow" style={{ color: BRAND.gray, fontSize: 10 }}>Entry Year</div>
              <div className="font-display num-rail" style={{ fontSize: 28, color: BRAND.orange, lineHeight: 1 }}>2027</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TMDSAS_DATES.map((date, idx) => {
              const isCrit = date.kind === 'deadline' || date.star;
              return (
                <div key={idx} className="p-4 rounded-lg" style={{
                  backgroundColor: 'white',
                  border: isCrit ? `1.5px solid ${BRAND.orange}` : `1px solid ${BRAND.grayLine}`,
                  position: 'relative',
                }}>
                  {date.star && (
                    <div style={{ position: 'absolute', top: -8, right: 12, backgroundColor: BRAND.orange, color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, letterSpacing: '0.05em' }}>
                      ★ ED
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="eyebrow" style={{ color: BRAND.orangeDark, fontSize: 9 }}>{date.mo}</span>
                  </div>
                  <div className="font-display num-rail" style={{ fontSize: 28, color: isCrit ? BRAND.orange : BRAND.grayInk, lineHeight: 1, marginTop: 2 }}>
                    {date.d}
                  </div>
                  {date.day && <div style={{ fontSize: 10, color: BRAND.gray, marginTop: 2, fontStyle: 'italic' }}>{date.day}</div>}
                  <div style={{ fontSize: 9, color: BRAND.gray, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 7 }}>
                    {date.tag}
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: BRAND.grayInk, marginTop: 3, lineHeight: 1.25 }}>
                    {date.title}
                  </div>
                  <div style={{ fontSize: 11, color: BRAND.gray, marginTop: 4, lineHeight: 1.4 }}>
                    {date.note}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How TMDSAS Works ────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <h2 className="font-display" style={{ fontSize: 22 }}>How TMDSAS works</h2>
            <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 4, maxWidth: 640, lineHeight: 1.5 }}>
              TMDSAS is the centralized application service for all Texas public medical (and dental) schools. Out-of-state medical schools use AMCAS (M.D.) or AACOMAS (D.O.) instead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TMDSAS_STEPS.map(step => (
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
              <h2 className="font-display" style={{ fontSize: 22, lineHeight: 1 }}>Educational pathway to M.D. / D.O.</h2>
              <p style={{ fontSize: 12, color: BRAND.gray, marginTop: 4 }}>From prerequisites through licensure and practice.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {PATHWAY.map((p, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{
                  width: 22, height: 22, backgroundColor: BRAND.orangePale, color: BRAND.orangeDark,
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
                Schedule a meeting with the UTRGV Office of Pre-Professional Development to build your individualized pre-med plan.
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
          Course prerequisites are compiled from each school's published requirements for planning purposes. Always verify with the official school websites and TMDSAS (tmdsas.com) before applying.
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
