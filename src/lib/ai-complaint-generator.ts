import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface ComplaintDetails {
  category: string;
  description: string;
  timestamp: string;
  language: string;
}

export class AIComplaintGenerator {
  async generateComplaint(transcribedText: string, language: string): Promise<{
    complaint_text: string;
    category: string;
    details: ComplaintDetails;
  }> {
    // Check if API key is configured
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      console.warn('Groq API key not configured, using template-based generation');
      return this.generateTemplateComplaint(transcribedText, language);
    }

    const prompt = this.buildPrompt(transcribedText, language);

    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2048,
      });

      const responseText = chatCompletion.choices[0]?.message?.content || '';
      
      if (!responseText) {
        console.warn('Empty response from Groq AI, using template');
        return this.generateTemplateComplaint(transcribedText, language);
      }
      
      return this.parseResponse(responseText, transcribedText, language);
    } catch (error) {
      console.error('AI Generation Error:', error);
      // Fallback to template-based generation
      console.log('Using template-based complaint generation as fallback');
      return this.generateTemplateComplaint(transcribedText, language);
    }
  }

  private buildPrompt(transcribedText: string, language: string): string {
    if (language === 'ta') {
      return `You are a Tamil complaint letter writing assistant. The user has provided the following complaint text in Tamil:

"${transcribedText}"

Your task:
1. Identify the complaint category (தண்ணீர், மின்சாரம், சாலை, குப்பை, வடிகால், தெரு விளக்கு, etc.)
2. Convert this EXACT complaint into a formal letter format in Tamil
3. Use the ACTUAL details from the user's text - do not add generic information
4. Keep the user's specific concerns, locations, and details
5. Add proper greeting and closing
6. Make it professional while preserving the user's original complaint details

IMPORTANT: Base the complaint ONLY on what the user said. Do not write a generic template.

Format the response as:
CATEGORY: [Category in Tamil]
---
[Full complaint letter in Tamil based on user's actual text]`;
    } else {
      return `You are a professional complaint letter writing assistant. The user has provided the following complaint:

"${transcribedText}"

Your task:
1. Identify the complaint category (Water Supply, Electricity, Road, Garbage, Drainage, Street Light, etc.)
2. Convert this EXACT complaint into a formal letter format in English
3. Use the ACTUAL details from the user's text - do not add generic information
4. Keep the user's specific concerns, locations, names, dates, and all details mentioned
5. Add proper greeting and closing
6. Make it professional while preserving the user's original complaint details

IMPORTANT: Base the complaint ONLY on what the user said. Do not write a generic template or add placeholder information like [City Name] or [Complainant].

Format the response as:
CATEGORY: [Category in English]
---
[Full complaint letter in English based on user's actual text]`;
    }
  }

  private parseResponse(responseText: string, transcribedText: string, language: string): {
    complaint_text: string;
    category: string;
    details: ComplaintDetails;
  } {
    const lines = responseText.split('\n');
    let category = 'Other';
    let complaintText = responseText;

    // Try to extract category
    const categoryMatch = responseText.match(/CATEGORY:\s*(.+)/i);
    if (categoryMatch) {
      category = categoryMatch[1].trim();
      // Remove the category line from complaint text
      complaintText = responseText.replace(/CATEGORY:.+\n---\n/i, '').trim();
    }

    const now = new Date();
    const complaintId = this.generateComplaintId();

    // Format the final complaint with header
    const formattedComplaint = language === 'ta' 
      ? this.formatTamilComplaint(complaintId, category, complaintText, now)
      : this.formatEnglishComplaint(complaintId, category, complaintText, now);

    return {
      complaint_text: formattedComplaint,
      category,
      details: {
        category,
        description: transcribedText,
        timestamp: now.toISOString(),
        language,
      },
    };
  }

  private formatEnglishComplaint(id: string, category: string, content: string, date: Date): string {
    return `═══════════════════════════════════════════════════
                    COMPLAINT LETTER
═══════════════════════════════════════════════════

Complaint ID: ${id}
Date: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
Category: ${category}

═══════════════════════════════════════════════════

${content}

═══════════════════════════════════════════════════
Status: PENDING REVIEW
═══════════════════════════════════════════════════`;
  }

  private formatTamilComplaint(id: string, category: string, content: string, date: Date): string {
    return `═══════════════════════════════════════════════════
                    புகார் கடிதம்
═══════════════════════════════════════════════════

புகார் எண்: ${id}
தேதி: ${date.toLocaleDateString('ta-IN')}
நேரம்: ${date.toLocaleTimeString('ta-IN', { hour: '2-digit', minute: '2-digit' })}
வகை: ${category}

═══════════════════════════════════════════════════

${content}

═══════════════════════════════════════════════════
நிலை: மதிப்பாய்வு நிலுவையில் உள்ளது
═══════════════════════════════════════════════════`;
  }

  private generateTemplateComplaint(transcribedText: string, language: string): {
    complaint_text: string;
    category: string;
    details: ComplaintDetails;
  } {
    const category = this.detectCategory(transcribedText, language);
    const now = new Date();
    const complaintId = this.generateComplaintId();

    const complaintText = language === 'ta'
      ? this.generateTamilTemplate(complaintId, category, transcribedText, now)
      : this.generateEnglishTemplate(complaintId, category, transcribedText, now);

    return {
      complaint_text: complaintText,
      category,
      details: {
        category,
        description: transcribedText,
        timestamp: now.toISOString(),
        language,
      },
    };
  }

  private detectCategory(text: string, language: string): string {
    const textLower = text.toLowerCase();
    
    const categories = {
      en: [
        { keywords: ['water', 'supply', 'tap'], name: 'Water Supply' },
        { keywords: ['electricity', 'power', 'current'], name: 'Electricity' },
        { keywords: ['road', 'street', 'pothole'], name: 'Road' },
        { keywords: ['garbage', 'waste', 'trash'], name: 'Garbage' },
        { keywords: ['drainage', 'sewage', 'drain'], name: 'Drainage' },
        { keywords: ['light', 'lamp', 'street light'], name: 'Street Light' },
      ],
      ta: [
        { keywords: ['தண்ணீர்', 'குழாய்'], name: 'தண்ணீர்' },
        { keywords: ['மின்சாரம்', 'கரண்ட்'], name: 'மின்சாரம்' },
        { keywords: ['சாலை', 'தெரு'], name: 'சாலை' },
        { keywords: ['குப்பை', 'கழிவு'], name: 'குப்பை' },
        { keywords: ['வடிகால்', 'சாக்கடை'], name: 'வடிகால்' },
        { keywords: ['விளக்கு', 'தெரு விளக்கு'], name: 'தெரு விளக்கு' },
      ],
    };

    const categoryList = categories[language as 'en' | 'ta'] || categories.en;
    
    for (const cat of categoryList) {
      if (cat.keywords.some(keyword => textLower.includes(keyword))) {
        return cat.name;
      }
    }

    return language === 'ta' ? 'பிற' : 'Other';
  }

  private generateEnglishTemplate(id: string, category: string, description: string, date: Date): string {
    return `═══════════════════════════════════════════════════
                    COMPLAINT LETTER
═══════════════════════════════════════════════════

Complaint ID: ${id}
Date: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
Category: ${category}

═══════════════════════════════════════════════════

To,
The Municipal Corporation Officer

Subject: Complaint Regarding ${category}

Dear Sir/Madam,

I would like to bring to your attention the following matter:

${description}

I kindly request you to look into this matter urgently and take necessary action to resolve this issue at the earliest possible time.

Thank you for your attention to this matter.

Yours sincerely,
Concerned Citizen

═══════════════════════════════════════════════════
Status: PENDING REVIEW
═══════════════════════════════════════════════════`;
  }

  private generateTamilTemplate(id: string, category: string, description: string, date: Date): string {
    return `═══════════════════════════════════════════════════
                    புகார் கடிதம்
═══════════════════════════════════════════════════

புகார் எண்: ${id}
தேதி: ${date.toLocaleDateString('ta-IN')}
நேரம்: ${date.toLocaleTimeString('ta-IN', { hour: '2-digit', minute: '2-digit' })}
வகை: ${category}

═══════════════════════════════════════════════════

பெறுநர்,
நகராட்சி அதிகாரி

பொருள்: ${category} தொடர்பான புகார்

அன்புள்ள ஐயா/அம்மா,

பின்வரும் விஷயத்தை உங்கள் கவனத்திற்கு கொண்டு வர விரும்புகிறேன்:

${description}

இந்த விஷயத்தை அவசரமாக பார்த்து தேவையான நடவடிக்கை எடுக்க வேண்டுகிறேன்.

உங்கள் கவனத்திற்கு நன்றி.

இவர்கள் சார்பில்,
புகார்தாரர்

═══════════════════════════════════════════════════
நிலை: மதிப்பாய்வு நிலுவையில் உள்ளது
═══════════════════════════════════════════════════`;
  }

  private generateComplaintId(): string {
    return 'CMP' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
}
