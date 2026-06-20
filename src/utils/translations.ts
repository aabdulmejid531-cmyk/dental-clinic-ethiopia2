export type Language = 'en' | 'am';

export const translations = {
  en: {
    nav_home: 'Home',
    nav_services: 'Services',
    nav_ai: 'AI Assistant',
    nav_login: 'Log in',
    nav_register: 'Book a visit',
    hero_eyebrow: 'AI-assisted dental care, Addis Ababa',
    hero_title: 'Your Smile, Our Priority',
    hero_subtitle:
      'Modern dental care built for Ethiopia — book appointments, ask our bilingual AI assistant a question at 2am, and keep your whole dental history in one place.',
    hero_cta_primary: 'Book an appointment',
    hero_cta_secondary: 'Ask the AI assistant',
    trust_patients: 'Patients cared for in Addis Ababa',
    trust_ai: 'AI assistant availability',
    trust_languages: 'Languages spoken',
    services_title: 'Care for every part of your smile',
    services_subtitle:
      'From routine cleanings to emergency care, our team pairs clinical expertise with AI tools that help you understand what is happening in your mouth — and what to do next.',
    ai_section_title: 'Ask before you worry',
    ai_section_subtitle:
      'Our assistant understands common patterns we see in Ethiopia — from khat-related gum wear to fluorosis in groundwater regions — and always points you to a clinician for anything serious.',
    footer_rights: 'All rights reserved.',
    footer_emergency: 'Dental emergency? Call the clinic directly — do not wait for an AI reply.'
  },
  am: {
    nav_home: 'መነሻ',
    nav_services: 'አገልግሎቶች',
    nav_ai: 'AI ረዳት',
    nav_login: 'ግባ',
    nav_register: 'ቀጠሮ ይያዙ',
    hero_eyebrow: 'በAI የታገዘ የጥርስ እንክብካቤ፣ አዲስ አበባ',
    hero_title: 'ፈገግታዎ ቅድሚያችን ነው',
    hero_subtitle:
      'ለኢትዮጵያ የተዘጋጀ ዘመናዊ የጥርስ እንክብካቤ — ቀጠሮ ይያዙ፣ በማንኛውም ሰዓት ለሁለት ቋንቋ ተናጋሪ AI ረዳታችን ይጠይቁ፣ እንዲሁም ሙሉ የጥርስ ታሪክዎን በአንድ ቦታ ያስቀምጡ።',
    hero_cta_primary: 'ቀጠሮ ይያዙ',
    hero_cta_secondary: 'AI ረዳትን ይጠይቁ',
    trust_patients: 'በአዲስ አበባ የተንከባከብናቸው ታካሚዎች',
    trust_ai: 'የAI ረዳት አገልግሎት ሰዓት',
    trust_languages: 'የሚነገሩ ቋንቋዎች',
    services_title: 'ለፈገግታዎ እያንዳንዱ ክፍል እንክብካቤ',
    services_subtitle:
      'ከመደበኛ ጽዳት እስከ አስቸኳይ እንክብካቤ ድረስ፣ ቡድናችን የክሊኒክ ሙያን ከAI መሳሪያዎች ጋር በማጣመር በአፍዎ ውስጥ ምን እየተከሰተ እንዳለ እና ቀጥሎ ምን ማድረግ እንዳለብዎ እንዲረዱ ያግዝዎታል።',
    ai_section_title: 'ከመጨነቅዎ በፊት ይጠይቁ',
    ai_section_subtitle:
      'ረዳታችን በኢትዮጵያ ውስጥ የተለመዱ ሁኔታዎችን ይረዳል — ከጫት ጋር የተያያዘ የድድ መሸርሸር እስከ በከርሰ ምድር ውሃ አካባቢዎች ያለ ፍሎሮሲስ — እና ለማንኛውም ከባድ ጉዳይ ሁልጊዜ ወደ ሐኪም እንዲሄዱ ይመክራል።',
    footer_rights: 'መብቱ በህግ የተጠበቀ ነው።',
    footer_emergency: 'የጥርስ ድንገተኛ አደጋ? ቀጥታ ክሊኒኩን ይደውሉ — የAI ምላሽ አይጠብቁ።'
  }
} as const;

export function t(lang: Language, key: keyof (typeof translations)['en']): string {
  return translations[lang][key] ?? translations.en[key];
}
