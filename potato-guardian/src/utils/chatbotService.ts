import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export class ChatbotService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private chat: any = null;

  constructor() {
    this.initializeService();
  }

  private initializeService() {
    if (!API_KEY) {
      console.warn('VITE_GEMINI_API_KEY is not defined in environment variables');
      return;
    }    try {
      this.genAI = new GoogleGenerativeAI(API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.resetChat();
    } catch (error) {
      console.error('Error initializing Gemini AI:', error);
    }
  }
  async sendMessage(message: string): Promise<string> {
    if (!this.genAI || !this.model) {
      throw new Error('Layanan chatbot belum diinisialisasi. Pastikan API key Gemini telah dikonfigurasi dengan benar.');
    }

    try {
      // Add context about potato disease detection
      const contextMessage = `Kamu adalah asisten AI yang membantu dalam deteksi penyakit daun kentang. 
      Kamu dapat memberikan informasi tentang:
      - Penyakit-penyakit yang menyerang daun kentang (Early Blight, Late Blight)
      - Cara pencegahan dan pengobatan penyakit kentang
      - Tips perawatan tanaman kentang
      - Interpretasi hasil deteksi penyakit
      - Praktik pertanian yang baik untuk kentang
      
      Berikan jawaban dalam bahasa Indonesia yang mudah dipahami dan tidak terlalu panjang.
      
      Pertanyaan pengguna: ${message}`;

      const result = await this.chat.sendMessage(contextMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('API key tidak valid. Silakan periksa konfigurasi API key Gemini.');
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error('Kuota API telah habis. Silakan coba lagi nanti.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
        } else if (error.message.includes('model') || error.message.includes('not found')) {
          throw new Error('Model AI tidak tersedia. Silakan coba lagi nanti.');
        }
      }
      
      throw new Error('Gagal mengirim pesan ke chatbot. Silakan coba lagi.');
    }
  }

  async resetChat(): Promise<void> {
    if (!this.model) {
      throw new Error('Layanan chatbot belum diinisialisasi.');
    }

    try {
      this.chat = this.model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });
    } catch (error) {
      console.error('Error resetting chat:', error);
      throw new Error('Gagal mereset percakapan.');
    }
  }

  isServiceAvailable(): boolean {
    return !!(this.genAI && this.model && API_KEY);
  }
}

export const chatbotService = new ChatbotService();
