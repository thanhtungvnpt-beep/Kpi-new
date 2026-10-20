import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAction?: (actionText: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  action?: string;
  time: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onApplyAction,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Xin chào! Tôi là VOMS AI Assistant. Dựa trên dữ liệu thời gian thực hiện tại:\n• KTECH đang gặp sự cố dừng máy Line 6.\n• DREAM TECH trễ linh kiện PCB 4 tiếng.\n• Đề xuất chuyển 2,000 pcs sang HSTEC để đảm bảo tiến độ giao hàng.',
      action: 'Reallocate 2,000 pcs from DREAM TECH to HSTEC',
      time: '14:30',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Domain AI response simulation
    setTimeout(() => {
      let reply = 'Hệ thống đã ghi nhận yêu cầu và đang phân tích dữ liệu GMES...';
      const lower = userMsg.text.toLowerCase();

      if (lower.includes('dream') || lower.includes('trễ') || lower.includes('chậm')) {
        reply = 'DREAM TECH đang gặp chậm trễ giao hàng 6% do thiếu hụt linh kiện từ nhà cung cấp phụ cấp 2. Dự kiến lô hàng bổ sung sẽ đến lúc 18:00 hôm nay.';
      } else if (lower.includes('ktech') || lower.includes('máy') || lower.includes('stop')) {
        reply = 'KTECH Line 6 đang dừng máy do lỗi hệ thống thủy lực chiller. Đã có phiếu duyệt mua chiller mới đang chờ Factory Manager phê duyệt (#1).';
      } else if (lower.includes('hstec') || lower.includes('sản xuất')) {
        reply = 'HSTEC đang có hiệu suất sản xuất đạt 96.4%, chất lượng 98.9%. HSTEC có dư công suất 12% sẵn sàng nhận thêm 2,000 pcs tái phân bổ.';
      } else {
        reply = `Phân tích cho "${userMsg.text}": Tất cả 6 đối tác đang kết nối đồng bộ với hệ thống điều hành GMES. 3/6 đạt chuẩn On Track, 2 nhà máy cần cảnh báo At Risk, và 1 Critical tại KTECH.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-4 bg-[#0c1527] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>VOMS AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400">
                Vendor Operations Intelligent Copilot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl shadow-2xs whitespace-pre-line leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                {m.text}

                {m.action && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-purple-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      Hành động đề xuất tự động:
                    </span>
                    <button
                      onClick={() => onApplyAction?.(m.action!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Thực hiện: {m.action}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setInputText('Kiểm tra nguyên nhân KTECH dừng máy')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap transition-colors"
            >
              🔍 KTECH dừng máy
            </button>
            <button
              onClick={() => setInputText('Tại sao DREAM TECH giảm tiến độ?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap transition-colors"
            >
              ⚠️ DREAM TECH trễ vật tư
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about VOMS operations..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
