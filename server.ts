import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client lazily/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
    }
    return new GoogleGenAI({
      apiKey: apiKey || "dummy-key",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API 1: AI Log Threat Analysis & Playbook Generator (Module 7)
  app.post("/api/ai/analyze-log", async (req, res) => {
    try {
      const { rawMessage, category, sourceIp, destinationIp, user, port, riskScore } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: false,
          fallbackMessage: "Gemini API key is not configured. Falling back to local heuristic analysis.",
          summary: `High priority ${category} security event involving ${user} from ${sourceIp}.`,
          iocList: [sourceIp, `Port ${port}`, rawMessage.substring(0, 40)],
          recommendedPlaybook: [
            { step: 1, action: `Isolate source IP ${sourceIp} from corporate VLAN.` },
            { step: 2, action: `Revoke active sessions for user ${user}.` },
            { step: 3, action: `Capture full packet capture (PCAP) for port ${port}.` }
          ]
        });
      }

      const ai = getGenAI();
      const prompt = `You are a Senior Security Operations Center (SOC) Lead Analyst and Incident Commander.
Analyze the following cybersecurity security log and generate a structured JSON incident report:

Security Log Context:
- Raw Log Message: "${rawMessage}"
- Category: ${category}
- Source IP: ${sourceIp} -> Destination IP: ${destinationIp}
- Targeted User Account: ${user}
- Target Port: ${port}
- Risk Score: ${riskScore}/100

Respond strictly in valid JSON format matching this schema:
{
  "threatTitle": "Short descriptive title of threat",
  "threatType": "Type of cyber attack (e.g. Ransomware, Phishing, SSH Brute Force, DNS Tunneling, Kerberoasting, C2 Beacon)",
  "mitreAttackTechnique": "MITRE ATT&CK ID & Name (e.g. T1059.001 PowerShell)",
  "summary": "2-3 sentence executive summary of the event",
  "confidence": number between 0 and 100,
  "indicatorsOfCompromise": ["list of IOC strings e.g. IP, registry key, process name, hash"],
  "explainableAiAnalysis": "Step-by-step breakdown explaining why this log was flagged and why it poses a threat",
  "guidedPlaybook": [
    {
      "step": 1,
      "phase": "Containment",
      "action": "Immediate action needed",
      "command": "Example shell/CLI command to remediate"
    },
    {
      "step": 2,
      "phase": "Eradication",
      "action": "Action to eliminate threat",
      "command": "Example command"
    },
    {
      "step": 3,
      "phase": "Recovery",
      "action": "Action to restore normal operation",
      "command": "Example command"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json({ success: true, data: parsedData });
    } catch (error: any) {
      console.error("Error in /api/ai/analyze-log:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to analyze security log with Gemini AI"
      });
    }
  });

  // API 2: AI Phishing Deep Analyzer (Module 2 & 7)
  app.post("/api/ai/analyze-phishing", async (req, res) => {
    try {
      const { sender, subject, body, headers } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: false,
          fallbackMessage: "Gemini API key not found. Generated heuristic analysis.",
          analysis: "Potential phishing attempt detected due to urgency keywords and unverified sender domain."
        });
      }

      const ai = getGenAI();
      const prompt = `You are a Cybersecurity Mail Security & NLP Expert. 
Analyze the following email for phishing, spoofing, BEC (Business Email Compromise), and malicious payload links:

Email Details:
Sender: ${sender}
Subject: ${subject}
Headers: ${headers || 'N/A'}
Body Content:
"""
${body}
"""

Return JSON format:
{
  "isPhishing": boolean,
  "confidence": number (0-100),
  "attackCategory": "Spear Phishing / CEO Fraud / Password Reset Spoof / Malicious Attachment / Legitimate",
  "urgencyScore": number (0-100),
  "impersonatedBrand": "Brand being impersonated or None",
  "suspiciousElements": ["list of red flags found in text/headers"],
  "headerVerdict": "SPF/DKIM/Domain Analysis Summary",
  "detailedExplanation": "Technical narrative of the attack vector and social engineering tactics used",
  "remediationSteps": ["Action 1", "Action 2", "Action 3"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const data = JSON.parse(response.text || "{}");
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Error in /api/ai/analyze-phishing:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API 3: SOC Conversational Assistant (Module 7)
  app.post("/api/ai/chat-assistant", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: false,
          reply: "AegisSOC AI Assistant: I am operating in offline simulation mode because GEMINI_API_KEY is not set. I can assist with standard SIEM triage, MITRE ATT&CK lookup, and incident playbooks."
        });
      }

      const ai = getGenAI();
      const systemInstruction = `You are AegisSOC AI, a senior Tier 3 Cyber Threat Intelligence Expert and Security Analyst.
Answer security questions with clear, actionable technical detail. Reference MITRE ATT&CK framework IDs, NIST SP 800-61 incident response guidelines, Snort/YARA signatures, and PowerShell/Linux shell commands when helpful. Keep responses well-formatted with markdown, bold highlights, and code blocks.`;

      const contents = [
        { role: 'user', parts: [{ text: systemInstruction }] },
        ...(conversationHistory || []).map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents as any,
      });

      res.json({ success: true, reply: response.text });
    } catch (error: any) {
      console.error("Error in /api/ai/chat-assistant:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for dev / production static serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AegisSOC Cyber Defense Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
