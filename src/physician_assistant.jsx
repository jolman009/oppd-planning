import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, ExternalLink, Info, AlertTriangle, Stethoscope,
  FileText, Send, Building2, Award, ArrowLeft, Search,
  X as XIcon, Calendar
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
// COURSE CATEGORIES (17 prerequisites)
// ─────────────────────────────────────────────────────────────────────────────
const COURSE_CATEGORIES = [
  {
    name: 'Life Sciences',
    courses: [
      { code: 'BIOL 1406', title: 'General Biology I' },
      { code: 'BIOL 1407', title: 'General Biology II' },
      { code: 'BIOL 1401', title: 'Anatomy & Physiology I' },
      { code: 'BIOL 1402', title: 'Anatomy & Physiology II' },
      { code: 'BIOL 3401', title: 'Genetics' },
      { code: 'BIOL 3313', title: 'Microbiology' },
    ],
  },
  {
    name: 'Chemistry · Statistics · Physics',
    courses: [
      { code: 'CHEM 3303', title: 'Biochemistry' },
      { code: 'CHEM 1311', title: 'General Chemistry I' },
      { code: 'CHEM 1312', title: 'General Chemistry II' },
      { code: 'CHEM 2323', title: 'Organic Chemistry I' },
      { code: 'CHEM 2325', title: 'Organic Chemistry II' },
      { code: 'PHYS 1401', title: 'General Physics I' },
      { code: 'MATH 1342', title: 'Statistics' },
    ],
  },
  {
    name: 'Behavioral & Social Sciences',
    courses: [
      { code: 'PSYC 2301', title: 'General Psychology' },
      { code: 'SOCI 1301', title: 'Introduction to Sociology' },
    ],
  },
  {
    name: 'Communication',
    courses: [
      { code: 'HRPT 2302', title: 'Medical Terminology' },
      { code: 'ENGL 1301', title: 'Composition I' },
    ],
  },
];
const ALL_COURSE_CODES = COURSE_CATEGORIES.flatMap(c => c.courses.map(x => x.code));

