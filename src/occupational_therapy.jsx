import { useState, useMemo } from 'react';
import {
  Check, ExternalLink, Info, AlertTriangle, HandHelping, Award,
  FileText, Send, Building2
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
// COURSE CATEGORIES (14 prerequisites)
// ─────────────────────────────────────────────────────────────────────────────
const COURSE_CATEGORIES = [
  {
    name: 'Life Sciences & Physics',
    courses: [
      { code: 'BIOL 1406', title: 'General Biology I' },
      { code: 'BIOL 2401', title: 'Anatomy & Physiology I' },
      { code: 'BIOL 2402', title: 'Anatomy & Physiology II' },
      { code: 'PHYS 1401', title: 'General Physics I' },
    ],
  },
  {
    name: 'Psychology',
    courses: [
      { code: 'PSYC 2301', title: 'General Psychology' },
      { code: 'PSYC 2314', title: 'Lifespan Psychology' },
      { code: 'PSYC 4313', title: 'Abnormal Psychology' },
    ],
  },
  {
    name: 'Social Sciences & Humanities',
    courses: [
      { code: 'SOCI 1301', title: 'Introduction to Sociology' },
      { code: 'KINE 3370', title: 'Kinesiology' },
      { code: 'PHIL 1301', title: 'Introduction to Philosophy' },
      { code: 'SOCI 4310', title: 'Advanced Sociology' },
      { code: 'SOCI 3301', title: 'Sociological Theory' },
    ],
  },
  {
    name: 'Math & Communication',
    courses: [
      { code: 'MATH 1342', title: 'Statistics' },
      { code: 'HRPT 2303', title: 'Medical Terminology' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCHOOLS (16 Texas OT programs)
// elig: gpa, gre/essay/bachelor(bool), letters(num|null), shadow(str|null),
//       interview('req'|'opt'|'none')
// courses: 14-element boolean array (source order)
// ─────────────────────────────────────────────────────────────────────────────
const T = true, F = false;
const SCHOOLS = [
  { id:'abilene',    name:'Abilene Christian University',          city:'Abilene',
    elig:{ gpa:3.2, gre:F, essay:T, letters:3,    shadow:'40', interview:'req',  bachelor:T },
    courses:[F,T,T,F, F,T,T, T,F,F,F,F, T,T] },
  { id:'baylor',     name:'Baylor University',                     city:'Waco',
    elig:{ gpa:3.0, gre:F, essay:T, letters:3,    shadow:'30', interview:'req',  bachelor:T },
    courses:[F,T,T,F, T,T,T, T,T,T,T,T, F,T] },
  { id:'ttuhsc',     name:'Texas Tech University HSC',             city:'Lubbock',
    elig:{ gpa:3.0, gre:F, essay:T, letters:3,    shadow:'40', interview:'req',  bachelor:T },
    courses:[F,T,T,T, F,T,T, T,T,T,F,F, F,F], notes:'OCR token-count anomaly' },
  { id:'twu',        name:'Texas Woman\u2019s University',         city:'Denton · Dallas · Houston',
    elig:{ gpa:3.0, gre:F, essay:T, letters:3,    shadow:'20', interview:'req',  bachelor:T },
    courses:[F,T,T,F, F,T,T, T,F,F,F,F, T,T] },
  { id:'armybaylor', name:'U.S. Army Medical Center / Baylor',     city:'San Antonio',
    elig:{ gpa:3.0, gre:T, essay:T, letters:3,    shadow:'40', interview:'req',  bachelor:T },
    courses:[T,T,T,T, T,T,T, T,T,T,F,F, F,F], notes:'OCR token-count anomaly' },
  { id:'usahs',      name:'University of St. Augustine HS',        city:'Austin / Dallas',
    elig:{ gpa:3.0, gre:F, essay:T, letters:null, shadow:null, interview:'req',  bachelor:T },
    courses:[F,T,T,F, F,T,T, T,F,F,F,F, T,T], notes:'Letters & shadow unclear in source' },
  { id:'utep',       name:'University of Texas at El Paso',        city:'El Paso',
    elig:{ gpa:3.0, gre:F, essay:T, letters:3,    shadow:'40', interview:'req',  bachelor:T },
    courses:[F,T,T,F, T,T,T, T,F,F,F,F, T,T] },
  { id:'utsahsc',    name:'UT Health San Antonio',                 city:'San Antonio',
    elig:{ gpa:3.0, gre:F, essay:F, letters:2,    shadow:'30', interview:'req',  bachelor:T },
    courses:[F,T,T,F, T,T,F, T,F,F,F,F, T,T] },
  { id:'utmb',       name:'UT Medical Branch',                     city:'Galveston',
    elig:{ gpa:3.0, gre:F, essay:T, letters:3,    shadow:'20', interview:'req',  bachelor:T },
    courses:[F,T,T,F, F,T,T, T,T,T,F,F, T,F] },
  { id:'utrgv',      name:'UT Rio Grande Valley',                  city:'Edinburg',
    elig:{ gpa:3.0, gre:T, essay:T, letters:3,    shadow:'YES', interview:'req', bachelor:T },
    courses:[T,T,T,T, T,F,T, T,T,T,F,F, F,F], notes:'Shadow count unspecified · OCR anomaly' },
  { id:'uiw',        name:'University of the Incarnate Word',      city:'San Antonio',
    elig:{ gpa:3.0, gre:F, essay:T, letters:3,    shadow:'50', interview:'req',  bachelor:T },
    courses:[T,T,T,F, T,F,T, T,F,F,F,F, T,T] },
  { id:'stedwards',  name:'St. Edward\u2019s University',          city:'Austin',
    elig:{ gpa:3.0, gre:F, essay:T, letters:1,    shadow:null, interview:'req',  bachelor:T },
    courses:[F,T,T,F, F,T,T, T,F,F,F,F, T,T] },
  { id:'tarleton',   name:'Tarleton State University',             city:'Stephenville',
    elig:{ gpa:3.0, gre:F, essay:T, letters:null, shadow:null, interview:'req',  bachelor:T },
    courses:[F,T,T,F, T,F,F, T,F,F,F,F, T,F] },
  { id:'tcu',        name:'Texas Christian University',            city:'Fort Worth',
    elig:{ gpa:3.0, gre:F, essay:F, letters:null, shadow:'30', interview:'req',  bachelor:T },
    courses:[F,T,T,T, F,T,T, T,F,F,F,F, T,T] },
  { id:'umhb',       name:'University of Mary Hardin-Baylor',      city:'Belton',
    elig:{ gpa:3.5, gre:F, essay:F, letters:null, shadow:null, interview:'req',  bachelor:T },
    courses:[F,T,T,T, F,T,T, T,F,F,F,F, T,T] },
  { id:'utmbLaredo', name:'UTMB \u2014 Laredo Campus',             city:'Laredo',
    elig:{ gpa:3.0, gre:F, essay:F, letters:3,    shadow:'20', interview:'none', bachelor:T },
    courses:[F,T,T,F, F,T,T, T,T,T,F,F, T,F] },
];

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINES
// ─────────────────────────────────────────────────────────────────────────────
const UNDERGRAD_TIMELINE = [
  {
    year: 1, label: 'First Year', focus: 'Explore and establish.',
    items: [
      'Explore OT as a career; shadow licensed occupational therapists across settings (acute, outpatient, pediatric, mental health).',
      'Meet with a pre-OT advisor to map prerequisites and your degree plan.',
      'Build study skills and maintain a competitive GPA — 3.0 is a common floor, admitted classes run higher.',
      'Join pre-OT or pre-health student organizations.',
      'Begin accumulating OT observation hours early — many programs expect documented hours.',
    ],
  },
  {
    year: 2, label: 'Second Year', focus: 'Build hours and research.',
    items: [
      'Maintain a competitive GPA in upper-level science and psychology courses.',
      'Continue building observation hours across multiple OT practice settings.',
      'Build relationships with faculty and OTs for letters of evaluation.',
      'Research OT programs and their specific prerequisites and observation hour requirements.',
      'Confirm each target program\u2019s GRE policy — most Texas OT programs no longer require it.',
    ],
  },
  {
    year: 3, label: 'Third Year', focus: 'Prepare and apply.',
    items: [
      'Review OTCAS and each program\u2019s application requirements.',
      'Take the GRE if your target programs still require it (few do).',
      'Continue building observation hours toward each program\u2019s target.',
      'Begin formally requesting letters of evaluation.',
      'Create a budget for application and interview costs.',
    ],
  },
  {
    year: 4, label: 'Fourth Year', focus: 'Submit and finalize.',
    items: [
      'Complete prerequisite courses and degree requirements.',
      'Draft your OTCAS personal essay and request official transcripts.',
      'Submit your OTCAS application at the 6\u20138 week mark — not the deadline — for early rolling review.',
      'Prepare for and attend interviews.',
      'Review decisions, accept an offer promptly, and apply for financial aid.',
    ],
  },
];

const OTCAS_PHASES = [
  {
    timing: 'Before Start', tier: 'Foundation', title: 'Lay the Groundwork',
    items: [
      'Research programs — check deadlines, fees, prerequisites, test scores, and all requirements.',
      'Request official transcripts and enter your coursework.',
      'Contact potential evaluators to confirm participation.',
      'Begin drafting your personal essay.',
      'Review the OTCAS Help Center and Applicant Responsibilities.',
    ],
  },
  {
    timing: '3 Months', tier: 'Prior to Deadline', title: 'Set Up Your Application',
    items: [
      'Create your OTCAS account.',
      'Complete the Colleges Attended section.',
      'Complete the Evaluations section.',
    ],
  },
  {
    timing: '10–12 Weeks', tier: 'Prior to Deadline', title: 'Transcripts & Coursework',
    items: [
      'Send official transcripts directly to OTCAS — resolve any holds now.',
      'Begin entering coursework into your application.',
      'If using Professional Transcript Entry (PTE), sign up and submit payment.',
      'Confirm your evaluators received the request via email.',
    ],
  },
  {
    timing: '6–8 Weeks', tier: 'Submit Window', title: 'Submit Your Application',
    items: [
      'Complete and submit your application.',
      'Review the verification process.',
      'If you paid for PTE, monitor emails and approve coursework promptly.',
      'Keep track of all transcripts and evaluations — follow up on missing items.',
    ],
    highlight: true,
  },
  {
    timing: '4–6 Weeks', tier: 'Prior to Deadline', title: 'Monitor & Verify',
    items: [
      'Continue monitoring your application until your status is fully verified.',
    ],
  },
  {
    timing: 'After', tier: 'Deadline', title: 'Save Your Records',
    items: [
      'Download a copy of your completed application for your personal records.',
    ],
  },
];

const OTCAS_STEPS = [
  {
    num: 1, title: 'You (Applicant)', Icon: Send,
    body: 'Complete prerequisites and observation hours, submit your OTCAS application, request letters of evaluation, send official transcripts, and submit GRE scores if required.',
  },
  {
    num: 2, title: 'OTCAS', Icon: FileText,
    body: 'Verifies transcripts, calculates standardized GPAs, processes your application, and delivers your verified file to designated OT programs.',
  },
  {
    num: 3, title: 'OT Programs', Icon: Building2,
    body: 'Review applications (most on a rolling basis), conduct interviews, and make admissions decisions independently.',
  },
];

const PATHWAY = [
  { label: "Bachelor's degree", body: 'Required by all 16 Texas OT programs. Complete prerequisite coursework and observation hours alongside your degree — any major is acceptable.' },
  { label: 'OT school',          body: 'Two-and-a-half to three years for a Master of Occupational Therapy (M.O.T.) or Doctor of Occupational Therapy (O.T.D.) — includes coursework and clinical fieldwork.' },
  { label: 'NBCOT certification', body: 'Pass the NBCOT examination administered by the National Board for Certification in Occupational Therapy to become an OTR (Occupational Therapist, Registered).' },
  { label: 'Licensure & specialization', body: 'Obtain state licensure to practice. Optionally pursue advanced specialty certifications in areas like pediatrics, mental health, hand therapy, or assistive technology.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Yes = ({ size = 22 }) => (
  <div role="img" aria-label="Required" className="flex items-center justify-center rounded-full mx-auto"
    style={{ width: size, height: size, backgroundColor: BRAND.orange }}>
    <Check size={Math.round(size * 0.55)} color="white" strokeWidth={3} />
  </div>
);
const Dash = ({ label = 'Not required' }) => (
  <div role="img" aria-label={label} className="text-center" style={{ color: '#C8C8CD', fontSize: 17, lineHeight: 1 }}>—</div>
);
const LettersCell = ({ value }) => {
  if (value === null || value === undefined) return <Dash label="Not specified" />;
  return <span className="font-display num-rail" style={{ fontSize: 17, color: BRAND.orangeDark, lineHeight: 1 }}>{value}</span>;
};
const ShadowCell = ({ value }) => {
  if (!value) return <Dash label="Not specified" />;
  if (value === 'YES') {
    return <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 3, backgroundColor: BRAND.orangePale, color: BRAND.orangeDark, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>YES</span>;
  }
  return <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.grayInk }}>{value}</span>;
};

export default function OTPlanningTool() {
  const [selected, setSelected] = useState(SCHOOLS.map(s => s.id));
  const [activeYear, setActiveYear] = useState(1);

  const visibleSchools = useMemo(() => SCHOOLS.filter(s => selected.includes(s.id)), [selected]);

  const stats = useMemo(() => {
    const rows = visibleSchools;
    return {
      count:  rows.length,
      gre:    rows.filter(s => s.elig.gre).length,
      shadow: rows.filter(s => s.elig.shadow).length,
      avgGpa: rows.length
        ? (rows.reduce((sum, s) => sum + s.elig.gpa, 0) / rows.length).toFixed(2)
        : '—',
    };
  }, [visibleSchools]);

  const toggleSchool = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const activeTimeline = UNDERGRAD_TIMELINE.find(t => t.year === activeYear);

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
                Occupational Therapy <span style={{ color: BRAND.orange }}>Planning Tool</span>
              </h1>
              <p style={{ color: BRAND.gray, marginTop: 8, fontSize: 15, maxWidth: 640, lineHeight: 1.5 }}>
                Compare admission requirements and prerequisites across Texas M.O.T. and O.T.D. programs, and map your path through the OTCAS application cycle.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ backgroundColor: BRAND.orangePale, color: BRAND.orangeDark }}>
              <HandHelping size={18} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em' }}>M.O.T. / O.T.D.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ── Verification banner ─────────────────────────────────────── */}
        <div className="p-4 rounded-lg flex gap-3" style={{ backgroundColor: BRAND.amberPale, border: `1px solid ${BRAND.amber}33` }}>
          <AlertTriangle size={18} style={{ color: BRAND.amber, flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.amber }}>Verify program-specific requirements</div>
            <div style={{ fontSize: 13, color: BRAND.grayInk, marginTop: 4, lineHeight: 1.5 }}>
              Eligibility data is faithfully transcribed from the source — including <strong>unusual patterns</strong> like the fact that only 2 of 16 programs (Army-Baylor and UTRGV) still require the GRE, and several schools don't require an essay, letters, or shadowing. Four rows had OCR token-count anomalies or unclear values (Texas Tech HSC, Army-Baylor, USA Health Sciences, UTRGV) and were interpolated — noted on each affected row. <strong>Confirm each program's published requirements before applying.</strong>
            </div>
          </div>
        </div>

        {/* ── Step 1: Choose schools ─────────────────────────────────── */}
        <section>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.orange }}>Step 1</div>
              <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Choose your target programs</h2>
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
                      <div style={{ fontSize: 11, marginTop: 4, opacity: on ? 0.85 : 0.7 }}>{school.city}</div>
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
              Select at least one program to compare requirements.
            </p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Programs compared"           value={stats.count} />
              <Stat label="Average min GPA"             value={stats.avgGpa} />
              <Stat label="Require the GRE"             value={stats.gre}     sub={`of ${stats.count}`} />
              <Stat label="Publish shadowing hours"     value={stats.shadow}  sub={`of ${stats.count}`} />
            </section>

            {/* ── Step 2: Eligibility ─────────────────────────────── */}
            <section>
              <div className="mb-4">
                <div className="eyebrow" style={{ color: BRAND.orange }}>Step 2</div>
                <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Compare admission requirements</h2>
              </div>

              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 720, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: BRAND.grayInk }}>
                        <th className="text-left px-4 py-3" style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: 200 }}>
                          Program
                        </th>
                        {['Min GPA', 'GRE', 'Essay', 'Letters', 'Shadowing', 'Interview', "Bachelor's"].map(h => (
                          <th key={h} className="px-2 py-3 text-center" style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleSchools.map((s, idx) => (
                        <tr key={s.id} style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: s.id === 'utrgv' ? BRAND.orangePale : (idx % 2 ? 'white' : '#FCFCFC') }}>
                          <td className="px-4 py-3">
                            <div style={{ fontWeight: 700, fontSize: 13, color: BRAND.grayInk, lineHeight: 1.25 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: BRAND.gray, marginTop: 2 }}>{s.city}</div>
                          </td>
                          <td className="px-2 py-3 text-center">
                            <span className="font-display num-rail" style={{ fontSize: 17, color: BRAND.orange }}>{s.elig.gpa.toFixed(1)}</span>
                          </td>
                          <td className="px-2 py-3 text-center">{s.elig.gre   ? <Yes /> : <Dash />}</td>
                          <td className="px-2 py-3 text-center">{s.elig.essay ? <Yes /> : <Dash />}</td>
                          <td className="px-2 py-3 text-center"><LettersCell value={s.elig.letters} /></td>
                          <td className="px-2 py-3 text-center"><ShadowCell value={s.elig.shadow} /></td>
                          <td className="px-2 py-3 text-center">{s.elig.interview === 'req' ? <Yes /> : <Dash />}</td>
                          <td className="px-2 py-3 text-center">{s.elig.bachelor ? <Yes /> : <Dash />}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── Step 3: Courses ────────────────────────────────── */}
            <section>
              <div className="mb-4">
                <div className="eyebrow" style={{ color: BRAND.orange }}>Step 3</div>
                <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Compare course prerequisites</h2>
              </div>

              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 760, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: BRAND.grayInk }}>
                        <th rowSpan={2} className="text-left px-4 py-2" style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: 200, verticalAlign: 'bottom' }}>
                          Program
                        </th>
                        {COURSE_CATEGORIES.map(cat => (
                          <th key={cat.name} colSpan={cat.courses.length} className="px-2 py-1.5 text-center"
                            style={{ color: BRAND.orangePale, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', borderLeft: `1px solid #3A3A40` }}>
                            {cat.name}
                          </th>
                        ))}
                      </tr>
                      <tr style={{ backgroundColor: '#2A2A30' }}>
                        {COURSE_CATEGORIES.flatMap(cat => cat.courses).map(course => (
                          <th key={course.code} className="px-1 py-2 text-center" style={{ color: 'white', fontSize: 9, fontWeight: 700, lineHeight: 1.2 }}>
                            {course.code.split(' ').map((part, i) => <div key={i}>{part}</div>)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleSchools.map((s, idx) => (
                        <tr key={s.id} style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: s.id === 'utrgv' ? BRAND.orangePale : (idx % 2 ? 'white' : '#FCFCFC') }}>
                          <td className="px-4 py-2.5">
                            <div style={{ fontWeight: 700, fontSize: 12.5, color: BRAND.grayInk, lineHeight: 1.2 }}>{s.name}</div>
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
                    UTRGV row highlighted · HRPT 2303 = Medical Terminology
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

        {/* ── Step 5: OTCAS Phase Roadmap ────────────────────────────── */}
        <section>
          <div className="mb-4">
            <div className="eyebrow" style={{ color: BRAND.orange }}>Step 5</div>
            <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>OTCAS phase-by-phase roadmap</h2>
            <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 6, maxWidth: 720, lineHeight: 1.5 }}>
              Work backward from your specific program's deadline. Most OT programs review on a rolling basis — <strong style={{ color: BRAND.grayInk }}>submitting at the 6–8 week mark</strong>, not the deadline, gives you the best chance at early review and interview consideration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {OTCAS_PHASES.map((phase, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: phase.highlight ? `1.5px solid ${BRAND.orange}` : `1px solid ${BRAND.grayLine}` }}>
                <div className="px-4 py-3" style={{ backgroundColor: BRAND.orange, color: 'white' }}>
                  <div className="font-display" style={{ fontSize: 18, lineHeight: 1.1 }}>{phase.timing}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3, opacity: 0.85 }}>
                    {phase.tier}
                  </div>
                </div>
                <div className="p-4">
                  <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.grayInk, marginBottom: 8 }}>{phase.title}</div>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, i) => (
                      <li key={i} style={{ fontSize: 12, color: BRAND.grayInk, lineHeight: 1.45, display: 'flex', gap: 6 }}>
                        <span style={{ color: BRAND.orange, fontWeight: 700 }}>→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How OTCAS Works ─────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <h2 className="font-display" style={{ fontSize: 22 }}>How OTCAS works</h2>
            <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 4, maxWidth: 640, lineHeight: 1.5 }}>
              OTCAS is the centralized application service for occupational therapy programs. Deadlines vary by program; most review on a rolling basis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {OTCAS_STEPS.map(step => (
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
              <h2 className="font-display" style={{ fontSize: 22, lineHeight: 1 }}>Educational pathway to M.O.T. / O.T.D.</h2>
              <p style={{ fontSize: 12, color: BRAND.gray, marginTop: 4 }}>From prerequisites through NBCOT certification and practice.</p>
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
                Schedule a meeting with the UTRGV Office of Pre-Professional Development to build your individualized pre-OT plan.
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
          Requirements are compiled from each program's published information for planning purposes. Always verify with the official program websites and OTCAS (otcas.liaisoncas.com) before applying.
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
