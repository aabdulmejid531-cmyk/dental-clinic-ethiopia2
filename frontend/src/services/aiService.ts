const dentalKnowledge: Record<string, string> = {
  'toothache': 'Toothaches can be caused by cavities, infection, gum disease, or tooth fractures. Rinse with warm water, floss to remove debris, and apply a cold compress. Avoid placing aspirin directly on the gum. See a dentist if pain persists for more than 1-2 days.',
  'cavity': 'Cavities are permanently damaged areas in teeth that develop into tiny openings. They are caused by bacteria, frequent snacking, sugary drinks, and poor oral hygiene. Treatment depends on severity: fillings, crowns, or root canals.',
  'gingivitis': 'Gingivitis is inflammation of the gums caused by plaque buildup. Symptoms include red, swollen gums that bleed easily. It is reversible with good oral hygiene: brush twice daily, floss daily, and get regular professional cleanings.',
  'bleeding': 'Bleeding gums often indicate gum disease (gingivitis or periodontitis). Other causes include brushing too hard, new flossing routine, or vitamin deficiencies. Continue gentle brushing and flossing; see a dentist if bleeding persists.',
  'sensitivity': 'Tooth sensitivity is sharp pain when consuming hot, cold, sweet, or acidic foods. Causes include enamel wear, exposed roots, cavities, or gum recession. Use desensitizing toothpaste and avoid acidic foods. Consult a dentist for treatment.',
  'bad breath': 'Halitosis (bad breath) is caused by poor oral hygiene, food particles, dry mouth, or underlying conditions. Brush tongue, floss daily, stay hydrated, and use mouthwash. Persistent bad breath may indicate gum disease or other issues.',
  'wisdom tooth': 'Wisdom teeth (third molars) often cause pain when impacted. Symptoms include jaw pain, swelling, and difficulty opening mouth. Treatment may involve extraction. Apply ice for swelling and take over-the-counter pain relief.',
  'implant': 'Dental implants are artificial tooth roots surgically placed in the jawbone. They provide a foundation for replacement teeth. Healing takes 3-6 months. Care includes regular brushing, flossing, and dental checkups.',
  'whitening': 'Teeth whitening removes stains and brightens teeth. Methods include in-office bleaching, take-home trays, and whitening toothpaste. Results last 6 months to 2 years. Avoid staining foods (coffee, tea, red wine) after treatment.',
  'root canal': 'Root canal treatment removes infected pulp from inside the tooth. It saves the natural tooth and prevents extraction. Recovery takes a few days. The tooth will need a crown after healing. It is performed under local anesthesia.',
};

const symptomsDatabase: Record<string, { condition: string; recommendation: string; urgency: string }[]> = {
  'toothache': [
    { condition: 'Dental Caries (Cavity)', recommendation: 'Schedule a filling appointment. Avoid sugary foods and maintain good oral hygiene.', urgency: 'Moderate' },
    { condition: 'Pulpitis (Tooth Nerve Inflammation)', recommendation: 'Root canal treatment may be needed. Take over-the-counter pain relief and see a dentist within 48 hours.', urgency: 'High' },
  ],
  'swollen': [
    { condition: 'Gingivitis or Periodontitis', recommendation: 'Professional cleaning and improved oral hygiene. Antibacterial mouthwash may help.', urgency: 'Moderate' },
    { condition: 'Dental Abscess', recommendation: 'This is a serious infection. Seek emergency dental care immediately.', urgency: 'Emergency' },
  ],
  'bleeding': [
    { condition: 'Gingivitis (Early Gum Disease)', recommendation: 'Improve brushing and flossing technique. Use a soft-bristled toothbrush.', urgency: 'Low-Moderate' },
    { condition: 'Periodontitis', recommendation: 'Professional deep cleaning (scaling and root planing) may be needed.', urgency: 'Moderate-High' },
  ],
};

const treatmentPlans: Record<string, string> = {
  'dental caries': '1. Remove decay and restore with filling (composite or amalgam).\n2. For extensive decay: dental crown.\n3. Follow-up in 6 months for checkup.\n4. Maintain fluoride toothpaste and limit sugar intake.',
  'gingivitis': '1. Professional dental cleaning (scaling).\n2. Improved home care: brush 2x/day, floss 1x/day.\n3. Antibacterial mouthwash (chlorhexidine) for 2 weeks.\n4. Follow-up in 3 months to assess improvement.',
  'periodontitis': '1. Scaling and root planing (deep cleaning).\n2. Antibiotic therapy (local or systemic).\n3. Periodontal maintenance every 3-4 months.\n4. In severe cases: periodontal surgery may be needed.',
  'pulpitis': '1. Root canal treatment to remove infected pulp.\n2. Dental crown placement after root canal.\n3. Pain management with analgesics.\n4. Follow-up X-ray in 6 months.',
  'tooth abscess': '1. Emergency: drain the abscess.\n2. Root canal treatment or extraction.\n3. Antibiotic course (amoxicillin or clindamycin).\n4. Warm salt water rinses 3x/day.',
  'impacted wisdom tooth': '1. Clinical and radiographic evaluation.\n2. Surgical extraction under local anesthesia.\n3. Post-op: ice packs, soft diet, pain medication.\n4. Follow-up in 1 week for suture removal.',
};

