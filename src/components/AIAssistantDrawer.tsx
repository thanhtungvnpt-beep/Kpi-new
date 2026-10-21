import React, { useState } from 'react';
import {
  X,
  Send,
  Bot,
  Sparkles,
  ArrowRight,
  Maximize2,
  Minimize2,
  Code2,
  Terminal,
  Database,
  FileCode,
  Braces,
  RotateCcw,
  BrainCircuit,
} from 'lucide-react';
import { CodeSnippetBlock } from './CodeSnippetBlock';

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

// Helper to render message text with inline markdown formatting (bold, inline code, bullets)
const renderInlineFormattedText = (text: string) => {
  // Split lines
  const lines = text.split('\n');

  return lines.map((line, lIdx) => {
    // Check if line is a bullet point
    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
    const lineContent = isBullet ? line.trim().replace(/^[•-]\s*/, '') : line;

    // Split line by inline code `...`
    const parts = lineContent.split(/(`[^`]+`)/g);

    const formattedParts = parts.map((part, pIdx) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        const codeText = part.slice(1, -1);
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px] border border-slate-700/60"
          >
            {codeText}
          </code>
        );
      }

      // Format bold text **bold**
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 4) {
          return (
            <strong key={`${pIdx}-${bIdx}`} className="font-semibold text-slate-900">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return bPart;
      });
    });

    if (isBullet) {
      return (
        <div key={lIdx} className="flex items-start gap-1.5 my-1">
          <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
          <span className="flex-1">{formattedParts}</span>
        </div>
      );
    }

    return (
      <div key={lIdx} className={line.trim() === '' ? 'h-2' : 'my-0.5'}>
        {formattedParts}
      </div>
    );
  });
};

// Parser to split message content into alternating text blocks and code blocks
const renderMessageContent = (content: string) => {
  // Regex to extract ```language\ncode```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore.trim()) {
      elements.push(
        <div key={`text-${lastIndex}`} className="text-slate-800 leading-relaxed text-xs">
          {renderInlineFormattedText(textBefore)}
        </div>
      );
    }

    const language = match[1] || 'sql';
    const code = match[2];
    elements.push(
      <CodeSnippetBlock
        key={`code-${match.index}`}
        code={code}
        language={language}
        filename={
          language === 'sql'
            ? 'query_quarantine.sql'
            : language === 'python'
            ? 'dti_evaluator.py'
            : language === 'json'
            ? 'validation_rule.json'
            : language === 'bash'
            ? 'connector_preflight.sh'
            : 'snippet.ts'
        }
      />
    );

    lastIndex = match.index + match[0].length;
  }

  const textAfter = content.substring(lastIndex);
  if (textAfter.trim()) {
    elements.push(
      <div key={`text-${lastIndex}`} className="text-slate-800 leading-relaxed text-xs">
        {renderInlineFormattedText(textAfter)}
      </div>
    );
  }

  // If no code blocks matched at all, render regular text
  if (elements.length === 0) {
    return (
      <div className="text-slate-800 leading-relaxed text-xs">
        {renderInlineFormattedText(content)}
      </div>
    );
  }

  return <div className="space-y-1.5">{elements}</div>;
};

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onApplyAction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Xin chào! Tôi là **VOMS Data Quality & Operations Copilot**. Hệ thống đang giám sát 6 nhà máy và luồng dữ liệu KPI thời gian thực:
• **KTECH**: Dừng máy Line 6 do lỗi chiller thủy lực.
• **DREAM TECH**: Trễ linh kiện PCB 4 tiếng.
• **Đề xuất**: Chuyển 2,000 pcs sang **HSTEC** để đảm bảo tiến độ giao hàng.

💡 *Dành cho Developer*: Bạn có thể yêu cầu tôi tạo truy vấn \`SQL\` đối soát, script \`Python\` tính DTI, cấu hình \`JSON\` rule schema, hoặc script \`cURL/Bash\` kiểm tra connector với tính năng sao chép 1-click!`,
      action: 'Reallocate 2,000 pcs from DREAM TECH to HSTEC',
      time: '14:30',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Domain AI response simulation with enterprise code generator
    setTimeout(() => {
      let reply = 'Hệ thống đã ghi nhận yêu cầu và đang phân tích dữ liệu GMES...';
      let suggestedAction: string | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('sql') || lower.includes('truy vấn') || lower.includes('quarantine') || lower.includes('cách ly')) {
        reply = `Dưới đây là câu lệnh **SQL** tối ưu để trích xuất các bản ghi đang bị cách ly ở mức độ nghiêm trọng \`CRITICAL\` và \`HIGH\` từ bảng đối soát phục vụ kiểm tra và phê duyệt:

\`\`\`sql
-- Truy vấn danh sách các bản ghi KPI bị cách ly cần duyệt khẩn cấp
SELECT 
  qp.record_id,
  qp.batch_id,
  qp.source_system,
  qp.kpi_code,
  qp.plant_id,
  qp.original_value,
  qp.normalized_value,
  qp.rule_id,
  qp.violation_desc,
  qp.severity,
  qp.detection_timestamp,
  qp.assigned_owner
FROM kpi_quarantine_pool qp
WHERE qp.resolution_status = 'PENDING'
  AND qp.severity IN ('CRITICAL', 'HIGH')
ORDER BY 
  CASE qp.severity 
    WHEN 'CRITICAL' THEN 1 
    WHEN 'HIGH' THEN 2 
    ELSE 3 
  END,
  qp.detection_timestamp DESC
LIMIT 50;
\`\`\`

Bạn có thể bấm **Sao chép** ở góc trên để dán trực tiếp vào Data Quality Console hoặc DBeaver / PGAdmin.`;
        suggestedAction = 'Xuất 50 bản ghi cách ly sang CSV';
      } else if (lower.includes('python') || lower.includes('dti') || lower.includes('tính toán dti')) {
        reply = `Dưới đây là mã nguồn **Python** tính toán chỉ số **Data Trust Index (DTI v2.1)** độc lập và kiểm định ngoại lai thống kê (Z-Score Outlier Detection):

\`\`\`python
import numpy as np
import pandas as pd

def compute_data_trust_index(df: pd.DataFrame, weights: dict = None) -> dict:
    """
    Tính toán Data Trust Index (DTI) cấp doanh nghiệp theo 5 chiều chất lượng:
    - Completeness (25%)
    - Validity (25%)
    - Timeliness (20%)
    - Uniqueness (15%)
    - Reconciliation (15%)
    """
    if weights is None:
        weights = {
            'completeness': 0.25,
            'validity': 0.25,
            'timeliness': 0.20,
            'uniqueness': 0.15,
            'reconciliation': 0.15,
        }

    # 1. Tỷ lệ đầy đủ dữ liệu (Không rỗng)
    completeness = 1.0 - (df.isnull().sum().sum() / df.size)

    # 2. Tỷ lệ tuân thủ schema và giới hạn vật lý
    validity = df['is_schema_valid'].mean() if 'is_schema_valid' in df else 0.98

    # 3. Tính duy nhất của Business Key
    uniqueness = df['source_record_id'].nunique() / len(df)

    # 4. Độ trễ đồng bộ (mục tiêu <= 300s)
    avg_latency = df['latency_seconds'].mean() if 'latency_seconds' in df else 45.0
    timeliness = max(0.0, min(1.0, 1.0 - (avg_latency / 1800.0)))

    # 5. Tỷ lệ đối soát khớp giữa Ingestion Staging và Authorized Store
    reconciliation = 0.992

    # Tổng hợp DTI có trọng số (0 - 100%)
    dti_score = (
        completeness * weights['completeness'] +
        validity * weights['validity'] +
        timeliness * weights['timeliness'] +
        uniqueness * weights['uniqueness'] +
        reconciliation * weights['reconciliation']
    ) * 100.0

    return {
        "dti_score": round(dti_score, 2),
        "sample_count": len(df),
        "status": "HEALTHY" if dti_score >= 90 else "WARNING",
        "formula_version": "VOMS_DTI_V2.1_ENTERPRISE"
    }
\`\`\`

Script này có thể chạy trong Apache Airflow DAG hoặc Jupyter Notebook định kỳ.`;
      } else if (lower.includes('json') || lower.includes('rule') || lower.includes('quy tắc') || lower.includes('schema')) {
        reply = `Dưới đây là cấu hình chuẩn **JSON Schema** cho một quy tắc nghiệp vụ trong **Validation Rules Catalog**:

\`\`\`json
{
  "rule_id": "RULE-PHY-001",
  "rule_name": "Kiểm tra giới hạn OEE vật lý (0% - 100%)",
  "domain": "PHYSICAL_LIMITS",
  "severity": "CRITICAL",
  "kpi_target": "OEE_OVERALL",
  "applies_to": {
    "sources": ["GMES", "IOT_GATEWAY"],
    "plants": ["ALL"]
  },
  "condition": {
    "operator": "BETWEEN",
    "field": "normalized_value",
    "min": 0.0,
    "max": 100.0
  },
  "thresholds": {
    "warning_min": 50.0,
    "warning_max": 99.8,
    "fail_min": 0.0,
    "fail_max": 100.0
  },
  "on_violation": {
    "action": "QUARANTINE_RECORD",
    "notify_channel": "SLACK_ALERTS_CRITICAL",
    "require_dual_approval": true
  },
  "is_active": true,
  "version": "v2.1.0",
  "effective_date": "2026-01-01"
}
\`\`\`

Bạn có thể chỉnh sửa các ngưỡng và nhập vào hệ thống qua tab **Validation Rules**.`;
      } else if (lower.includes('curl') || lower.includes('bash') || lower.includes('preflight') || lower.includes('api') || lower.includes('kết nối')) {
        reply = `Dưới đây là script **Bash / cURL** thực thi Preflight Check kiểm tra handshake kết nối thật với GMES Edge Gateway:

\`\`\`bash
#!/usr/bin/env bash
# VOMS GMES Edge Gateway Preflight Connectivity Verification
set -euo pipefail

GATEWAY_URL="https://gmes-gateway.voms.internal/v2/preflight"
API_KEY="env_voms_preflight_key_2026"

echo "==> [PREFLIGHT] Khởi tạo kiểm tra kết nối GMES Edge..."

HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "\${GATEWAY_URL}" \\
  -H "Authorization: Bearer \${API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "VOMS_CONTROL_TOWER_V2",
    "check_mode": "PING_SCHEMA_SAMPLE",
    "timeout_ms": 3000
  }')

HTTP_STATUS=$(echo "\${HTTP_RESPONSE}" | tail -n 1)
RESPONSE_BODY=$(echo "\${HTTP_RESPONSE}" | head -n -1)

if [ "\${HTTP_STATUS}" -eq 200 ]; then
  echo "✔ KẾT NỐI THÀNH CÔNG: HTTP \${HTTP_STATUS}"
  echo "Response payload: \${RESPONSE_BODY}"
  exit 0
else
  echo "✖ LỖI KẾT NỐI: HTTP \${HTTP_STATUS}" >&2
  exit 1
fi
\`\`\`

Script tự động phân tích mã HTTP status và bảo vệ khỏi rủi ro treo tiến trình.`;
      } else if (lower.includes('typescript') || lower.includes('ts') || lower.includes('type')) {
        reply = `Dưới đây là định nghĩa kiểu **TypeScript** và hàm gọi API gửi yêu cầu giải tỏa bản ghi cách ly:

\`\`\`typescript
export interface QuarantineResolutionPayload {
  recordId: string;
  batchId: string;
  action: 'APPROVE_OVERRIDE' | 'REJECT_RETURN' | 'EDIT_RESUBMIT';
  normalizedValue?: number;
  resolutionNotes: string;
  authorizedBy: string;
  timestamp: string;
}

export async function submitQuarantineResolution(
  payload: QuarantineResolutionPayload
): Promise<{ success: boolean; auditLogId: string }> {
  const response = await fetch('/api/kpi/quarantine/resolve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Compliance-Check': 'DUAL_CONTROL_ENFORCED',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(\`Resolution failed with status \${response.status}\`);
  }

  return response.json();
}
\`\`\`

Đã tích hợp cơ chế Dual Control Enforcement chuẩn doanh nghiệp.`;
      } else if (lower.includes('bottleneck') || lower.includes('nghẽn') || lower.includes('dự báo') || lower.includes('predict')) {
        reply = `**Báo cáo Phân tích AI Predictive Bottlenecks (Dựa trên mô hình 30-ngày):**
Hệ thống dự báo **4 điểm nghẽn tiềm tàng** cần can thiệp sớm:

1. 🔴 **KTECH (94% - CRITICAL)**: Nguy cơ dừng máy Line 6 trong ~4h tới do quá nhiệt chiller thủy lực. MTBF đã giảm 38%. Cần kích hoạt Bypass Line 4.
2. 🟡 **DREAM TECH (86% - HIGH)**: Tồn kho đệm IC-Driver cạn kiệt lúc 22:00. Lead-time lệch +4.7 ngày. Cần chuyển 2,000 pcs sang HSTEC.
3. 🔵 **HOJEONG VINA (74% - MEDIUM)**: Suy giảm Yield do mòn stencil kem hàn và lệch feeder SMT Line 8 trong 28h tới. Cần hiệu chuẩn trước ca tối.
4. 🔵 **KHV (63% - MEDIUM)**: Công nhân chuyền 3 vượt trần 18.5h OT/tuần, nguy cơ vắng mặt ca cuối tuần. Cần điều chuyển 5 thợ đa năng từ xưởng đúc ép.`;
        suggestedAction = 'Kích hoạt kế hoạch phòng ngừa điểm nghẽn KTECH & DREAM TECH';
      } else if (lower.includes('dream') || lower.includes('trễ') || lower.includes('chậm')) {
        reply = `**DREAM TECH** đang gặp chậm trễ giao hàng 6% do thiếu hụt linh kiện bán dẫn từ nhà cung cấp phụ cấp 2. Dự kiến lô hàng bổ sung sẽ đến lúc 18:00 hôm nay.
• Tồn kho an toàn: 1.2 ngày (mức rủi ro).
• Đề xuất: Phân bổ 2,000 pcs cho HSTEC để bù đắp hụt sản lượng.`;
        suggestedAction = 'Reallocate 2,000 pcs from DREAM TECH to HSTEC';
      } else if (lower.includes('ktech') || lower.includes('máy') || lower.includes('stop')) {
        reply = `**KTECH Line 6** đang dừng máy do lỗi hệ thống chiller thủy lực quá nhiệt:
• Thời gian dừng tính đến hiện tại: 2 giờ 45 phút.
• Đã có phiếu duyệt mua linh kiện chiller mới đang chờ Factory Manager phê duyệt (#1).
• Kỹ sư bảo trì GMES đã có mặt tại hiện trường.`;
        suggestedAction = 'Mở phiếu phê duyệt sửa chữa KTECH #1';
      } else if (lower.includes('hstec') || lower.includes('sản xuất')) {
        reply = `**HSTEC** đang có hiệu suất sản xuất đạt 96.4%, chất lượng đạt 98.9%:
• Dư công suất khả dụng: 12% (tương đương 4,500 pcs/ngày).
• Sẵn sàng nhận thêm 2,000 pcs tái phân bổ từ DREAM TECH mà không làm chậm các đơn hàng hiện hữu.`;
      } else {
        reply = `Phân tích cho "${userMsg.text}": 
Tất cả 6 nhà máy đối tác đang kết nối đồng bộ với hệ thống điều hành GMES. 3/6 đối tác đạt chuẩn On Track, 2 nhà máy ở mức cảnh báo At Risk, và 1 điểm nóng Critical tại KTECH Line 6.
Bạn có thể dùng các phím tắt bên dưới để trích xuất mã nguồn tự động hoặc câu lệnh kiểm định dữ liệu.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          action: suggestedAction,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 550);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: `Hội thoại đã được làm mới. Bạn cần hỗ trợ gì về điều hành sản xuất hoặc truy vấn chất lượng dữ liệu KPI?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div
        className={`w-full ${
          isExpanded ? 'max-w-2xl' : 'max-w-md'
        } bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 transition-all duration-200`}
      >
        {/* Header */}
        <div className="p-3.5 bg-[#0b1324] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>VOMS AI Copilot</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-medium border border-blue-500/30">
                  DEV READY
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Operations & Data Quality Developer Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Reset Chat */}
            <button
              onClick={handleResetChat}
              title="Làm mới cuộc trò chuyện"
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Expand / Minimize Width Toggle for comfortable code inspection */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Thu hẹp khung nhìn (448px)' : 'Mở rộng khung nhìn xem mã nguồn (672px)'}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Đóng AI Assistant"
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 bg-slate-50/80 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`w-full max-w-[94%] p-3.5 rounded-xl shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none ml-auto max-w-[85%]'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                }`}
              >
                {m.sender === 'user' ? (
                  <div className="whitespace-pre-line leading-relaxed font-sans">{m.text}</div>
                ) : (
                  renderMessageContent(m.text)
                )}

                {/* Suggested Action Button */}
                {m.action && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-purple-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      Hành động đề xuất tự động:
                    </span>
                    <button
                      onClick={() => onApplyAction?.(m.action!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-[11px] font-bold shadow-xs transition-colors cursor-pointer w-fit"
                    >
                      <span>Thực hiện: {m.action}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {m.sender === 'user' ? 'Bạn' : 'VOMS AI'} • {m.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar & Developer Shortcuts */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          {/* Quick Developer Code Generation Shortcuts */}
          <div className="flex gap-1.5 mb-2.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
            <button
              onClick={() => handleSend('Dự báo các điểm nghẽn đối tác tiềm tàng (Predictive Bottlenecks)')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200/80 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium"
              title="Xem dự báo các điểm nghẽn đối tác sắp xảy ra"
            >
              <BrainCircuit className="w-3 h-3 text-indigo-600" />
              <span>🔮 Dự báo nghẽn</span>
            </button>

            <button
              onClick={() => handleSend('Tạo SQL truy vấn các bản ghi cách ly CRITICAL')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium"
              title="Sinh câu lệnh SQL truy vấn bản ghi cách ly"
            >
              <Database className="w-3 h-3 text-amber-600" />
              <span>SQL Quarantine</span>
            </button>

            <button
              onClick={() => handleSend('Tạo script Python kiểm tra và tính toán DTI')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200/80 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium"
              title="Sinh mã nguồn Python tính DTI độc lập"
            >
              <FileCode className="w-3 h-3 text-sky-600" />
              <span>Python DTI Script</span>
            </button>

            <button
              onClick={() => handleSend('Cấu hình Rule Validation JSON Schema')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium"
              title="Sinh cấu hình JSON quy tắc kiểm định"
            >
              <Braces className="w-3 h-3 text-emerald-600" />
              <span>JSON Rule Config</span>
            </button>

            <button
              onClick={() => handleSend('Script Bash cURL kiểm tra kết nối GMES Edge')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium"
              title="Sinh lệnh cURL preflight check connector"
            >
              <Terminal className="w-3 h-3 text-teal-600" />
              <span>cURL Preflight</span>
            </button>

            <button
              onClick={() => handleSend('Kiểm tra nguyên nhân KTECH dừng máy Line 6')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              🔍 KTECH dừng máy
            </button>

            <button
              onClick={() => handleSend('Tại sao DREAM TECH giảm tiến độ giao hàng?')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              ⚠️ DREAM TECH vật tư
            </button>
          </div>

          {/* Prompt Input Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi AI về vận hành hoặc gõ 'SQL', 'Python', 'JSON', 'cURL'..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
