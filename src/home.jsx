import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, PawPrint, Pill, Stethoscope, ExternalLink } from 'lucide-react';

const BRAND = {
  orange:     '#F05023',
  orangeDark: '#C73E16',
  orangePale: '#FEF1EA',
  gray:       '#646469',
  grayInk:    '#1A1A1F',
  grayLine:   '#E8E8EA',
  grayWash:   '#F7F7F8',
  paper:      '#FAFAFB',
};

const TOOLS = [
  {
    to: '/dental',
    Icon: GraduationCap,
    title: 'Dental School',
    degree: 'D.D.S. / D.M.D.',
    description: 'Compare prerequisite coursework across Texas dental schools and map your timeline to a DDS or DMD.',
  },
  {
    to: '/veterinary',
    Icon: PawPrint,
    title: 'Veterinary School',
    degree: 'D.V.M.',
    description: 'Compare eligibility, prerequisites, and the VMCAS cycle for Texas veterinary schools.',
  },
  {
    to: '/pharmacy',
    Icon: Pill,
    title: 'Pharmacy School',
    degree: 'Pharm.D.',
    description: 'Compare prerequisites across the nine Texas Pharm.D. programs and map your path through the PharmCAS cycle.',
  },
  {
    to: '/physician-assistant',
    Icon: Stethoscope,
    title: 'Physician Assistant',
    degree: 'MPAS / MMS',
    description: 'Compare prerequisites and admission requirements across sixteen Texas PA programs and navigate the CASPA application cycle.',
  },
];

export default function Home() {
  return (
    <div style={{ fontFamily: "'Red Hat Display', system-ui, -apple-system, sans-serif", backgroundColor: BRAND.paper, minHeight: '100vh', color: BRAND.grayInk }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Patua+One&family=Red+Hat+Display:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Patua One', Georgia, serif; letter-spacing: -0.01em; }
        .eyebrow { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; }
      `}</style>

      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: `1px solid ${BRAND.grayLine}` }}>
        <div style={{ height: 4, backgroundColor: BRAND.orange }} />
        <div className="max-w-4xl mx-auto px-6 py-10 text-center">
          <div className="eyebrow" style={{ color: BRAND.gray }}>
            UTRGV · Office of Pre-Professional Development
          </div>
          <h1 className="font-display" style={{ fontSize: 44, color: BRAND.grayInk, marginTop: 8, lineHeight: 1.05 }}>
            Professional School <span style={{ color: BRAND.orange }}>Planning Tools</span>
          </h1>
          <p style={{ color: BRAND.gray, marginTop: 12, fontSize: 16, maxWidth: 520, margin: '12px auto 0', lineHeight: 1.6 }}>
            Choose your path. Compare prerequisites, plan your timeline, and prepare your application for professional school.
          </p>
        </div>
      </header>

      {/* Cards */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map(tool => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group block rounded-xl overflow-hidden transition-all duration-200"
              style={{
                backgroundColor: 'white',
                border: `1.5px solid ${BRAND.grayLine}`,
                textDecoration: 'none',
                color: BRAND.grayInk,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = BRAND.orange;
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(240,80,35,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = BRAND.grayLine;
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Icon header */}
              <div className="p-6 flex items-center gap-4" style={{ borderBottom: `1px solid ${BRAND.grayLine}` }}>
                <div className="flex items-center justify-center rounded-lg" style={{
                  width: 56, height: 56,
                  backgroundColor: BRAND.orangePale,
                  color: BRAND.orangeDark,
                }}>
                  <tool.Icon size={28} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="font-display" style={{ fontSize: 26, lineHeight: 1.1 }}>{tool.title}</h2>
                  <div className="eyebrow" style={{ color: BRAND.orange, marginTop: 4 }}>{tool.degree}</div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p style={{ fontSize: 14, color: BRAND.gray, lineHeight: 1.6 }}>{tool.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{
                  backgroundColor: BRAND.orange,
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 700,
                }}>
                  Explore Planning Tool
                  <ExternalLink size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 rounded-lg p-6 text-center" style={{
          backgroundColor: BRAND.orangePale,
          border: `1px solid ${BRAND.orangeDark}20`,
        }}>
          <p style={{ fontSize: 14, color: BRAND.orangeDark, fontWeight: 600, lineHeight: 1.5 }}>
            Need guidance? Schedule a meeting with the UTRGV Office of Pre-Professional Development.
          </p>
          <a
            href="https://www.utrgv.edu/student-success/for-students/pre-professional/index.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg transition-all"
            style={{
              backgroundColor: BRAND.orange,
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={14} />
            Visit OPPD
          </a>
        </div>
      </main>
    </div>
  );
}