function findBestMatch(input: string, db: Record<string, string>): string | null {
  const lower = input.toLowerCase();
  const keys = Object.keys(db);
  for (const key of keys) {
    if (lower.includes(key)) return db[key];
  }
  for (const key of keys) {
    const words = key.split(' ');
    if (words.some(w => lower.includes(w))) return db[key];
  }
  return null;
}

function findSymptomMatches(symptoms: string[]): { condition: string; recommendation: string; urgency: string }[] {
  const results: { condition: string; recommendation: string; urgency: string }[] = [];
  for (const symptom of symptoms) {
    const lower = symptom.toLowerCase();
    for (const [key, conditions] of Object.entries(symptomsDatabase)) {
      if (lower.includes(key)) {
        results.push(...conditions);
      }
    }
  }
  return results;
}

function getHealthTips(): string {
  const tips = [
    '🥇 Brush your teeth twice a day for at least 2 minutes each time.',
    '🪥 Replace your toothbrush every 3-4 months.',
    '🦷 Floss daily to remove plaque between teeth.',
    '🥤 Limit sugary drinks and snacks between meals.',
    '💧 Drink plenty of water to maintain saliva flow.',
    '🚭 Avoid tobacco products to prevent oral cancer and gum disease.',
    '🍎 Eat crunchy fruits and vegetables to naturally clean teeth.',
    '🩺 Visit your dentist every 6 months for checkups and cleanings.',
    '🧴 Use fluoride toothpaste to strengthen enamel.',
    '🛡️ Wear a mouthguard during sports to protect teeth.',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

export const aiService = {
  async chatWithPatient(message: string, _language?: string, _patientId?: string) {
    const lower = message.toLowerCase();
    
    let reply: string;

    if (lower.includes('tip') || lower.includes('advice') || lower.includes('how to')) {
      reply = getHealthTips();
    } else if (lower.includes('symptom') || lower.includes('check')) {
      reply = 'Please use the Symptom Check mode to analyze your symptoms. Enter them comma-separated for the best results.';
    } else if (lower.includes('treatment') || lower.includes('plan')) {
      reply = 'Please use the Treatment Plan mode to generate a plan. Enter your diagnosis and I will provide a comprehensive treatment approach.';
    } else if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
      reply = `Hello! I'm your AI dental assistant. I can help with:\n- Answering dental health questions\n- Checking symptoms (use Symptom Check mode)\n- Generating treatment plans (use Treatment Plan mode)\n- Providing oral health tips\n\nHow can I help you today?`;
    } else {
      const match = findBestMatch(lower, dentalKnowledge);
      if (match) {
        reply = match;
      } else {
        reply = 'I specialize in dental health questions. Try asking about: toothache, cavities, gum disease, teeth whitening, implants, root canals, wisdom teeth, bad breath, or tooth sensitivity. Or ask for health tips!';
      }
    }

    return { reply };
  },

  async symptomChecker(symptoms: string[]) {
    const matches = findSymptomMatches(symptoms);
    
    if (matches.length === 0) {
      return {
        possibleConditions: 'No specific conditions matched. Common dental symptoms include: toothache, swollen gums, bleeding gums, and sensitivity.',
        recommendation: 'Please consult a dentist for a proper evaluation.',
        urgency: 'Unknown',
      };
    }

    const hasEmergency = matches.some(m => m.urgency === 'Emergency');
    
    return {
      possibleConditions: matches.map(m => `• ${m.condition} (Urgency: ${m.urgency})`).join('\n'),
      recommendation: matches[0].recommendation + (hasEmergency ? '\n\n⚠️ URGENT: Some symptoms suggest a dental emergency. Seek immediate care.' : ''),
      urgency: hasEmergency ? 'Emergency' : 'Non-emergency',
    };
  },

  async treatmentPlan(diagnosis: string) {
    const lower = diagnosis.toLowerCase();
    const match = findBestMatch(lower, treatmentPlans);
    
    if (match) {
      return { treatmentPlan: match };
    }

    return {
      treatmentPlan: `Standard Treatment Approach for "${diagnosis}":\n\n1. Comprehensive clinical examination and necessary X-rays.\n2. Discuss diagnosis and treatment options with your dentist.\n3. Develop personalized treatment timeline.\n4. Implement treatment with appropriate anesthesia.\n5. Schedule follow-up appointments as needed.\n\nPlease consult your dentist for a treatment plan specific to your condition.`,
    };
  },
};
