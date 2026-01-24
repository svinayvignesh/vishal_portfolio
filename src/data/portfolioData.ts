export interface CareerRole {
  id: string;
  sceneId: string;
  title: string;
  company: string;
  logo?: string; // Path to company logo
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
  skills: string[];
  certificate?: string; // Path to certificate image
}

export interface Certification {
  name: string;
  link?: string;
  issuer?: string;
  issueDate?: string;
  credentialId?: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    title: string;
    tagline: string;
    summary: string;
    resume: string;
  };
  expertise: {
    category: string;
    skills: string[];
  }[];
  certifications: Certification[];
  education: {
    degree: string;
    school: string;
    period: string;
    logo?: string; // Path to university logo
  }[];
  roles: CareerRole[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Vishal Shasi",
    email: "shasi.vishal1996@gmail.com",
    phone: "+1 (929) 436-6130",
    linkedin: "linkedin.com/in/vishal-shasi",
    title: "Process Engineer | Manufacturing & Continuous Improvement",
    tagline: "Driving safety, quality, and productivity through loss elimination, CQV ownership, and shop-floor coaching.",
    summary: "Process Engineer with 5+ years of experience supporting high-volume manufacturing operations through process ownership, CQV (IQ/OQ/PQ), loss elimination, and operator capability building. Proven ability to partner with Operations, Maintenance, Quality, and Supply Chain to commission new equipment, stabilize production, and transition projects into reliable daily execution.",
    resume: "/resume.docx",
  },
  expertise: [
    {
      category: "Process & Manufacturing",
      skills: [
        "Production workflow analysis",
        "SOP and work instructions",
        "PFMEA and risk documentation",
        "CAPA and RCA",
        "Material flow & logistics",
        "Process validation (IQ/OQ/PQ)",
        "Time studies",
        "Equipment & tooling support",
      ],
    },
    {
      category: "Lean Manufacturing & CI",
      skills: [
        "5S and visual controls",
        "Value stream mapping (VSM)",
        "Changeover documentation",
        "KPI and performance tracking",
        "Kaizen leadership",
        "ISO/IATF documentation",
        "Audit and compliance",
        "Waste elimination",
      ],
    },
    {
      category: "Design & Analytics",
      skills: [
        "SolidWorks",
        "GD&T",
        "Fixtures and Gauges",
        "Statistical process (Cp/Cpk)",
        "Power BI and Tableau",
        "AutoCAD",
        "Python & MATLAB",
      ],
    },
  ],
  certifications: [
    {
      name: "Tableau Desktop Specialist",
      link: "https://www.credly.com/badges/b7bce271-d95a-4f51-9353-f4b1b2a4a938/linked_in_profile",
    },
    {
      name: "Azure Fundamentals",
      link: "https://www.credly.com/badges/b41f7581-62fd-4b31-a688-0c9013df995a?source=linked_in_profile",
    },
    {
      name: "AutoCAD Certified User",
      link: "https://www.credly.com/badges/5889ca21-7f4a-4df4-ae69-039febc71bfb?source=linked_in_profile",
    },
    {
      name: "SolidWorks Essentials",
      link: "https://www.linkedin.com/learning/certificates/a28f3d2bd8c8f58bcbb8782f02a2b36e1d63fdae8ba0919b368548a3adc4b857?trk=backfilled_certificate&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BL21SuJ8PTW2Z4YYppd%2F%2F9Q%3D%3D",
    },
    {
      name: "CSSGB (Six Sigma Green Belt)",
      issuer: "TÜV SÜD",
      issueDate: "Jul 2021",
      credentialId: "IN/9993/94902",
    },
  ],
  education: [
    {
      degree: "MS, Mechanical Engineering",
      school: "Western Michigan University",
      period: "2019 - 2021",
      logo: "/logos/wmu.png",
    },
    {
      degree: "BTech, Mechanical Engineering",
      school: "SASTRA University",
      period: "2014 - 2018",
      logo: "/logos/sastra.png",
    },
  ],
  roles: [
    {
      id: "production-engineer",
      sceneId: "paper-stack",
      title: "Production Engineer",
      company: "MJB Wood Group",
      logo: "/logos/mjb-wood.webp",
      period: "Aug 2024 - Jan 2026",
      summary: "Spearheaded continuous improvement initiatives across fabrication and assembly operations, delivering measurable gains in equipment reliability, process stability, and on-time delivery through structured problem-solving and cross-functional collaboration.",
      highlights: [
        "Commissioned and validated 3 major CNC and Panel saw installations through complete IQ/OQ/PQ protocols, ensuring FDA-compliant process control",
        "Drove 15% improvement in effective production output by implementing disciplined RCA and CAPA methodologies across 12 production lines",
        "Accelerated operator competency building by 30% through development of standardized SOPs, visual work instructions, and process flow maps",
        "Established comprehensive risk management framework including DFMEA, PFMEA, and PPAP documentation for both legacy and new product launches",
        "Partnered with Quality, Maintenance, and Supply Chain teams to reduce process variability and improve first-pass yield",
      ],
      skills: ["Process Validation (IQ/OQ/PQ)", "CAPA & RCA", "PFMEA & DFMEA", "SOP Development", "Equipment Commissioning", "Cross-functional Leadership"],
    },
    {
      id: "ci-engineer-bristol",
      sceneId: "3d-printer",
      title: "Continuous Improvement Engineer",
      company: "MJB Wood Group",
      logo: "/logos/mjb-wood.webp",
      location: "Bristol, IN",
      period: "Apr 2023 - Aug 2024",
      summary: "Led Lean Manufacturing transformation across CNC machining, assembly, and material handling operations, delivering breakthrough improvements in productivity, quality, and workplace safety through structured Kaizen events and CI governance.",
      highlights: [
        "Achieved 55% yield improvement across 8 production cells through targeted Kaizen events, eliminating root causes of rework and scrap",
        "Reduced material waste by 25% ($180K annual savings) via process standardization and visual management implementation",
        "Established CI governance framework including weekly KPI reviews, post-implementation audits, and sustainability checks across 3 facilities",
        "Redesigned plant layouts with dedicated forklift traffic lanes and visual safety controls, resulting in zero safety incidents over 12 months",
        "Conducted comprehensive warehouse-wide RFID feasibility study, projecting 40% reduction in cycle count audit time",
        "Trained and coached 25+ operators and supervisors on Lean tools including 5S, VSM, and A3 problem-solving",
      ],
      skills: ["Lean Manufacturing", "5S & Visual Management", "Kaizen Leadership", "Value Stream Mapping", "Process Automation", "KPI Development"],
    },
    {
      id: "ci-lead-clio",
      sceneId: "cnc-machine",
      title: "Continuous Improvement Lead",
      company: "MJB Wood Group",
      logo: "/logos/mjb-wood.webp",
      location: "Clio, SC",
      period: "Feb 2022 - Apr 2023",
      summary: "Served as on-site CI lead for CNC and assembly operations, establishing operating standards, performance reporting systems, and preventive maintenance protocols to drive safety, process stability, and cost transparency across the manufacturing value stream.",
      highlights: [
        "Improved on-time delivery from 78% to 90% through implementation of in-process inspection controls and real-time production tracking",
        "Developed and deployed comprehensive production reporting dashboard, enabling data-driven prioritization of top 5 downtime drivers",
        "Authored 15+ detailed SOPs covering machine setup, operation, changeover, and preventive maintenance procedures",
        "Created cost models for leadership decision-making on equipment investments, staffing optimization, and outsourcing analysis",
        "Led root cause analysis on recurring quality escapes, implementing corrective actions that reduced customer complaints by 18%",
        "Coordinated with Maintenance to establish TPM practices, improving equipment OEE from 65% to 78%",
      ],
      skills: ["CI Leadership", "KPI Development & Tracking", "TPM & Maintenance Planning", "Cost Modeling", "SOP Authoring", "Data Analytics"],
    },
    {
      id: "quality-aluminum",
      sceneId: "roofing-sheets",
      title: "Continuous Improvement Intern",
      company: "Quality Aluminum Products",
      logo: "/logos/quality-aluminum.webp",
      period: "Oct 2021 - Feb 2022",
      summary: "Delivered high-impact process improvement project focused on eliminating equipment downtime and establishing operational standards for aluminum roofing sheet manufacturing operations.",
      highlights: [
        "Reduced machine downtime by 60% (from 120 to 48 minutes per shift) through complete redesign of coil feeding mechanism",
        "Documented and implemented continuous supply standard, eliminating material starvation as a production constraint",
        "Collaborated with Maintenance and Operations to validate design changes and ensure sustained performance",
        "Created visual management boards to track downtime root causes and improvement progress",
      ],
      skills: ["Downtime Reduction", "Process Redesign", "Standard Work Documentation", "Cross-functional Collaboration"],
    },
    {
      id: "drdo-research",
      sceneId: "gas-turbine",
      title: "Research Assistant",
      company: "Gas Turbine Research Establishment (DRDO)",
      logo: "/logos/drdo.png",
      period: "Jan 2018 - Apr 2018",
      certificate: "/certificates/drdo-certificate.jpg",
      summary: "Conducted advanced computational research on gear mesh stiffness modeling for aerospace gas turbine applications, developing optimized simulation methods to support design validation and performance prediction.",
      highlights: [
        "Developed and validated MATLAB-based analytical models for time-varying gear mesh stiffness in spur and helical gear systems",
        "Created ANSYS FEA simulation framework for gear tooth contact analysis under dynamic loading conditions",
        "Achieved 80% reduction in computation time while maintaining accuracy within 10% error margin compared to experimental data",
        "Presented research findings to senior scientists and contributed to technical documentation for future turbine design programs",
      ],
      skills: ["MATLAB Programming", "ANSYS FEA", "Computational Modeling", "Research & Analysis", "Technical Documentation"],
    },
    {
      id: "ford",
      sceneId: "automotive",
      title: "Manufacturing Intern",
      company: "Ford Motor Company",
      logo: "/logos/ford.png",
      period: "2017",
      certificate: "/certificates/ford-certificate.jpg",
      summary: "Gained foundational exposure to world-class automotive manufacturing operations, observing safety protocols, quality systems, and continuous improvement practices in a high-volume production environment.",
      highlights: [
        "Supported manufacturing documentation and work instruction updates for assembly line operations",
        "Participated in quality inspection processes and learned GD&T principles for component verification",
        "Observed Kaizen events and lean manufacturing practices in action on the production floor",
        "Collaborated with production engineers to understand process flow, takt time, and capacity planning concepts",
      ],
      skills: ["Manufacturing Operations", "Quality Inspection", "Technical Documentation", "Kaizen Observation", "GD&T Basics"],
    },
  ],
};

// Scene configuration for 3D backgrounds
export const sceneConfig = {
  "paper-stack": {
    name: "Order from Chaos",
    description: "ISO documents organizing into a neat stack",
    primaryColor: "#4a90a4",
    accentColor: "#d4a574",
  },
  "3d-printer": {
    name: "The 3D Print",
    description: "Additive manufacturing in action",
    primaryColor: "#5a9fd4",
    accentColor: "#ff8c42",
  },
  "cnc-machine": {
    name: "The CNC",
    description: "Precision machining at work",
    primaryColor: "#6b8e9f",
    accentColor: "#c4a35a",
  },
  "roofing-sheets": {
    name: "Roofing Sheets",
    description: "Corrugated metal assembly",
    primaryColor: "#8fa4af",
    accentColor: "#a0a0a0",
  },
  "gas-turbine": {
    name: "The Turbine",
    description: "High-speed engineering",
    primaryColor: "#3d7ea6",
    accentColor: "#ff6b35",
  },
  "automotive": {
    name: "The Automotive",
    description: "Precision automotive manufacturing",
    primaryColor: "#2c5f7c",
    accentColor: "#e63946",
  },
};
