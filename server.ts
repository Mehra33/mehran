import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy init Gemini client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error("Failed to initialize Gemini AI client:", e);
    }
  }
  return genAI;
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "Daya Wholesale Electronics API",
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Electronics Cross-Reference & Technical Advisor Endpoint
app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { query, partNumber, category, role } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.json({
        fallback: true,
        answer: getFallbackAdvisorResponse(query, partNumber),
      });
    }

    const prompt = `You are the lead Senior Electronics Hardware & Component Sourcing Specialist at "Daya Electronics" (فروشگاه و تامین‌کننده قطعات الکترونیک دایا).
User Role: ${role || "Electronics Engineer / Hardware Manufacturer"}
Category: ${category || "General Electronics Components"}
Part Number / Topic: ${partNumber || "Not specified"}
User Question: "${query}"

Please provide a highly professional, accurate, and actionable technical and wholesale sourcing response in Persian (فارسی).
Include:
1. Technical specifications / Pin compatibility.
2. Recommended drop-in alternatives (جایگزین‌های مناسب و پین به پین، مثلا چیپ‌های ارزان‌تر یا در دسترس‌تر مانند GD32 vs STM32 یا CH340 vs FT232R).
3. Wholesale packaging advice (قرقره ۵۰۰۰ تایی Tape & Reel، سینی Tray، خرید تعدادی Cut Tape).
4. Storage & ESD / Solder profile considerations if relevant.
5. Sourcing tip for Iran market (انبار تهران vs تحویل مستقیم شنژن چین).

Format with clean bullet points and clear Markdown.`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      fallback: false,
      answer: response.text || "پاسخی دریافت نشد.",
    });
  } catch (error: any) {
    console.error("AI Advisor error:", error);
    res.json({
      fallback: true,
      answer: getFallbackAdvisorResponse(req.body.query, req.body.partNumber),
    });
  }
});

function getFallbackAdvisorResponse(query: string = "", partNumber: string = ""): string {
  const q = (query + " " + partNumber).toLowerCase();
  if (q.includes("stm32") || q.includes("gd32")) {
    return `### پیشنهاد فنی دایا برای سری STM32 / GD32:
- **جایگزین‌های پین به پین (Drop-in Replacement):**
  - سری **GD32F103C8T6** از برند GigaDevice با فرکانس کاری بالاتر (۱۰۸MHz در برابر ۷۲MHz) و سازگاری کامل کد و پین با STM32F103C8T6.
  - سری **CH32F103** از برند WCH به عنوان گزینه بسیار اقتصادی برای تیراژ بالا.
- **توصیه سفارش عمده (B2B):**
  - بسته‌بندی ریل کامل (Reel) ۲۵۰۰ عددی شامل تخفیف ۲۲٪ نسبت به خرید خرد است.
  - موجودی انبار تهران: آماده تحویل فوری / سفارش بالای ۱۰,۰۰۰ عدد: واردات مستقیم از شنژن طی ۱۲ الی ۱۸ روز کاری با فاکتور رسمی.`;
  } else if (q.includes("esp32") || q.includes("esp8266")) {
    return `### راهنمای تامین و مشخصات سری ESP32 در دایا:
- **مدل‌های پیشنهادی:**
  - **ESP32-WROOM-32E / ESP32-WROOM-32UE** با فلش ۴ مگابایت اورجینال Espressif با استاندارد CE/FCC.
  - **ESP32-C3** (بر پایه RISC-V) با مصرف انرژی بسیار کمتر برای پروژه‌های IoT مبتنی بر باتری.
- **شرایط خرید تیراژ بالا:**
  - ریل‌های ۶۵۰ عددی ضد رطوبت (Moisture Barrier Bag با کارت HIC).
  - امکان ارائه برگه آزمون اصالت (CoC) و تاییدیه کارخانه.`;
  }
  return `### راهنمای مهندسی و تامین قطعات دایا:
- قطعه درخواستی شما بررسی گردید. برای این دسته، بسته‌بندی استاندارد SMD قرقره‌های ۲۰۰۰ تا ۵۰۰۰ تایی و برای قطعات THT بسته‌بندی Tube یا جعبه‌ای پیشنهاد می‌شود.
- در دایا الکترونیک، کلیه قطعات اکتیو و پسیو دارای ضمانت اصالت فیزیکی و تست نمونه اولیه قبل از ثبت فاکتور نهایی هستند.
- در صورت نیاز به استعلام قیمت بر اساس لیست کامل BOM، می‌توانید فایل اکسل یا لیست قطعات خود را در تب «استعلام و تحلیل BOM» بارگذاری فرمایید.`;
}

async function startServer() {
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
    console.log(`Daya Electronics server running on http://localhost:${PORT}`);
  });
}

startServer();