// All courses default to required. Override per source PDF.
const allCourses = (overrides = {}) => {
  const base = {};
  ALL_COURSE_CODES.forEach(code => { base[code] = 'req'; });
  return { ...base, ...overrides };
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHOOLS (16 Texas PA programs)
// Per-school course overrides derived from PA_requirements.pdf
// ─────────────────────────────────────────────────────────────────────────────
const SCHOOLS = [
  { id: 'austin',     abbrev: 'AC',    name: 'Austin College',                       city: 'Sherman',
    elig: { gpa: 3.0, gre: false, essay: true,  letters: 'YES', shadow: '500+', interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'CHEM 3303': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'baylorcom',  abbrev: 'BCM',   name: 'Baylor College of Medicine',           city: 'Houston',
    elig: { gpa: 3.2, gre: false, essay: false, letters: 3,     shadow: null,   interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'baylorwaco', abbrev: 'BU',    name: 'Baylor University',                    city: 'Waco',
    elig: { gpa: 3.0, gre: true,  essay: true,  letters: 3,     shadow: '500+', interview: 'req',  bachelor: true },
    courses: allCourses({ 'CHEM 3303': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'franklin',   abbrev: 'FPU',   name: 'Franklin Pierce University',           city: 'Texas (hybrid)',
    elig: { gpa: 3.0, gre: true,  essay: true,  letters: 'YES', shadow: null,   interview: 'req',  bachelor: true },
    courses: allCourses({ 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none' }) },
  { id: 'hardin',     abbrev: 'HSU',   name: 'Hardin-Simmons University',            city: 'Abilene',
    elig: { gpa: 3.0, gre: false, essay: true,  letters: 3,     shadow: null,   interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'CHEM 3303': 'none', 'CHEM 1311': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none' }) },
  { id: 'southu',     abbrev: 'SU',    name: 'South University, Austin',             city: 'Austin',
    elig: { gpa: 3.0, gre: true,  essay: true,  letters: 3,     shadow: '500+', interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'CHEM 3303': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'tarleton',   abbrev: 'TSU',   name: 'Tarleton State University',            city: 'Stephenville',
    elig: { gpa: 3.0, gre: true,  essay: false, letters: 2,     shadow: '500+', interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'CHEM 3303': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none', 'ENGL 1301': 'none' }) },
  { id: 'tcu',        abbrev: 'TCU',   name: 'Texas Christian University',           city: 'Fort Worth',
    elig: { gpa: 3.0, gre: true,  essay: false, letters: 3,     shadow: null,   interview: 'req',  bachelor: true },
    courses: allCourses() },
  { id: 'ttuhsc',     abbrev: 'TTUHSC', name: 'Texas Tech University HSC',            city: 'Midland',
    elig: { gpa: 3.0, gre: true,  essay: true,  letters: 3,     shadow: null,   interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'CHEM 3303': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'utsw',       abbrev: 'UTSW',  name: 'UT Southwestern Medical Center',       city: 'Dallas',
    elig: { gpa: 3.0, gre: true,  essay: false, letters: 2,     shadow: null,   interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'umhb',       abbrev: 'UMHB',  name: 'University of Mary Hardin-Baylor',     city: 'Belton',
    elig: { gpa: 3.0, gre: false, essay: false, letters: 3,     shadow: '100+', interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'CHEM 3303': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none', 'ENGL 1301': 'none' }) },
  { id: 'unthsc',     abbrev: 'UNTHSC', name: 'UNT Health Science Center',            city: 'Fort Worth',
    elig: { gpa: 3.0, gre: true,  essay: true,  letters: 1,     shadow: null,   interview: 'opt',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'CHEM 3303': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'uthsa',      abbrev: 'UTHSA', name: 'UT Health San Antonio',                city: 'San Antonio',
    elig: { gpa: 3.0, gre: true,  essay: false, letters: 2,     shadow: null,   interview: 'opt',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'utmb',       abbrev: 'UTMB',  name: 'UT Medical Branch',                    city: 'Galveston',
    elig: { gpa: 3.0, gre: true,  essay: false, letters: 3,     shadow: null,   interview: 'opt',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'CHEM 3303': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none' }) },
  { id: 'utrgv',      abbrev: 'UTRGV', name: 'UT Rio Grande Valley',                 city: 'Edinburg',
    elig: { gpa: 3.0, gre: true,  essay: true,  letters: 3,     shadow: null,   interview: 'none', bachelor: true },
    courses: allCourses({ 'CHEM 2325': 'none' }) },
  { id: 'westcoast',  abbrev: 'WCU',   name: 'West Coast University \u2013 Texas',   city: 'Richardson',
    elig: { gpa: 3.0, gre: true,  essay: true,  letters: 3,     shadow: '500+', interview: 'req',  bachelor: true },
    courses: allCourses({ 'BIOL 1406': 'none', 'BIOL 1407': 'none', 'BIOL 3401': 'none', 'BIOL 3313': 'none', 'CHEM 1312': 'none', 'CHEM 2323': 'none', 'CHEM 2325': 'none', 'PHYS 1401': 'none', 'MATH 1342': 'none', 'SOCI 1301': 'none', 'HRPT 2302': 'none', 'ENGL 1301': 'none' }) },
];

const TIMELINE = [
  {
    year: 1, label: 'First Year', focus: 'Explore and establish.',
    items: [
      'Explore the PA profession and shadow a certified PA (PA-C).',
      'Meet with a pre-PA advisor to map prerequisites and your degree plan.',
      'Build study skills and maintain a competitive GPA \u2014 3.0 is a common minimum, but admitted classes run higher.',
      'Join pre-PA or pre-health student organizations.',
      'Begin accumulating patient care and healthcare experience hours early.',
    ],
  },
  {
    year: 2, label: 'Second Year', focus: 'Build hours and research.',
    items: [
      'Maintain a competitive GPA.',
      'Keep building patient care experience (PCE) hours \u2014 many programs expect hundreds to thousands.',
      'Build relationships with faculty and PAs for letters of recommendation.',
      'Research PA programs and their specific prerequisites, hour requirements, and GRE policies.',
      'Confirm whether each target program requires the GRE.',
    ],
  },
  {
    year: 3, label: 'Third Year', focus: 'Prepare and apply.',
    items: [
      'Research CASPA and review each program\u2019s application requirements.',
      'Register for and take the GRE if your target programs require it.',
      'Continue building patient care and shadowing hours.',
      'Begin formally requesting letters of recommendation.',
      'Create a budget for application and interview costs.',
    ],
  },
  {
    year: 4, label: 'Fourth Year', focus: 'Submit and finalize.',
    items: [
      'Complete prerequisite courses and degree requirements.',
      'Draft your CASPA personal statement and request official transcripts.',
      'Submit your CASPA application and any program-specific supplemental applications.',
      'Prepare for and attend interviews.',
      'Review decisions, accept an offer promptly, and apply for financial aid.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CASPA APPLICATION TIMELINE (from PA_Application_Timeline_2026_Redesign.pdf)
// ─────────────────────────────────────────────────────────────────────────────
const CASPA_TIMELINE = [
  { date: 'Apr 30',  tag: 'OPENS',          label: 'CASPA Opens',        detail: 'Create your account, enter coursework, and request transcripts and letters right away. CASPA for the 2026\u20132027 cycle opens on April 30, 2026.' },
  { date: 'May',     tag: 'SUBMIT EARLY',   label: 'Submit Early',       detail: 'Finish your CASPA application as soon as possible. UTRGV uses CASPA and reviews applications on a rolling basis.' },
  { date: 'June',    tag: 'CASPER',         label: 'Complete CASPer',    detail: 'Register for CASPer using your CASPA ID and select an approved UTRGV test date. Only pre-arranged test dates are available.' },
  { date: 'July',    tag: 'REVIEW',         label: 'Check Missing Items', detail: 'Follow up on transcripts, recommendation letters, and any incomplete sections. UTRGV requires all materials to be complete before the deadline.' },
  { date: 'Aug',     tag: 'FINAL REVIEW',   label: 'Final Review',       detail: 'Double-check your application, prerequisites, and email for updates. Prerequisites completed after the deadline will not be considered.' },
  { date: 'Sep 1',   tag: 'FINAL DEADLINE', label: 'Final Deadline',     detail: 'All required items must be submitted by this date, including CASPA, CASPer, transcripts, letters, and prerequisites.' },
];

const CASPA_STEPS = [
  {
    num: 1, title: 'You (Applicant)', Icon: Send,
    body: 'Complete prerequisites and patient care hours, submit the CASPA application, request letters of recommendation, send transcripts, and submit GRE scores if required.',
  },
  {
    num: 2, title: 'CASPA', Icon: FileText,
    body: 'Verifies transcripts, calculates standardized GPAs, processes the application, and delivers your verified file to designated PA programs.',
  },
  {
    num: 3, title: 'PA Programs', Icon: Building2,
    body: 'Review verified applications on a rolling basis, conduct interviews, and make admissions decisions independently.',
  },
];

const PATHWAY = [
  { label: "Bachelor's degree", body: 'Required by PA programs (they award a master\u2019s). Complete prerequisite coursework and accumulate patient care experience hours alongside your degree.' },
  { label: 'PA school',         body: 'About 24\u201327 months \u2014 a didactic phase followed by clinical rotations. Graduates earn a master\u2019s (MPAS, MMS, or MSPAS).' },
  { label: 'Certification & licensure', body: 'Pass the PANCE (Physician Assistant National Certifying Exam) to become a certified PA-C, then obtain state licensure.' },
  { label: 'Practice & specialization',  body: 'PAs practice across every specialty. A Certificate of Added Qualifications (CAQ) is optional in areas like emergency medicine and surgery.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// CELL RENDERERS
// ─────────────────────────────────────────────────────────────────────────────
const Yes = ({ size = 22 }) => (
  <div role="img" aria-label="Required" className="flex items-center justify-center rounded-full mx-auto"
    style={{ width: size, height: size, backgroundColor: BRAND.orange }}>
    <Check size={Math.round(size * 0.55)} color="white" strokeWidth={3} />
  </div>
);
const Dash = ({ label = 'Not required' }) => (
  <div role="img" aria-label={label} className="text-center" style={{ color: '#C8C8CD', fontSize: 17, lineHeight: 1 }}>&mdash;</div>
);
const OptBadge = () => (
  <span style={{
    display: 'inline-block', padding: '2px 7px', borderRadius: 4,
    backgroundColor: BRAND.grayWash, color: BRAND.gray, border: `1px solid ${BRAND.grayLine}`,
    fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
  }}>OPT</span>
);
const InterviewCell = ({ value }) => {
  if (value === 'req')  return <Yes />;
  if (value === 'opt')  return <OptBadge />;
  return <Dash />;
};
const LettersCell = ({ value }) => {
  if (value === 'NO')  return <Dash />;
  if (value === 'YES') return <Yes />;
  return <span className="font-display num-rail" style={{ fontSize: 17, color: BRAND.orangeDark, lineHeight: 1 }}>{value}</span>;
};
const ShadowCell = ({ value }) => {
  if (!value) return <Dash label="Not specified" />;
  return <span style={{ fontSize: 12, fontWeight: 700, color: BRAND.grayInk }}>{value}</span>;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PAPlanningTool() {
  const [selected, setSelected] = useState(SCHOOLS.map(s => s.id));
  const [activeYear, setActiveYear] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchools = useMemo(() => {
    if (!searchQuery.trim()) return SCHOOLS;
    const q = searchQuery.toLowerCase();
    return SCHOOLS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.abbrev.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const visibleSchools = useMemo(() => SCHOOLS.filter(s => selected.includes(s.id)), [selected]);

  const stats = useMemo(() => {
    const rows = visibleSchools;
    return {
      count:     rows.length,
      gre:       rows.filter(s => s.elig.gre).length,
      interview: rows.filter(s => s.elig.interview === 'req').length,
      shadow:    rows.filter(s => s.elig.shadow).length,
    };
  }, [visibleSchools]);

  const toggleSchool = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
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
          <Link to="/" className="inline-flex items-center gap-1.5 mb-4" style={{ fontSize: 13, color: BRAND.gray, fontWeight: 600, textDecoration: 'none' }}>
            <ArrowLeft size={14} />
            All Planning Tools
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.gray }}>UTRGV · Pre-Professional Development</div>
              <h1 className="font-display" style={{ fontSize: 40, color: BRAND.grayInk, marginTop: 6, lineHeight: 1.05 }}>
                Physician Assistant <span style={{ color: BRAND.orange }}>Planning Tool</span>
              </h1>
              <p style={{ color: BRAND.gray, marginTop: 8, fontSize: 15, maxWidth: 640, lineHeight: 1.5 }}>
                Compare admission requirements and prerequisites across the sixteen Texas PA programs, and map your path through the CASPA application cycle.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ backgroundColor: BRAND.orangePale, color: BRAND.orangeDark }}>
              <Stethoscope size={18} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em' }}>PA</span>
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
              Course prerequisites are mapped from the UTRGV OPPD requirements spreadsheet. GPA minimums and bachelor&apos;s-degree requirements are confirmed. <strong>Confirm each program&apos;s published requirements before relying on this matrix.</strong>
            </div>
          </div>
        </div>

        {/* ── Step 1: Choose schools (searchable checkbox list) ────── */}
        <section>
          <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.orange }}>Step 1</div>
              <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Choose your target programs</h2>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 13, color: BRAND.gray, fontWeight: 600 }}>
                {selected.length} of {SCHOOLS.length} selected
              </span>
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
          </div>

          {/* Search input */}
          <div className="relative mb-3">
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: BRAND.gray }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by school name or city\u2026"
              className="w-full py-2.5 pl-9 pr-9 rounded-lg transition-colors"
              style={{
                fontSize: 14,
                color: BRAND.grayInk,
                backgroundColor: 'white',
                border: `1.5px solid ${BRAND.grayLine}`,
                outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.borderColor = BRAND.orange}
              onBlur={e => e.currentTarget.style.borderColor = BRAND.grayLine}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                style={{ color: BRAND.gray }}
              >
                <XIcon size={14} />
              </button>
            )}
          </div>

          {/* Checkbox list */}
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1.5px solid ${BRAND.grayLine}` }}>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {filteredSchools.length === 0 ? (
                <div className="text-center py-8">
                  <p style={{ fontSize: 13, color: BRAND.gray }}>No programs match &ldquo;{searchQuery}&rdquo;</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {filteredSchools.map(school => {
                    const on = selected.includes(school.id);
                    return (
                      <label
                        key={school.id}
                        className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer transition-colors"
                        style={{
                          backgroundColor: on ? BRAND.orangePale : 'transparent',
                          borderBottom: `1px solid ${BRAND.grayLine}`,
                          borderRight: `1px solid ${BRAND.grayLine}`,
                        }}
                        onMouseEnter={e => { if (!on) e.currentTarget.style.backgroundColor = BRAND.grayWash; }}
                        onMouseLeave={e => { if (!on) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleSchool(school.id)}
                          className="sr-only"
                        />
                        <div style={{
                          width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                          border: `1.5px solid ${on ? BRAND.orange : '#D4D4D8'}`,
                          backgroundColor: on ? BRAND.orange : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {on && <Check size={10} color="white" strokeWidth={3} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.grayInk, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {school.name}
                          </div>
                          <div style={{ fontSize: 11, color: BRAND.gray, marginTop: 1 }}>{school.city}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
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
            {/* Stat strip */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Programs compared" value={stats.count} />
              <Stat label="Require the GRE"   value={stats.gre}       sub={`of ${stats.count}`} />
              <Stat label="Require interview" value={stats.interview} sub={`of ${stats.count}`} />
              <Stat label="Publish shadowing hours" value={stats.shadow} sub={`of ${stats.count}`} />
            </section>

            {/* ── Step 2: Eligibility ─────────────────────────────── */}
            <section>
              <div className="mb-4">
                <div className="eyebrow" style={{ color: BRAND.orange }}>Step 2</div>
                <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Compare admission requirements</h2>
              </div>

              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 640, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: BRAND.grayInk }}>
                        <th className="text-left px-4 py-3" style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: 190 }}>
                          Program
                        </th>
                        {['Min GPA', 'GRE', 'Essay', 'Letters', 'Shadowing', 'Interview', "Bachelor's"].map(h => (
                          <th key={h} className="px-2 py-3 text-center" style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleSchools.map((s, idx) => (
                        <tr key={s.id} style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: idx % 2 ? 'white' : '#FCFCFC' }}>
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
                          <td className="px-2 py-3 text-center"><InterviewCell value={s.elig.interview} /></td>
                          <td className="px-2 py-3 text-center">{s.elig.bachelor ? <Yes /> : <Dash />}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 flex flex-wrap gap-x-5 gap-y-2 items-center" style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: BRAND.grayWash }}>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600 }}>
                    <Yes size={18} /> Required
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600 }}>
                    <OptBadge /> Optional
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600 }}>
                    <span style={{ color: '#C8C8CD', fontSize: 16, paddingInline: 6 }}>&mdash;</span> Not required / not specified
                  </div>
                </div>
              </div>
            </section>

            {/* ── Step 3: Course prerequisites (sticky first column) ── */}
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
                        <th rowSpan={2} className="text-left px-4 py-2" style={{
                          color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
                          textTransform: 'uppercase', minWidth: 190, verticalAlign: 'bottom',
                          position: 'sticky', left: 0, zIndex: 2, backgroundColor: BRAND.grayInk,
                        }}>
                          Program
                        </th>
                        {COURSE_CATEGORIES.map(cat => (
                          <th key={cat.name} colSpan={cat.courses.length} className="px-2 py-1.5 text-center"
                            style={{ color: BRAND.orangePale, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', borderLeft: '1px solid #3A3A40' }}>
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
                        <tr key={s.id} style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: idx % 2 ? 'white' : '#FCFCFC' }}>
                          <td className="px-4 py-2.5" style={{
                            position: 'sticky', left: 0, zIndex: 1,
                            backgroundColor: idx % 2 ? 'white' : '#FCFCFC',
                            boxShadow: '2px 0 4px rgba(0,0,0,0.06)',
                          }}>
                            <div style={{ fontWeight: 700, fontSize: 12.5, color: BRAND.grayInk, lineHeight: 1.2 }}>{s.name}</div>
                            <div style={{ fontSize: 10.5, color: BRAND.gray, marginTop: 1 }}>{s.city}</div>
                          </td>
                          {COURSE_CATEGORIES.flatMap(cat => cat.courses).map(course => (
                            <td key={course.code} className="px-1 py-2.5 text-center">
                              {s.courses[course.code] === 'req'
                                ? <Yes size={18} />
                                : <Dash />}
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
                    <span style={{ color: '#C8C8CD', fontSize: 16, paddingInline: 6 }}>&mdash;</span> Not required
                  </div>
                  <div style={{ fontSize: 11, color: BRAND.gray, marginLeft: 'auto' }}>
                    HRPT 2302 is Medical Terminology &middot; scroll to see all 17 courses
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

        {/* ── Step 5: CASPA Application Timeline ──────────────────── */}
        <section>
          <div className="mb-4">
            <div className="eyebrow" style={{ color: BRAND.orange }}>Step 5</div>
            <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>CASPA application timeline</h2>
            <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 4, maxWidth: 640, lineHeight: 1.5 }}>
              Key dates for the 2026&ndash;2027 CASPA cycle. UTRGV reviews applications on a rolling basis &mdash; submitting early significantly strengthens your candidacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CASPA_TIMELINE.map(d => (
              <div
                key={d.date}
                className="p-4 rounded-lg flex gap-4"
                style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}
              >
                <div
                  className="flex flex-col items-center justify-center rounded flex-shrink-0"
                  style={{ width: 64, height: 64, backgroundColor: BRAND.orange, color: 'white' }}
                >
                  <Calendar size={14} strokeWidth={2.5} />
                  <div className="font-display num-rail" style={{ fontSize: 14, marginTop: 4, lineHeight: 1, textAlign: 'center' }}>{d.date}</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: BRAND.grayInk, lineHeight: 1.3 }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: 12, color: BRAND.gray, marginTop: 4, lineHeight: 1.45 }}>
                    {d.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rolling review banner */}
          <div className="mt-3 p-4 rounded-lg flex gap-3" style={{ backgroundColor: BRAND.orangePale, border: `1px solid ${BRAND.orangeDark}20` }}>
            <Info size={16} style={{ color: BRAND.orangeDark, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 13, color: BRAND.orangeDark, lineHeight: 1.5 }}>
              <strong>Apply early, complete CASPer, and finish everything by September 1.</strong> Rolling review means every week counts &mdash; a complete application submitted in May is reviewed far ahead of one submitted in August.
            </p>
          </div>
        </section>

        {/* ── How CASPA Works ────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <h2 className="font-display" style={{ fontSize: 22 }}>How CASPA works</h2>
            <p style={{ fontSize: 13, color: BRAND.gray, marginTop: 4, maxWidth: 640, lineHeight: 1.5 }}>
              CASPA is the centralized application service for PA programs. It typically opens in late April; most programs review on a rolling basis, so applying early matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CASPA_STEPS.map(step => (
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
              <h2 className="font-display" style={{ fontSize: 22, lineHeight: 1 }}>Educational pathway to PA</h2>
              <p style={{ fontSize: 12, color: BRAND.gray, marginTop: 4 }}>From prerequisites through certification and practice.</p>
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
                Schedule a meeting with the UTRGV Office of Pre-Professional Development to build your individualized pre-PA plan.
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
          Requirements are compiled from each program&apos;s published information for planning purposes. Always verify with the official program websites and CASPA (caspa.liaisoncas.com) before applying.
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
