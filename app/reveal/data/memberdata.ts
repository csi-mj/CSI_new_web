export type Member = {
  name: string;
  role: string;
  portfolio: string;
  team: 'Execom' | 'Core Team';
};

export const members: Member[] = [
  // ===== EXECOM (52) =====

  // Logistics
  { name: 'ABDUL AHAD', role: 'Head', portfolio: 'Logistics', team: 'Execom' },
  { name: 'MOHAMMED AZEEMUDDIN AHMED', role: 'Head', portfolio: 'Logistics', team: 'Execom' },
  { name: 'MOHAMMED ZAYAAN', role: 'ASC Head', portfolio: 'Logistics', team: 'Execom' },

  // Design
  { name: 'BIBI ALMAS', role: 'ASC Head', portfolio: 'Design', team: 'Execom' },
  { name: 'HEBA FATIMA', role: 'ASC', portfolio: 'Design', team: 'Execom' },
  { name: 'MARIYAM FATIMA', role: 'ASC Head', portfolio: 'Design', team: 'Execom' },
  { name: 'NAZIA BEGUM', role: 'ASC', portfolio: 'Design', team: 'Execom' },

  // Events
  { name: 'AASHIR', role: 'Head', portfolio: 'Events', team: 'Execom' },
  { name: 'Abdul Quader', role: 'ASC Head', portfolio: 'Events', team: 'Execom' },
  { name: 'SAFIA SAIF', role: 'ASC Head', portfolio: 'Events', team: 'Execom' },
  { name: 'SAMIYA NAUREEN', role: 'ASC Head', portfolio: 'Events', team: 'Execom' },
  { name: 'SHAHAKAAR', role: 'Head', portfolio: 'Events', team: 'Execom' },
  { name: 'Shahriq Jaweed Ali', role: 'ASC Head', portfolio: 'Events', team: 'Execom' },

  // Marketing
  { name: 'AMMAAR AKHEEL MOHAMMED', role: 'ASC Head', portfolio: 'Marketing', team: 'Execom' },
  { name: 'ANZAR', role: 'Head', portfolio: 'Marketing', team: 'Execom' },
  { name: 'MIRZA ZOHAIR ALI', role: 'ASC Head', portfolio: 'Marketing', team: 'Execom' },
  { name: 'SHEEZA AHMED', role: 'ASC', portfolio: 'Marketing', team: 'Execom' },
  { name: 'SUMAIMA AYMAN', role: 'ASC', portfolio: 'Marketing', team: 'Execom' },
  { name: 'SYED SHEHWAR ALI', role: 'ASC Head', portfolio: 'Marketing', team: 'Execom' },
  { name: 'SYED YOUNUS AHMED', role: 'Head', portfolio: 'Marketing', team: 'Execom' },

  // Tech & Innovation
  { name: 'AREEBHA TAZEEM', role: 'ASC Head', portfolio: 'Tech & Innovation', team: 'Execom' },
  { name: 'IKRAM', role: 'Head', portfolio: 'Tech & Innovation', team: 'Execom' },
  { name: 'MIRZA ZABIULLAH', role: 'ASC Head', portfolio: 'Tech & Innovation', team: 'Execom' },
  { name: 'MOHAMMED TALHA', role: 'Head', portfolio: 'Tech & Innovation', team: 'Execom' },
  { name: 'OMER AHMED KHAN', role: 'ASC', portfolio: 'Tech & Innovation', team: 'Execom' },
  { name: 'SYED ANAS ALI', role: 'ASC', portfolio: 'Tech & Innovation', team: 'Execom' },
  { name: 'SYED MUKHTARUDDIN QURAISHI', role: 'ASC Head', portfolio: 'Tech & Innovation', team: 'Execom' },
  { name: 'ZAID MOHIUDDIN', role: 'ASC', portfolio: 'Tech & Innovation', team: 'Execom' },
  { name: 'ABDUL MAJEED', role: 'ASC', portfolio: 'Tech & Innovation', team: 'Execom' },


  // Web
  { name: 'MOHAMMED ABDUL RAHMAN', role: 'ASC', portfolio: 'Web', team: 'Execom' },
  { name: 'MOHAMMED OSMAN', role: 'Head', portfolio: 'Web', team: 'Execom' },
  { name: 'Mohd MuzammilUddin Malik', role: 'ASC', portfolio: 'Web', team: 'Execom' },
  { name: 'PAREKH', role: 'ASC Head', portfolio: 'Web', team: 'Execom' },
  { name: 'SHAIK ASHWAQ HUSSAIN', role: 'ASC Head', portfolio: 'Web', team: 'Execom' },
  { name: 'SOBIA MAHROSH', role: 'ASC Head', portfolio: 'Web', team: 'Execom' },

  // HR
  { name: 'MOHAMMED ABDUL SABOOR', role: 'Head', portfolio: 'HR', team: 'Execom' },
  { name: 'MOHAMMED AKIF', role: 'Head', portfolio: 'HR', team: 'Execom' },
  { name: 'SYED RUBEIN', role: 'ASC Head', portfolio: 'HR', team: 'Execom' },
  { name: 'SYEDA AYESHA', role: 'ASC Head', portfolio: 'HR', team: 'Execom' },
  { name: 'WAJAHAT HUSSAIN', role: 'ASC Head', portfolio: 'HR', team: 'Execom' },

  // Research & Development
  { name: 'AYAAN TAJAMMUL', role: 'ASC', portfolio: 'Research & Development', team: 'Execom' },
  { name: 'HADIYA MARIYAM AHMED', role: 'ASC', portfolio: 'Research & Development', team: 'Execom' },
  { name: 'KHALID SADUDDIN', role: 'ASC', portfolio: 'Research & Development', team: 'Execom' },
  { name: 'SOFIA FATIMA', role: 'Head', portfolio: 'Research & Development', team: 'Execom' },
  { name: 'SYED MUKHAIYAR', role: 'ASC', portfolio: 'Research & Development', team: 'Execom' },

  // Media & Press
  { name: 'ABDUL WASAY HUSSAIN', role: 'ASC', portfolio: 'Media & Press', team: 'Execom' },
  { name: 'HAMOODY', role: 'Head', portfolio: 'Media & Press', team: 'Execom' },
  { name: 'ISMAIL KHAN', role: 'Head', portfolio: 'Media & Press', team: 'Execom' },
  { name: 'MUBBASHIR FARHAN', role: 'ASC', portfolio: 'Media & Press', team: 'Execom' },

  // Editorial
  { name: 'GAZALA JABEEN HAFSA', role: 'ASC Head', portfolio: 'Editorial', team: 'Execom' },
  { name: 'MOHAMMED MERAJ UDDIN', role: 'ASC', portfolio: 'Editorial', team: 'Execom' },
  { name: 'NABIHA FATIMA', role: 'ASC Head', portfolio: 'Editorial', team: 'Execom' },
  { name: 'SAAD RIYAZ MOHAMMED', role: 'Head', portfolio: 'Editorial', team: 'Execom' },

  // ===== CORE TEAM (69) =====

  // Logistics
  { name: 'MOHAMMED AMAANULLAH', role: 'Core Member', portfolio: 'Logistics', team: 'Core Team' },
  { name: 'MOHAMMED ASIF MALIK', role: 'Core Member', portfolio: 'Logistics', team: 'Core Team' },
  { name: 'MOHAMMED SIDDEEQ', role: 'Core Member', portfolio: 'Logistics', team: 'Core Team' },
  { name: 'SYED ABDUL MUQSIT', role: 'Core Member', portfolio: 'Logistics', team: 'Core Team' },

  // Design
  { name: 'AMENA RIDA', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },
  { name: 'AMENA RUMAN', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },
  { name: 'AMENA SHAISTA', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },
  { name: 'Ashrafunnisa', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },
  { name: 'KOUSAR FATIMA', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },
  { name: 'ROUSHNA KHATOON', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },
  { name: 'SANIYA PARVEEN', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },
  { name: 'SUMMAIYA KAUSER', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },
  { name: 'SYED KAREEMULLAH HUSSAINI', role: 'Core Member', portfolio: 'Design', team: 'Core Team' },

  // Events
  { name: 'AMEENA MARYAM', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'AYESHA KAZI', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'Ammar Farooq', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'FAIZAN YAZDANI', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'JAWAD FAROOUQE', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'Md Omer Khan', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'RABIHA FATIMA', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'SHUJATHULLAH AMAAN', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'YOUSUF KHAN', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },
  { name: 'ZAID KATHERI', role: 'Core Member', portfolio: 'Events', team: 'Core Team' },

  // Marketing
  { name: 'ADIL AKHTAR', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },
  { name: 'MOHAMMED ABDUL MUQEET', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },
  { name: 'MOHAMMED ZAID', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },
  { name: 'MUTAHARA ALI', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },
  { name: 'NAUMAN QURESHY', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },
  { name: 'RIDA FATIMA', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },
  { name: 'SYEDA FARIYA MOHI', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },
  { name: 'XENIA FATIMA', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },
  { name: 'AYESHA KAZI', role: 'Core Member', portfolio: 'Marketing', team: 'Core Team' },

  // Tech & Innovation
  { name: 'AARYHAN KHOJA', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'ABDUL MATEEN FAROOQI', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'ASGAR ALI ABEDI', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'FATIMA FIRDOUS', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'IBRAHEEM MUBASHIR', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'M A Mubasheer', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'MEER AYAN ALI', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'MOHAMMED ABDUL RAHMAN', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'MOHAMMED ZAID FAROOQUI', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'MYSHA FATIMA', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'Mohd Muzammil Ali(1st yr)', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'SYED AAQUIB ZAHEER', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'SYED ANAS YASEEN', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'SYED HUSAMUDDIN HAJI', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'SYED MOHIUDDIN', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'SYEDA MARIAH', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'SYEDA SARA UNNISA', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'fardeenullah', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },
  { name: 'syed Rizwan', role: 'Core Member', portfolio: 'Tech & Innovation', team: 'Core Team' },

  // HR
  { name: 'AMREEN FATIMA', role: 'Core Member', portfolio: 'HR', team: 'Core Team' },
  { name: 'HASNAIN ALI KHAN', role: 'Core Member', portfolio: 'HR', team: 'Core Team' },
  { name: 'MIR ZOHAIR ALI', role: 'Core Member', portfolio: 'HR', team: 'Core Team' },
  { name: 'SYED ABUBAKAR HUSSAIN', role: 'Core Member', portfolio: 'HR', team: 'Core Team' },
  { name: 'ZEHRA FATIMA', role: 'Core Member', portfolio: 'HR', team: 'Core Team' },

  // Research & Development
  { name: 'AFRA BEGUM', role: 'Core Member', portfolio: 'Research & Development', team: 'Core Team' },
  { name: 'HISHAM MOHAMMED', role: 'Core Member', portfolio: 'Research & Development', team: 'Core Team' },
  { name: 'SHAIK SAMREEN', role: 'Core Member', portfolio: 'Research & Development', team: 'Core Team' },

  // Media & Press
  { name: 'Areeb Ahmed', role: 'Core Member', portfolio: 'Media & Press', team: 'Core Team' },
  { name: 'MAIRA KHAN', role: 'Core Member', portfolio: 'Media & Press', team: 'Core Team' },
  { name: 'MIRZA MUSTAFA ALI BAIG', role: 'Core Member', portfolio: 'Media & Press', team: 'Core Team' },
  { name: 'NAVEED KASHAF', role: 'Core Member', portfolio: 'Media & Press', team: 'Core Team' },
  { name: 'NOORUDDIN MOHAMMED', role: 'Core Member', portfolio: 'Media & Press', team: 'Core Team' },
  { name: 'SUMMAYYA ABDUL JAMEEL', role: 'Core Member', portfolio: 'Media & Press', team: 'Core Team' },
  { name: 'Samiha Azmath', role: 'Core Member', portfolio: 'Media & Press', team: 'Core Team' },

  // Editorial
  { name: 'HUMAINA MEHROZ', role: 'Core Member', portfolio: 'Editorial', team: 'Core Team' },
  { name: 'RIMSHA FARQUNDA', role: 'Core Member', portfolio: 'Editorial', team: 'Core Team' },
  { name: 'ZAINAB FATIMA', role: 'Core Member', portfolio: 'Editorial', team: 'Core Team' },
  { name: 'ZUNERA FATMA', role: 'Core Member', portfolio: 'Editorial', team: 'Core Team' },
];