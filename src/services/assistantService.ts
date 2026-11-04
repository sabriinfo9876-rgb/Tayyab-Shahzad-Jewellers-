import { Product } from "../types";
import { DemoStorage } from "./storage";

export interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  suggestedProducts?: Product[];
  whatsappPrompt?: string;
  timestamp: string;
}

export interface AssistantServiceInterface {
  sendMessage(userQuery: string): Promise<AssistantMessage>;
}

/**
 * Scripted Assistant Adapter for Tayyab Shahzad Jewellers Demo.
 *
 * ARCHITECTURE NOTE:
 * This is a scripted frontend preview adapter designed to simulate intelligent jewellery consultation.
 * Real Groq / LLM integration requires a backend endpoint (e.g. Express / Cloud Run proxy) to safely
 * protect API secrets from the client bundle. This adapter follows the AssistantServiceInterface
 * contract so it can be swapped with a server-side proxy endpoint without altering the UI component.
 */
export class ScriptedAssistantService implements AssistantServiceInterface {
  async sendMessage(userQuery: string): Promise<AssistantMessage> {
    // Artificial small human-like delay for demonstration realism (300-600ms)
    await new Promise((resolve) => setTimeout(resolve, 450));

    const q = userQuery.toLowerCase().trim();
    const allProducts = DemoStorage.getProducts().filter((p) => p.published);
    const settings = DemoStorage.getSettings();

    // 1. Bridal intent
    if (
      q.includes("bridal") ||
      q.includes("dulhan") ||
      q.includes("wedding") ||
      q.includes("shaadi") ||
      q.includes("haar") ||
      q.includes("barat")
    ) {
      const bridalProducts = allProducts
        .filter(
          (p) => p.department === "Bridal" || p.collections.includes("bridal"),
        )
        .slice(0, 2);
      return {
        id: "msg-" + Date.now(),
        sender: "assistant",
        text: `Assalam-o-Alaikum! Our bridal suite features imperial handcrafted Kundan haars, royal chokers, and bespoke matching accessories. Each piece is crafted in pure gold with natural stones. / Humari bridal collection mein traditional Kundan haars aur royal chokers shamil hain jo bridal day ko khas banatay hain.`,
        suggestedProducts: bridalProducts,
        whatsappPrompt: `I would like to explore your Bridal Collection details.`,
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Bangles intent
    if (
      q.includes("bangle") ||
      q.includes("kada") ||
      q.includes("churi") ||
      q.includes("kanggan") ||
      q.includes("kangan") ||
      q.includes("cuff")
    ) {
      const bangles = allProducts
        .filter((p) => p.category === "bangles")
        .slice(0, 2);
      return {
        id: "msg-" + Date.now(),
        sender: "assistant",
        text: `We specialize in hand-carved Nakshi gold kadas, traditional Pakistani Chandi silver bangles, and sleek Italian mesh cuffs. / Aap gold kadas, traditional silver chandi kangan ya Italian bracelets dekh saktay hain.`,
        suggestedProducts: bangles,
        whatsappPrompt: `I would like to enquire about your gold and silver bangles.`,
        timestamp: new Date().toISOString(),
      };
    }

    // 3. Rings intent
    if (
      q.includes("ring") ||
      q.includes("angothi") ||
      q.includes("chhallah") ||
      q.includes("solitaire") ||
      q.includes("band")
    ) {
      const rings = allProducts
        .filter((p) => p.category === "rings")
        .slice(0, 2);
      return {
        id: "msg-" + Date.now(),
        sender: "assistant",
        text: `From Mughal filigree statement rings to emerald halos and Italian gold bands, all rings are individually handcrafted. / Humari rings collection mein traditional filigree aur modern designs dono dastiyab hain.`,
        suggestedProducts: rings,
        whatsappPrompt: `I would like details regarding your ring collection.`,
        timestamp: new Date().toISOString(),
      };
    }

    // 4. Pakistani Chandi intent
    if (
      q.includes("chandi") ||
      q.includes("silver") ||
      q.includes("925") ||
      q.includes("payal")
    ) {
      const chandi = allProducts
        .filter((p) => p.department === "Pakistani Chandi")
        .slice(0, 2);
      return {
        id: "msg-" + Date.now(),
        sender: "assistant",
        text: `Tayyab Shahzad Jewellers takes pride in authentic Pakistani Chandi (925 sterling silver), featuring antique oxidized chokers, payals, and heritage polki crafts. / Humari Pakistani Chandi collection 925 fine silver mein crafted hai with authentic heritage designs.`,
        suggestedProducts: chandi,
        whatsappPrompt: `I would like to see your Pakistani Chandi silver collection.`,
        timestamp: new Date().toISOString(),
      };
    }

    // 5. Italian Designs intent
    if (
      q.includes("italian") ||
      q.includes("italy") ||
      q.includes("modern") ||
      q.includes("chain") ||
      q.includes("mesh")
    ) {
      const italian = allProducts
        .filter((p) => p.department === "Italian Designs")
        .slice(0, 2);
      return {
        id: "msg-" + Date.now(),
        sender: "assistant",
        text: `Our Italian Designs showcase contemporary 18K yellow gold craftsmanship, flexible woven tubular mesh cuffs, and precision geometric collars. / European finish aur lightweight modern Italian gold jewellery yahan dastiyab hai.`,
        suggestedProducts: italian,
        whatsappPrompt: `I am interested in exploring your Italian gold designs.`,
        timestamp: new Date().toISOString(),
      };
    }

    // 6. Custom Orders intent
    if (
      q.includes("custom") ||
      q.includes("bespoke") ||
      q.includes("order") ||
      q.includes("banwana") ||
      q.includes("design") ||
      q.includes("sketch") ||
      q.includes("apna")
    ) {
      const customPieces = allProducts
        .filter((p) => p.department === "Custom Orders")
        .slice(0, 1);
      return {
        id: "msg-" + Date.now(),
        sender: "assistant",
        text: `Yes! We create bespoke custom jewellery from your photos, sketches, or bridal outfit embroidery. You can share reference pictures and specifications with our master goldsmiths directly. / Aap apna pasandeeda design picture ya sketch share kar ke tayyar karwa saktay hain.`,
        suggestedProducts: customPieces,
        whatsappPrompt: `I want to discuss a custom jewellery order with your team.`,
        timestamp: new Date().toISOString(),
      };
    }

    // 7. Metal rates intent
    if (
      q.includes("rate") ||
      q.includes("bhav") ||
      q.includes("qemat") ||
      q.includes("gold rate") ||
      q.includes("tola") ||
      q.includes("sone ka")
    ) {
      const rates = DemoStorage.getRates();
      const gold24k =
        rates.rates.find((r) => r.metal.includes("24K"))?.ratePKR || 285000;
      const gold22k =
        rates.rates.find((r) => r.metal.includes("22K"))?.ratePKR || 261250;
      return {
        id: "msg-" + Date.now(),
        sender: "assistant",
        text: `Indicative Demo Sarafa Bullion Rates (${rates.lastUpdatedKarachi}): 24K Gold is approx PKR ${gold24k.toLocaleString()} / tola, and 22K Jewellery Gold is approx PKR ${gold22k.toLocaleString()} / tola. Please contact our team directly for today's final quote.`,
        whatsappPrompt: `Assalam-o-Alaikum, please confirm today's live gold rate and making charges.`,
        timestamp: new Date().toISOString(),
      };
    }

    // 8. Contact intent
    if (
      q.includes("contact") ||
      q.includes("phone") ||
      q.includes("number") ||
      q.includes("whatsapp") ||
      q.includes("tiktok") ||
      q.includes("rabta")
    ) {
      return {
        id: "msg-" + Date.now(),
        sender: "assistant",
        text: `You can reach Tayyab Shahzad Jewellers directly via phone or WhatsApp at ${settings.phone} (${settings.internationalPhone}), or browse our TikTok showcase at @tayyab.shahzad.jewellers. / Aap direct WhatsApp par rabta kar saktay hain.`,
        whatsappPrompt: `Assalam-o-Alaikum Tayyab Shahzad Jewellers, I would like to get in touch.`,
        timestamp: new Date().toISOString(),
      };
    }

    // Fallback: Honest assistance
    return {
      id: "msg-" + Date.now(),
      sender: "assistant",
      text: `This is a demo assistant for Tayyab Shahzad Jewellers. Our master craftsmen and sales team can assist you directly on WhatsApp with customized inquiries, live viewings, or specific pieces. / Humari team se WhatsApp par direct rabta kar saktay hain: ${settings.phone}.`,
      whatsappPrompt: `Assalam-o-Alaikum, I have an inquiry about jewellery shown on your website.`,
      timestamp: new Date().toISOString(),
    };
  }
}

export const assistantService = new ScriptedAssistantService();
