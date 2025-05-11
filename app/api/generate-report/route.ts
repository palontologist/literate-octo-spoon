import { NextResponse } from "next/server";
import Groq from 'groq-sdk';


// Initialize AI models
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Add default data structure
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEFAULT_METRICS = {
  environmental: {
    emissions: 10000,
    renewableEnergy: 35,
    financedEmissions: 2.5,
    greenFinancingRatio: 25,
    climateRisk: 20
  },
  social: {
    financialInclusion: 15,
    genderPayGap: 0.85,
    trainingHours: 30
  },
  governance: {
    boardDiversity: 30,
    dataQuality: 90
  },
  issb: {
    climateVulnerability: 25
  }
};

const SYSTEM_PROMPT = `
You are Bank of America's ESG report generation assistant. Your task is to:

1. Analyze provided ESG metrics data
2. Generate a professional report with:
   - Executive summary
   - Financial ESG metrics analysis
   - SDG alignment mapping
   - Visual data representations (use {{IMAGE:filename.png}} placeholders)
   - Risk assessment and recommendations

Required elements:
- GRI Standards compliance
- SASB materiality assessment
- TCFD climate risk analysis
- Integrated text and image blocks
- At least 3 data visualizations
- Key performance indicators table
- 12-month sustainability roadmap
`;

export async function POST(req: Request) {
  try {
    const { metrics } = await req.json(); // Receive dashboard metrics
    
    const reportPrompt = `
    Generate ESG report for Q3 2024 using these metrics:
    ${JSON.stringify(metrics, null, 2)}
    
    Include visualizations for:
    1. Emissions trajectory
    2. Diversity ratios
    3. Climate risk exposure
    `;

    const response = await client.chat.completions.create({
      messages: [
        { 
          role: 'system',
          content: SYSTEM_PROMPT
        },
        { 
          role: 'user',
          content: reportPrompt
        }
      ],
      model: 'allam-2-7b',
      temperature: 0.3,
      max_tokens: 4096
    });

    const reportContent = response.choices[0].message.content;
    return NextResponse.json({ report: reportContent });
    
  } catch (error) {
    console.error('ESG report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ESG report' }, 
      { status: 500 }
    );
  }
}
