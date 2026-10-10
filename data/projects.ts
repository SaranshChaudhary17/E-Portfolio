// Project Data with rich case studies
export type Project = {
  slug: string;
  title: string;
  type: string;
  year: string;
  tags: string[];
  summary: string;
  stack: string[];
  live?: string;
  isComingSoon?: boolean;
  platform: string;
  role: string;
  rights?: string;
  colors: string[];
  accentColor?: string;
  archiveRef: string;
  pageIndex: { id: string; num: string; title: string }[];
  objectives: {
    title: string;
    text: string;
    media: { type: "video" | "image"; src: string; ref: string };
  };
  execution: {
    title: string;
    text: string;
    media: { type: "video" | "image"; src: string; ref: string };
  };
  gallery: {
    devices: { type: "image" | "video"; src: string; title: string }[];
    features: { title: string; desc: string; img: string }[];
  };
  stats: { value: string; label: string }[];
  clients: string[];
  banner: {
    img: string;
    title: string;
    subtitle: string;
  };
};

export const projects: Project[] = [
  {
    slug: "rotana-media-group",
    title: "Rotana Media Group",
    type: "Entertainment Company",
    year: "2023",
    platform: "Web",
    role: "Development",
    tags: ["Web", "Development"],
    summary:
      "Developed RMS’s digital platform to showcase their role as a leading media conglomerate in the MENA region. The site highlights their expansive network, advertising expertise, and innovative solutions, positioning RMS as a trusted partner for brands across TV, digital, social, and out-of-home channels.",
    rights: "This project's all rights reserved to ICON MarCom Group.",
    isComingSoon: true,
    colors: ["#1cb647", "#000000"],
    accentColor: "#1cb647",
    archiveRef: "CMFYGJM8",
    stack: [
      "WordPress",
      "PHP",
      "MySQL",
      "ACF",
      "WP Custom Theme",
      "Webpack",
      "Gulp",
      "jQuery",
      "GSAP",
      "Tailwind CSS",
    ],
    pageIndex: [
      { id: "objectives", num: "01", title: "System Objectives" },
      { id: "gallery", num: "02", title: "Interactive Gallery" },
      { id: "execution", num: "03", title: "Execution Protocol" },
    ],
    objectives: {
      title: "System Objectives",
      text: "The primary objective was to engineer a digital platform that asserts Rotana's dominance as a leading media conglomerate in the MENA region. The design needed to seamlessly organize an expansive network of TV, digital, and out-of-home advertising solutions into an intuitive, premium interface.",
      media: {
        type: "video",
        src: "/images/projects/rotana/showcase_1.mp4",
        ref: "CMFYGJM8",
      },
    },
    execution: {
      title: "Execution Protocol",
      text: "Built a robust, enterprise-grade WordPress solution using custom PHP themes and Advanced Custom Fields. Implemented a modernized build pipeline using Webpack and Gulp to optimize assets, while utilizing GSAP to add broadcast-quality motion design to the corporate digital experience.",
      media: {
        type: "video",
        src: "/images/projects/rotana/showcase_2.mp4",
        ref: "CMFYGJM9",
      },
    },
    gallery: {
      devices: [
        {
          type: "image",
          src: "/images/projects/rotana/screen_mobile_1.jpg",
          title: "News & Insights",
        },
        {
          type: "video",
          src: "/images/projects/rotana/screen_mobile_video.mp4",
          title: "Interactive Experience",
        },
        {
          type: "image",
          src: "/images/projects/rotana/screen_mobile_2.jpg",
          title: "Brand Solutions",
        },
      ],
      features: [
        {
          title: "Our Vision",
          desc: "To maintain its position as the region's most flexible customer-centric media solutions provider through cutting-edge broadcast and digital distribution networks.",
          img: "/images/projects/rotana/gallery_slide_1.jpg",
        },
        {
          title: "Influencer Marketing",
          desc: "Redefine your advertising approach with Rotana's Over-The-Top (OTT) solutions, connecting premiere brands directly with millions of high-intent viewers.",
          img: "/images/projects/rotana/gallery_slide_2.jpg",
        },
      ],
    },
    stats: [
      { value: "14+", label: "Most popular channels in the Arab world" },
      { value: "60%", label: "Market share of first-run movies" },
      { value: "2000+", label: "Titles in classic Arabic movie library" },
    ],
    clients: [
      "GSK",
      "Nissan",
      "OSN",
      "Unilever",
      "KFC",
      "Nike",
      "Mercedes",
      "Lacoste",
      "Volkswagen",
      "Microsoft",
      "P&G",
      "Heineken",
      "LG",
      "Flydubai",
      "Ford",
      "Uber",
      "RTC",
    ],
    banner: {
      img: "/images/projects/rotana/gallery_slide_3.jpg",
      title: "Expanding our region",
      subtitle:
        "Reaching millions across the MENA landscape with world-class entertainment, technology, and broadcasting innovation.",
    },
  },
  {
    slug: "ottava-surgical-robotic-system",
    title: "Ottava™ Surgical Robotic System",
    type: "Medical Robotics",
    year: "2024",
    platform: "WebXR / WebGL",
    role: "Lead Creative Developer",
    tags: ["Simulation-based Training", "WebXR Development"],
    summary:
      "Johnson & Johnson (J&J) Ottava™ Surgical Robotic System, enabling interactive simulation-based training in a high-fidelity browser-based VR & WebGL environment.",
    rights: "All rights reserved to Johnson & Johnson MedTech.",
    live: "https://example.com",
    colors: ["#00f3ff", "#0a0a0a"],
    accentColor: "#00f3ff",
    archiveRef: "CMPYA0QL",
    stack: [
      "Three.js",
      "WebXR",
      "React",
      "GLSL Shaders",
      "WebAudio",
      "TypeScript",
      "Tailwind CSS",
    ],
    pageIndex: [
      { id: "objectives", num: "01", title: "System Objectives" },
      { id: "gallery", num: "02", title: "Interactive Gallery" },
      { id: "execution", num: "03", title: "Execution Protocol" },
    ],
    objectives: {
      title: "System Objectives",
      text: "Develop an ultra-low-latency 3D simulation suite empowering surgeons and technicians to rehearse robotic arm articulation, laparoscopic tool changes, and spatial clearance protocols before live surgery.",
      media: {
        type: "video",
        src: "/images/projects/rotana/showcase_3.mp4",
        ref: "CMPYA0QL",
      },
    },
    execution: {
      title: "Execution Protocol",
      text: "Engineered customized WebGL geometry streaming and inverse kinematics solvers in Web Workers, achieving 60fps locked performance on mobile and standalone VR headsets.",
      media: {
        type: "image",
        src: "/images/projects/rotana/next_project.jpg",
        ref: "CMPYA0QM",
      },
    },
    gallery: {
      devices: [
        {
          type: "image",
          src: "/images/projects/rotana/screen_mobile_1.jpg",
          title: "Robotic Telemetry",
        },
        {
          type: "video",
          src: "/images/projects/rotana/screen_mobile_video.mp4",
          title: "Spatial Kinematics",
        },
        {
          type: "image",
          src: "/images/projects/rotana/screen_mobile_2.jpg",
          title: "Haptic Feedback UI",
        },
      ],
      features: [
        {
          title: "Sub-Millimeter Accuracy",
          desc: "Real-time kinematic simulation of multi-joint robotic arms with physical collision alerts.",
          img: "/images/projects/rotana/gallery_slide_1.jpg",
        },
        {
          title: "Stereoscopic WebXR",
          desc: "Native browser-based immersive training without external software installation requirements.",
          img: "/images/projects/rotana/gallery_slide_2.jpg",
        },
      ],
    },
    stats: [
      { value: "0.4ms", label: "Render loop kinematics tick" },
      { value: "99.8%", label: "Simulator precision alignment" },
      { value: "450+", label: "Surgical staff onboarded" },
    ],
    clients: ["Johnson & Johnson", "MedTech Innovation", "Ethicon"],
    banner: {
      img: "/images/projects/rotana/gallery_slide_3.jpg",
      title: "Precision in motion",
      subtitle: "Transforming robotic surgical education for the next generation of patient care.",
    },
  },
  {
    slug: "cyber-telemetry-interface",
    title: "Cyber Telemetry HUD",
    type: "Command & Control System",
    year: "2025",
    platform: "Web App",
    role: "UI/UX & Frontend Architecture",
    tags: ["Real-time Systems", "Data Visualization"],
    summary:
      "Next-generation aerospace telemetry dashboard featuring high-frequency WebSocket streams, WebGL orbital globe rendering, and sub-millisecond anomaly detection alert grids.",
    rights: "Confidential Client Architecture.",
    live: "https://example.com",
    colors: ["#fcee0a", "#080808"],
    accentColor: "#fcee0a",
    archiveRef: "CYBER88A",
    stack: ["Next.js", "WebGL", "WebSockets", "Rust/Wasm", "Tailwind CSS"],
    pageIndex: [
      { id: "objectives", num: "01", title: "System Objectives" },
      { id: "gallery", num: "02", title: "Interactive Gallery" },
      { id: "execution", num: "03", title: "Execution Protocol" },
    ],
    objectives: {
      title: "System Objectives",
      text: "Consolidate 100,000 concurrent sensor feeds into a human-readable tactical HUD with instantaneous latency alerts and visual state feedback.",
      media: {
        type: "video",
        src: "/images/projects/rotana/showcase_1.mp4",
        ref: "CYBER88A",
      },
    },
    execution: {
      title: "Execution Protocol",
      text: "Architected client-side filtering pipelines utilizing WebAssembly to parse high-throughput telemetry without locking the browser UI thread.",
      media: {
        type: "video",
        src: "/images/projects/rotana/showcase_2.mp4",
        ref: "CYBER88B",
      },
    },
    gallery: {
      devices: [
        {
          type: "image",
          src: "/images/projects/rotana/screen_mobile_1.jpg",
          title: "Orbit Trajectory",
        },
        {
          type: "video",
          src: "/images/projects/rotana/screen_mobile_video.mp4",
          title: "Sensor Metrics",
        },
        {
          type: "image",
          src: "/images/projects/rotana/screen_mobile_2.jpg",
          title: "Thermal Mapping",
        },
      ],
      features: [
        {
          title: "Zero-Lag Streaming",
          desc: "Bufferless binary WebSocket protocols with client-side ring buffers.",
          img: "/images/projects/rotana/gallery_slide_1.jpg",
        },
        {
          title: "Adaptive Theme Engine",
          desc: "Mission-critical high-contrast dark modes with localized auditory cue triggers.",
          img: "/images/projects/rotana/gallery_slide_2.jpg",
        },
      ],
    },
    stats: [
      { value: "100k", label: "Concurrent sensor streams" },
      { value: "< 2ms", label: "Render latency roundtrip" },
      { value: "99.99%", label: "Uptime across mission flights" },
    ],
    clients: ["Aerospace Dynamics", "Orbit Defense", "Vector Labs"],
    banner: {
      img: "/images/projects/rotana/gallery_slide_3.jpg",
      title: "Operational Dominance",
      subtitle: "Real-time spatial visualization engineered for mission-critical reliability.",
    },
  },
  {
    slug: "kinetic-audio-synthesizer",
    title: "Kinetic Web Synthesizer",
    type: "Generative Audio Engine",
    year: "2025",
    platform: "Web Audio API",
    role: "Fullstack Audio & UI Engineer",
    tags: ["DSP / Audio", "Creative Coding"],
    summary:
      "In-browser modular polyphonic synthesizer with custom wavetable oscillators, real-time Fourier transform spectrum visualizers, and MIDI hardware interface mapping.",
    rights: "Open Source Audio Lab.",
    live: "https://example.com",
    colors: ["#ff003c", "#050505"],
    accentColor: "#ff003c",
    archiveRef: "AUDIO99Z",
    stack: ["Web Audio API", "AudioWorklets", "Canvas 2D", "React", "TypeScript"],
    pageIndex: [
      { id: "objectives", num: "01", title: "System Objectives" },
      { id: "gallery", num: "02", title: "Interactive Gallery" },
      { id: "execution", num: "03", title: "Execution Protocol" },
    ],
    objectives: {
      title: "System Objectives",
      text: "Eliminate audio dropouts in web synthesizers by moving all DSP audio graph computations to dedicated AudioWorklet threads running concurrently with canvas 60fps visualizers.",
      media: {
        type: "video",
        src: "/images/projects/rotana/showcase_3.mp4",
        ref: "AUDIO99Z",
      },
    },
    execution: {
      title: "Execution Protocol",
      text: "Designed custom oscillator algorithms with anti-aliasing bandlimited step impulses (BLEP) and dynamic envelope modulators for studio-grade warmth.",
      media: {
        type: "image",
        src: "/images/projects/rotana/gallery_slide_1.jpg",
        ref: "AUDIO99W",
      },
    },
    gallery: {
      devices: [
        {
          type: "image",
          src: "/images/projects/rotana/screen_mobile_1.jpg",
          title: "Modular Patchbay",
        },
        {
          type: "video",
          src: "/images/projects/rotana/screen_mobile_video.mp4",
          title: "Oscillator Nodes",
        },
        {
          type: "image",
          src: "/images/projects/rotana/screen_mobile_2.jpg",
          title: "Filter Envelopes",
        },
      ],
      features: [
        {
          title: "AudioWorklet DSP",
          desc: "Dedicated real-time audio threads preventing buffer under-runs under heavy CPU loads.",
          img: "/images/projects/rotana/gallery_slide_1.jpg",
        },
        {
          title: "Hardware MIDI Connect",
          desc: "Direct USB plug-and-play synthesizer control via Web MIDI API standard.",
          img: "/images/projects/rotana/gallery_slide_2.jpg",
        },
      ],
    },
    stats: [
      { value: "64", label: "Polyphonic voice channels" },
      { value: "192kHz", label: "Sample rate DSP pipeline" },
      { value: "0ms", label: "Perceptible latency gap" },
    ],
    clients: ["SoundWave Studios", "Harmonic Audio", "Modular Labs"],
    banner: {
      img: "/images/projects/rotana/gallery_slide_3.jpg",
      title: "Acoustic Architecture",
      subtitle: "Pushing the frontiers of browser audio synthesis with studio-grade DSP engines.",
    },
  },
];
