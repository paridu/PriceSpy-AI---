
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Competitor } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * สกัดข้อมูลราคาจาก HTML หรือข้อความโดยใช้ AI
   */
  async extractPrice(htmlSnippet: string): Promise<number | null> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `สกัดราคาที่เป็นตัวเลขจากข้อความหรือ HTML ต่อไปนี้ ส่งคืนเฉพาะตัวเลขเท่านั้น หากไม่พบราคา ให้ส่งคืน 0. ข้อความ: "${htmlSnippet}"`,
        config: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    price: { type: Type.NUMBER }
                }
            }
        }
      });
      
      const data = JSON.parse(response.text || '{"price": 0}');
      return data.price > 0 ? data.price : null;
    } catch (error) {
      console.error("Error extracting price:", error);
      return null;
    }
  },

  /**
   * สร้างกลยุทธ์การตลาดตามข้อมูลราคาคู่แข่งปัจจุบัน
   */
  async generateStrategy(product: Product): Promise<string> {
    const competitorSummary = product.competitors
      .map(c => `${c.name}: ฿${c.currentPrice} (ราคาเดิม: ฿${c.lastPrice})`)
      .join(", ");

    const prompt = `
      สินค้า: ${product.name}
      ราคาปัจจุบันของฉัน: ฿${product.myPrice}
      ราคาคู่แข่ง: ${competitorSummary}
      
      สวมบทบาทเป็นผู้เชี่ยวชาญด้านกลยุทธ์การตั้งราคาอีคอมเมิร์ซอาวุโส 
      จากข้อมูลนี้ ให้คำแนะนำสั้นๆ 3 ประโยคสำหรับกลยุทธ์ราคาของฉัน 
      ควรลดราคาหรือไม่? ควรจัดชุดโปรโมชั่น? หรือคงราคาเดิมไว้เพราะมูลค่าแบรนด์?
      ตอบเป็นภาษาไทยเท่านั้น โดยใช้โทนที่เป็นมืออาชีพและเข้าใจง่าย
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "คุณคือที่ปรึกษาด้านกลยุทธ์ราคา (Pricing Strategist) ผู้เชี่ยวชาญในตลาดอีคอมเมิร์ซไทย",
        }
      });
      return response.text || "ไม่สามารถสร้างกลยุทธ์ได้ในขณะนี้";
    } catch (error) {
      console.error("Error generating strategy:", error);
      return "เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อกับที่ปรึกษา AI ได้";
    }
  }
};
