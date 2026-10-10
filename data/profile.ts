// Yahan apni details badlo.
export const profile = {
  name: "Saransh Chaudhary",
  role: "Creative Developer",
  tagline: "Building fast, interactive web experiences.",
  email: "saranshchaudhary17@gmail.com",
  phone: "(+91) 63966 96937",
  phoneRaw: "+916396696937",
  whatsappUrl: "https://wa.me/916396696937",
  dob: "2004-10-17",
  about: "Write 3-4 lines about yourself here: what you build, what you enjoy, what you are learning.",
  stats: [["PROJECTS_COMPLETED", "10+"], ["STACK", "NEXT / THREE / GSAP"], ["STATUS", "OPEN_FOR_OFFERS"]] as [string, string][],
  socials: [
    ["GitHub", "https://github.com/SaranshChaudhary17"],
    ["LinkedIn", "https://linkedin.com/in/your-handle"],
  ] as [string, string][],
};

export function calculateAge(birthDateString = profile.dob): number {
  const today = new Date();
  const birth = new Date(birthDateString);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
