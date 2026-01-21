export interface CareerRole {
  id: string;
  sceneId: string;
  title: string;
  company: string;
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
  skills: string[];
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
  };
  expertise: {
    category: string;
    skills: string[];
  }[];
  certifications: string[];
  education: {
    degree: string;
    school: string;
    period: string;
  }[];
  roles: CareerRole[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Vishal Shasi",
    email: "shasi.vishal1996@gmail.com",
    phone: "(929) 436-6130",
    linkedin: "linkedin.com/in/vishal-shasi",
    title: "Process Engineer | Manufacturing & Continuous Improvement",
    tagline: "Driving safety, quality, and productivity through loss elimination, CQV ownership, and shop-floor coaching.",
    summary: "Process Engineer with 5+ years of experience supporting high-volume manufacturing operations through process ownership, CQV (IQ/OQ/PQ), loss elimination, and operator capability building. Proven ability to partner with Operations, Maintenance, Quality, and Supply Chain to commission new equipment, stabilize production, and transition projects into reliable daily execution.",
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
    "CSSGB (Certified Six Sigma Green Belt)",
    "SolidWorks Essentials",
    "AutoCAD Certified User",
    "Tableau Desktop Specialist",
    "AZ 900 (Azure Fundamentals)",
  ],
  education: [
    {
      degree: "MS, Mechanical Engineering",
      school: "Western Michigan University",
      period: "2019 - 2021",
    },
    {
      degree: "BTech, Mechanical Engineering",
      school: "SASTRA University",
      period: "2014 - 2018",
    },
  ],
  roles: [
    {
      id: "production-engineer",
      sceneId: "paper-stack",
      title: "Production Engineer",
      company: "MJB Wood Group",
      period: "Aug 2024 - Jan 2026",
      summary: "Provided continuous improvement support for fabrication and assembly operations, partnering with production, quality, and engineering to improve stability and on-time delivery.",
      highlights: [
        "Led process validation (IQ, OQ, PQ) on CNC and Panel saw equipment installations",
        "Improved effective production output by 15% through structured RCA and CAPA",
        "Reduced training time by 30% through standardized SOPs and process maps",
        "Developed DFMEA, PFMEA, and PPAP frameworks for legacy and new processes",
      ],
      skills: ["CQV", "CAPA", "RCA", "PFMEA", "SOP Development"],
    },
    {
      id: "ci-engineer-bristol",
      sceneId: "3d-printer",
      title: "Continuous Improvement Engineer",
      company: "MJB Wood Group",
      location: "Bristol, IN",
      period: "Apr 2023 - Aug 2024",
      summary: "Led Lean execution across CNC machining, assembly, and material handling, delivering measurable improvements in output, yield, scrap reduction, and safety.",
      highlights: [
        "Achieved 55% yield improvement and 25% waste reduction through Kaizen events",
        "Established CI governance through KPI reviews and post-implementation audits",
        "Designed plant layouts with dedicated forklift lanes for improved safety",
        "Conducted warehouse-wide RFID feasibility testing for audit improvements",
      ],
      skills: ["Lean", "5S", "Kaizen", "VSM", "Process Automation"],
    },
    {
      id: "ci-lead-clio",
      sceneId: "cnc-machine",
      title: "Continuous Improvement Lead",
      company: "MJB Wood Group",
      location: "Clio, SC",
      period: "Feb 2022 - Apr 2023",
      summary: "Served as CI lead for CNC and assembly operations, building operating standards, reporting, and maintenance systems to improve safety, stability, and cost visibility.",
      highlights: [
        "Improved on-time delivery by 12% through in-process inspection controls",
        "Created production reporting and KPI reviews to prioritize downtime drivers",
        "Authored process SOPs for machine operation and maintenance",
        "Prepared technical reports and cost models for site leadership",
      ],
      skills: ["CI Leadership", "KPI Development", "Maintenance Planning", "Cost Modeling"],
    },
    {
      id: "quality-aluminum",
      sceneId: "roofing-sheets",
      title: "Continuous Improvement Intern",
      company: "Quality Aluminum Products",
      period: "Oct 2021 - Feb 2022",
      summary: "Focused on reducing machine downtime and improving manufacturing processes for aluminum roofing products.",
      highlights: [
        "Reduced machine downtime by 60% through coil feeding redesign",
        "Documented continuous supply standard for production operations",
      ],
      skills: ["Downtime Reduction", "Process Redesign", "Documentation"],
    },
    {
      id: "drdo-research",
      sceneId: "gas-turbine",
      title: "Research Assistant",
      company: "Gas Turbine Research Establishment (DRDO)",
      period: "Jan 2018 - Apr 2018",
      summary: "Conducted research on gear stiffness modeling for gas turbine applications using computational methods.",
      highlights: [
        "Built MATLAB and ANSYS gear stiffness models",
        "Reduced computation time by 80% with improved accuracy (10% error margin)",
      ],
      skills: ["MATLAB", "ANSYS", "Research", "Computational Modeling"],
    },
    {
      id: "nuclear-ford",
      sceneId: "automotive",
      title: "Manufacturing Intern",
      company: "Nuclear Fuel Corporation & Ford Motors",
      period: "2017",
      summary: "Gained foundational experience in safety-critical production environments through manufacturing documentation, inspection, and Kaizen observation.",
      highlights: [
        "Supported manufacturing documentation and inspection processes",
        "Observed Kaizen practices in automotive production environment",
      ],
      skills: ["Manufacturing", "Documentation", "Inspection", "Kaizen"],
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
