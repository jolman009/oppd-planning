import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, GraduationCap, Calendar, Info, ExternalLink, ArrowLeft } from 'lucide-react';

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
// DATA — edit course titles and required/alternative flags to match each
// school's current catalog. Mapping reflects the spreadsheet provided
// (yellow = required, pink = alternative/conditional).
// ─────────────────────────────────────────────────────────────────────────────
const SCHOOLS = [
  { id: 'uth',  name: 'UT Health Houston',     short: 'Houston',     city: 'Houston',     bachelor: false },
  { id: 'utsa', name: 'UT Health San Antonio', short: 'San Antonio', city: 'San Antonio', bachelor: false },
  { id: 'tamu', name: 'Texas A&M',             short: 'A&M',         city: 'Dallas',      bachelor: true, note: 'Bachelor\u2019s degree required (verify)' },
  { id: 'ttu',  name: 'Texas Tech',            short: 'Tech',        city: 'El Paso',     bachelor: false },
];

// status values: 'required' | 'alternative' | 'none'
const CATEGORIES = [
  {
    name: 'Life Sciences',
    courses: [
      { code: 'BIOL 1406', title: 'General Biology I',         uth: 'required', utsa: 'required', tamu: 'required',    ttu: 'required' },
      { code: 'BIOL 3401', title: 'Genetics',                  uth: 'required', utsa: 'required', tamu: 'required',    ttu: 'required' },
      { code: 'BIOL 3313', title: 'Microbiology',              uth: 'required', utsa: 'required', tamu: 'alternative', ttu: 'required' },
      { code: 'BIOL 3315', title: 'Cell Biology',              uth: 'required', utsa: 'required', tamu: 'alternative', ttu: 'required' },
      { code: 'BIOL 2401', title: 'Anatomy & Physiology I',    uth: 'required', utsa: 'required', tamu: 'required',    ttu: 'alternative' },
      { code: 'BIOL 2402', title: 'Anatomy & Physiology II',   uth: 'required', utsa: 'required', tamu: 'required',    ttu: 'alternative' },
    ],
  },
  {
    name: 'Chemistry · Statistics · Physics',
    courses: [
      { code: 'CHEM 1311', title: 'General Chemistry I',       uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 1111', title: 'Gen Chem I Lab',            uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 1312', title: 'General Chemistry II',      uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 1112', title: 'Gen Chem II Lab',           uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 2323', title: 'Organic Chemistry I',       uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 2123', title: 'Org Chem I Lab',            uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 2325', title: 'Organic Chemistry II',      uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 2125', title: 'Org Chem II Lab',           uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'CHEM 3303', title: 'Biochemistry',              uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'STAT 3301', title: 'Statistics',                uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'PHYS 1401', title: 'General Physics I',         uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'PHYS 1402', title: 'General Physics II',        uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
    ],
  },
  {
    name: 'Non-Sciences',
    courses: [
      { code: 'ENGL 1301', title: 'Composition I',  uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
      { code: 'ENGL 1302', title: 'Composition II', uth: 'required', utsa: 'required', tamu: 'required', ttu: 'required' },
    ],
  },
];

const TIMELINE = [
  {
    year: 1, label: 'First Year',
    focus: 'Explore the path and build a foundation.',
    items: [
      'Decide whether dental school is the right fit.',
      'Meet with an advisor to map prerequisites and degree requirements.',
      'Build strong study habits and maintain a competitive GPA.',
      'Join pre-dental or pre-health student organizations.',
      'Start volunteering, working in health care, or shadowing a DDS or DMD.',
    ],
  },
  {
    year: 2, label: 'Second Year',
    focus: 'Deepen experience and prepare for the DAT.',
    items: [
      'Maintain a competitive GPA.',
      'Build relationships with faculty for letters of recommendation.',
      'Strengthen your r\u00e9sum\u00e9 through work, volunteering, clinical exposure, and shadowing.',
      'Begin planning and preparing for the DAT.',
      'Research dental schools, entrance requirements, and costs.',
    ],
  },
  {
    year: 3, label: 'Third Year',
    focus: 'Finish prerequisites and sit for the DAT.',
    items: [
      'Complete biology and chemistry prerequisite courses.',
      'Maintain a competitive GPA and continue building your r\u00e9sum\u00e9.',
      'Review each school\u2019s application and letter requirements.',
      'Visit dental schools or attend admissions visits.',
      'Register for and take the DAT during third year or the summer after.',
    ],
  },
  {
    year: 4, label: 'Fourth Year',
    focus: 'Apply, interview, decide.',
    items: [
      'Prepare and submit your application through ADEA AADSAS in the summer before or early fall of fourth year.',
      'Complete advanced science coursework and finish your degree.',
      'Request letters of recommendation and official transcripts.',
      'Prepare for and attend admissions interviews.',
      'Review decisions, accept an offer promptly, and apply for financial aid and scholarships.',
    ],
  },
];

const DEADLINES = [
  { date: 'May 1',  label: 'Application available',          detail: '8:00 a.m. CST' },
  { date: 'May 15', label: 'Submission opens',               detail: '8:00 a.m. CST' },
  { date: 'Oct 1',  label: 'General application deadline',   detail: 'All sections due by 11:59 p.m. CST · payment required' },
  { date: 'Oct 15', label: 'Letters of evaluation due',      detail: '' },
  { date: 'Dec 15', label: 'Schools begin extending offers', detail: '' },
  { date: 'Apr 15', label: 'Final offer deadline',           detail: '' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function DentalPlanningTool() {
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
        <div
          role="img"
          aria-label={`Required by ${schoolShort}`}
          className="flex items-center justify-center w-7 h-7 rounded-full mx-auto"
          style={{ backgroundColor: BRAND.orange }}
        >
          <Check size={16} color="white" strokeWidth={3} />
        </div>
      );
    }
    if (status === 'alternative') {
      return (
        <div
          role="img"
          aria-label={`Alternative or conditional at ${schoolShort}`}
          className="flex items-center justify-center w-7 h-7 rounded-full mx-auto"
          style={{ border: `2px solid ${BRAND.orange}`, backgroundColor: BRAND.orangePale }}
        >
          <span style={{ color: BRAND.orange, fontWeight: 700, fontSize: 12, lineHeight: 1 }}>~</span>
        </div>
      );
    }
    return (
      <div
        role="img"
        aria-label={`Not required at ${schoolShort}`}
        className="w-7 h-7 mx-auto flex items-center justify-center"
      >
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
                Dental School <span style={{ color: BRAND.orange }}>Planning Tool</span>
              </h1>
              <p style={{ color: BRAND.gray, marginTop: 8, fontSize: 15, maxWidth: 560, lineHeight: 1.5 }}>
                Compare prerequisite coursework across Texas dental schools and map your timeline to a DDS or DMD.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ backgroundColor: BRAND.orangePale, color: BRAND.orangeDark }}>
              <GraduationCap size={18} />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.03em' }}>D.D.S. / D.M.D.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* ── School filter ─────────────────────────────────────────────── */}
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
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Select all
              </button>
              <button
                onClick={() => setSelected([])}
                className="px-3 py-1.5 rounded transition-colors"
                style={{ fontSize: 13, color: BRAND.gray, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = BRAND.grayWash}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div style={{ minWidth: 0 }}>
                      <div className="font-display" style={{ fontSize: 18, lineHeight: 1.15 }}>{school.name}</div>
                      <div style={{ fontSize: 12, marginTop: 6, opacity: on ? 0.85 : 0.7, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>{school.city}</span>
                      </div>
                    </div>
                    <div
                      style={{
                        width: 20, height: 20, borderRadius: 4,
                        border: `1.5px solid ${on ? 'white' : '#D4D4D8'}`,
                        backgroundColor: on ? 'white' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {on && <Check size={14} color={BRAND.orange} strokeWidth={3} />}
                    </div>
                  </div>
                  {school.bachelor && (
                    <div
                      className="mt-3 inline-block px-2 py-0.5 rounded"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        backgroundColor: on ? 'rgba(255,255,255,0.18)' : BRAND.orangePale,
                        color: on ? 'white' : BRAND.orangeDark,
                      }}
                    >
                      Bachelor’s required
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Comparison ─────────────────────────────────────────────────── */}
        {visibleSchools.length === 0 ? (
          <div
            className="text-center py-14 rounded-lg"
            style={{ backgroundColor: 'white', border: `1px dashed ${BRAND.grayLine}` }}
          >
            <Info size={28} style={{ color: BRAND.gray, margin: '0 auto' }} />
            <p style={{ color: BRAND.gray, marginTop: 10, fontSize: 14 }}>
              Select at least one school to see its prerequisite coursework.
            </p>
          </div>
        ) : (
          <>
            {/* Stat strip */}
            <section className="grid grid-cols-3 gap-3">
              <Stat label="Schools compared"        value={visibleSchools.length} />
              <Stat label="Common required courses" value={commonCourses.length} />
              <Stat label="Tracked prerequisites"   value={allCourses.length} />
            </section>

            {/* Matrix */}
            <section>
              <div className="mb-4">
                <div className="eyebrow" style={{ color: BRAND.orange }}>Step 2</div>
                <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Compare prerequisites</h2>
              </div>

              <div
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: 480, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: BRAND.grayInk }}>
                        <th
                          className="text-left px-4 py-3"
                          style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', minWidth: 200 }}
                        >
                          Course
                        </th>
                        {visibleSchools.map(s => (
                          <th
                            key={s.id}
                            className="px-3 py-3 text-center"
                            style={{ color: 'white', fontSize: 12, fontWeight: 700, letterSpacing: '0.03em' }}
                          >
                            {s.short}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CATEGORIES.map(cat => (
                        <React.Fragment key={cat.name}>
                          <tr>
                            <td
                              colSpan={visibleSchools.length + 1}
                              className="px-4 py-2"
                              style={{
                                backgroundColor: BRAND.orangePale,
                                color: BRAND.orangeDark,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                              }}
                            >
                              {cat.name}
                            </td>
                          </tr>
                          {cat.courses.map(course => (
                            <tr key={course.code} style={{ borderTop: `1px solid ${BRAND.grayLine}` }}>
                              <td className="px-4 py-3">
                                <div className="num-rail" style={{ fontWeight: 700, fontSize: 14, color: BRAND.grayInk }}>
                                  {course.code}
                                </div>
                                <div style={{ fontSize: 12, color: BRAND.gray, marginTop: 2 }}>
                                  {course.title}
                                </div>
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

                {/* Legend */}
                <div
                  className="px-4 py-3 flex flex-wrap gap-5 items-center"
                  style={{ borderTop: `1px solid ${BRAND.grayLine}`, backgroundColor: BRAND.grayWash }}
                >
                  <LegendKey>
                    <div className="flex items-center justify-center w-5 h-5 rounded-full" style={{ backgroundColor: BRAND.orange }}>
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                    Required
                  </LegendKey>
                  <LegendKey>
                    <div className="flex items-center justify-center w-5 h-5 rounded-full" style={{ border: `2px solid ${BRAND.orange}`, backgroundColor: BRAND.orangePale }}>
                      <span style={{ color: BRAND.orange, fontWeight: 700, fontSize: 10, lineHeight: 1 }}>~</span>
                    </div>
                    Alternative or conditional
                  </LegendKey>
                  <LegendKey>
                    <span style={{ color: '#C8C8CD', fontSize: 18, lineHeight: 1, paddingInline: 4 }}>·</span>
                    Not required
                  </LegendKey>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        <section>
          <div className="mb-4">
            <div className="eyebrow" style={{ color: BRAND.orange }}>Step 3</div>
            <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Plan your undergraduate years</h2>
          </div>

          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}
          >
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
                    aria-pressed={on}
                  >
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
                    <div
                      className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{
                        width: 24, height: 24,
                        backgroundColor: BRAND.orangePale,
                        color: BRAND.orangeDark,
                        fontWeight: 700, fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: 15, color: BRAND.grayInk, lineHeight: 1.55 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Deadlines ────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <div>
              <div className="eyebrow" style={{ color: BRAND.orange }}>Step 4</div>
              <h2 className="font-display" style={{ fontSize: 24, marginTop: 4 }}>Key application deadlines</h2>
            </div>
            <span style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600, letterSpacing: '0.02em' }}>
              ADEA AADSAS · Entry Year
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEADLINES.map(d => (
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
                  <div className="font-display num-rail" style={{ fontSize: 15, marginTop: 4, lineHeight: 1 }}>{d.date}</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: BRAND.grayInk, lineHeight: 1.3 }}>
                    {d.label}
                  </div>
                  {d.detail && (
                    <div style={{ fontSize: 12, color: BRAND.gray, marginTop: 4, lineHeight: 1.45 }}>
                      {d.detail}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-3 px-4 py-3 rounded-lg flex items-start gap-2"
            style={{ backgroundColor: BRAND.orangePale, color: BRAND.orangeDark, fontSize: 12, lineHeight: 1.5 }}
          >
            <Info size={14} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>
              ADEA AADSAS opens mid-May for D.D.S. / D.M.D. programs. Provisional offers may begin in early December.
            </span>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section
          className="rounded-lg p-6 md:p-8"
          style={{
            backgroundColor: BRAND.orange,
            color: 'white',
            backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 60%)',
          }}
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div style={{ maxWidth: 480 }}>
              <h3 className="font-display" style={{ fontSize: 26, lineHeight: 1.1 }}>Ready to start?</h3>
              <p style={{ marginTop: 8, fontSize: 14, opacity: 0.95, lineHeight: 1.5 }}>
                Connect with the UTRGV Pre-Dental Society and schedule a meeting with a Pre-Professional Development advisor to build your individualized plan.
              </p>
            </div>
            <a
              href="https://www.utrgv.edu/studentsuccess/for-students/pre-professional/index.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded transition-all"
              style={{ backgroundColor: 'white', color: BRAND.orange, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
            >
              <ExternalLink size={14} />
              Visit OPPD
            </a>
          </div>
        </section>

        {/* ── Disclaimer ───────────────────────────────────────────────── */}
        <p style={{ fontSize: 11, color: BRAND.gray, lineHeight: 1.6, textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          Prerequisite data is compiled from each school’s published requirements for planning purposes. Always verify current requirements with the official catalog and the ADEA AADSAS portal before applying.
        </p>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small sub-components
// ─────────────────────────────────────────────────────────────────────────────
function Stat({ label, value }) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: 'white', border: `1px solid ${BRAND.grayLine}` }}
    >
      <div className="eyebrow" style={{ color: BRAND.gray }}>{label}</div>
      <div className="font-display num-rail" style={{ fontSize: 34, color: BRAND.orange, marginTop: 6, lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}

function LegendKey({ children }) {
  return (
    <div className="flex items-center gap-2" style={{ fontSize: 12, color: BRAND.gray, fontWeight: 600 }}>
      {children}
    </div>
  );
}
