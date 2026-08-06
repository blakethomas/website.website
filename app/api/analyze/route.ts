import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

type Report={domain:string;confession:string;therapist:string;personality:string;strengths:string[];insecurities:string[];recommendation:string;affirmation:string;scores:{confidence:number;hoverAnxiety:number;emotionalBaggage:number;semanticHealing:number}};
const cache=new Map<string,Report>();
const famous:Record<string,Partial<Report>>={
'google.com':{confession:'I know everything. Nobody asks how I am doing.',personality:'Omniscient people-pleaser'},
'craigslist.org':{confession:'No. I will not round my corners.',personality:'Radically secure minimalist'},
'wikipedia.org':{confession:'People only visit me to settle arguments.',personality:'Exhausted family mediator'},
'youtube.com':{confession:'I think people only tolerate my ads.',personality:'Entertainer with monetization anxiety'},
'reddit.com':{confession:'Everyone thinks I am the problem.',personality:'Chaotic community organizer'},
'myspace.com':{confession:'People say they miss me, but they never visit.',personality:'Retired scene legend'}
};
function hash(s:string){return [...s].reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0)}
function fallback(domain:string):Report{const n=Math.abs(hash(domain));const p=famous[domain]||{};return {domain,confession:p.confession||`I worry people only remember me when they need something.`,therapist:'That sounds exhausting. You are allowed to exist without converting anyone.',personality:p.personality||['Quiet overachiever','Digitally avoidant visionary','Responsive people-pleaser','High-functioning collection of divs'][n%4],strengths:['Shows up on every screen','Communicates under pressure','Still believes in hyperlinks'],insecurities:['Unresolved hover feelings','Compares itself to prettier homepages','Carries old CSS into new relationships'],recommendation:'Schedule one afternoon with no analytics, popups, or conversion goals.',affirmation:`${domain} is more than its Lighthouse score.`,scores:{confidence:62+n%31,hoverAnxiety:18+n%58,emotionalBaggage:24+n%66,semanticHealing:55+n%41}}}
export async function POST(req:NextRequest){try{const {url}=await req.json();let domain=new URL(/^https?:\/\//.test(url)?url:`https://${url}`).hostname.replace(/^www\./,'').toLowerCase();if(cache.has(domain))return NextResponse.json({...cache.get(domain),cached:true});let report=fallback(domain);if(process.env.OPENAI_API_KEY){const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});const response=await client.responses.create({model:process.env.OPENAI_MODEL||'gpt-5.6-luna',max_output_tokens:260,input:`You are a deadpan therapist who speaks only to websites. Return JSON only. Analyze ${domain}. Keep every string under 18 words. Schema: confession, therapist, personality, strengths (3), insecurities (3), recommendation, affirmation. Tasteful, specific, warm, absurd. Never mention the human.`});try{const ai=JSON.parse(response.output_text);report={...report,...ai,domain,scores:report.scores}}catch{}}
cache.set(domain,report);return NextResponse.json(report)}catch{return NextResponse.json({error:'Please enter a valid domain.'},{status:400})}}
