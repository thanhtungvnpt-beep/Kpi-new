import React, { useState } from 'react';
import {
  Copy,
  Check,
  Terminal,
  Database,
  FileCode,
  Braces,
  Code2,
  FileText,
  WrapText,
  AlignLeft,
} from 'lucide-react';

export interface CodeSnippetBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

// Token types for syntax highlighting
type TokenType =
  | 'comment'
  | 'string'
  | 'keyword'
  | 'function'
  | 'number'
  | 'boolean'
  | 'operator'
  | 'punctuation'
  | 'variable'
  | 'jsonKey'
  | 'text';

interface Token {
  type: TokenType;
  text: string;
}

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES',
  'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG',
  'MIN', 'MAX', 'ROUND', 'NULLIF', 'IS', 'NOT', 'NULL', 'IN', 'BETWEEN', 'LIKE', 'CASE',
  'WHEN', 'THEN', 'ELSE', 'END', 'FLOAT', 'INT', 'VARCHAR', 'TIMESTAMP', 'DESC', 'ASC',
  'UNION', 'ALL', 'WITH', 'EXISTS', 'DROP', 'ALTER', 'INDEX', 'COALESCE', 'OVER', 'PARTITION'
]);

const PYTHON_KEYWORDS = new Set([
  'def', 'class', 'import', 'from', 'as', 'return', 'if', 'elif', 'else', 'for', 'in',
  'while', 'try', 'except', 'finally', 'with', 'lambda', 'pass', 'raise', 'yield',
  'async', 'await', 'self', 'int', 'str', 'float', 'dict', 'list', 'set', 'bool',
  'len', 'print', 'range', 'enumerate', 'zip', 'open', 'sum', 'min', 'max'
]);

const TS_KEYWORDS = new Set([
  'import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else',
  'for', 'while', 'async', 'await', 'interface', 'type', 'enum', 'class', 'extends',
  'implements', 'new', 'this', 'typeof', 'keyof', 'string', 'number', 'boolean', 'any',
  'void', 'Promise', 'default', 'throw', 'catch', 'finally', 'try', 'switch', 'case',
  'break', 'continue', 'readonly', 'as', 'instanceof'
]);

const BASH_KEYWORDS = new Set([
  'echo', 'curl', 'set', 'export', 'chmod', 'tail', 'head', 'exit', 'if', 'then', 'else',
  'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'case', 'esac', 'function', 'return',
  'grep', 'awk', 'sed', 'cat', 'source', 'local', 'read', 'sudo'
]);

// Helper to determine language styling metadata
const getLanguageMetadata = (langRaw?: string) => {
  const lang = (langRaw || '').toLowerCase().trim();
  if (['sql', 'postgresql', 'mysql', 'sqlite'].includes(lang)) {
    return {
      normalized: 'sql',
      displayName: 'SQL',
      icon: Database,
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    };
  }
  if (['python', 'py'].includes(lang)) {
    return {
      displayName: 'Python',
      normalized: 'python',
      icon: FileCode,
      badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    };
  }
  if (['json'].includes(lang)) {
    return {
      displayName: 'JSON',
      normalized: 'json',
      icon: Braces,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    };
  }
  if (['bash', 'sh', 'shell', 'zsh', 'terminal'].includes(lang)) {
    return {
      displayName: 'Bash / Shell',
      normalized: 'bash',
      icon: Terminal,
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    };
  }
  if (['typescript', 'ts', 'tsx', 'javascript', 'js', 'jsx'].includes(lang)) {
    return {
      displayName: 'TypeScript',
      normalized: 'typescript',
      icon: Code2,
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    };
  }
  return {
    displayName: lang.toUpperCase() || 'Code',
    normalized: 'code',
    icon: FileText,
    badgeColor: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };
};

// Line tokenizer
const tokenizeLine = (line: string, lang: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;
  const len = line.length;

  while (i < len) {
    // 1. Check for comments
    if (lang === 'sql' && line.slice(i, i + 2) === '--') {
      tokens.push({ type: 'comment', text: line.slice(i) });
      break;
    }
    if ((lang === 'python' || lang === 'bash') && line[i] === '#') {
      tokens.push({ type: 'comment', text: line.slice(i) });
      break;
    }
    if (['typescript', 'code'].includes(lang) && line.slice(i, i + 2) === '//') {
      tokens.push({ type: 'comment', text: line.slice(i) });
      break;
    }

    // 2. Check for strings
    if (line[i] === '"' || line[i] === "'" || (['typescript', 'bash'].includes(lang) && line[i] === '`')) {
      const quote = line[i];
      let str = quote;
      i++;
      let escaped = false;
      while (i < len) {
        str += line[i];
        if (line[i] === quote && !escaped) {
          i++;
          break;
        }
        escaped = line[i] === '\\' && !escaped;
        i++;
      }
      // In JSON, check if string is followed by colon -> JSON key
      if (lang === 'json') {
        let lookAhead = i;
        while (lookAhead < len && /\s/.test(line[lookAhead])) lookAhead++;
        if (lookAhead < len && line[lookAhead] === ':') {
          tokens.push({ type: 'jsonKey', text: str });
          continue;
        }
      }
      tokens.push({ type: 'string', text: str });
      continue;
    }

    // 3. Bash environment variables: $VAR or ${VAR}
    if (lang === 'bash' && line[i] === '$') {
      let varStr = '$';
      i++;
      if (i < len && line[i] === '{') {
        varStr += '{';
        i++;
        while (i < len && line[i] !== '}') {
          varStr += line[i];
          i++;
        }
        if (i < len && line[i] === '}') {
          varStr += '}';
          i++;
        }
      } else {
        while (i < len && /[a-zA-Z0-9_]/.test(line[i])) {
          varStr += line[i];
          i++;
        }
      }
      tokens.push({ type: 'variable', text: varStr });
      continue;
    }

    // 4. Command flags: -s, --header, -X
    if (lang === 'bash' && line[i] === '-' && i + 1 < len && /[a-zA-Z-]/.test(line[i + 1])) {
      let flag = '-';
      i++;
      while (i < len && /[a-zA-Z0-9_-]/.test(line[i])) {
        flag += line[i];
        i++;
      }
      tokens.push({ type: 'variable', text: flag });
      continue;
    }

    // 5. Numbers
    if (/\d/.test(line[i])) {
      let num = '';
      while (i < len && /[\d.xXa-fA-F_]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ type: 'number', text: num });
      continue;
    }

    // 6. Words (keywords, booleans, functions, identifiers)
    if (/[a-zA-Z_]/.test(line[i])) {
      let word = '';
      while (i < len && /[a-zA-Z0-9_]/.test(line[i])) {
        word += line[i];
        i++;
      }

      // Check if followed by open parenthesis -> function
      let isFunc = false;
      let nextCharIdx = i;
      while (nextCharIdx < len && /\s/.test(line[nextCharIdx])) nextCharIdx++;
      if (nextCharIdx < len && line[nextCharIdx] === '(') {
        isFunc = true;
      }

      const upper = word.toUpperCase();
      const lower = word.toLowerCase();

      // Check booleans & nulls
      if (
        ['true', 'false', 'null'].includes(lower) ||
        ['TRUE', 'FALSE', 'NULL'].includes(upper) ||
        ['None', 'True', 'False'].includes(word)
      ) {
        tokens.push({ type: 'boolean', text: word });
        continue;
      }

      // Check keywords
      if (
        (lang === 'sql' && SQL_KEYWORDS.has(upper)) ||
        (lang === 'python' && PYTHON_KEYWORDS.has(word)) ||
        (lang === 'typescript' && TS_KEYWORDS.has(word)) ||
        (lang === 'bash' && BASH_KEYWORDS.has(word))
      ) {
        tokens.push({ type: 'keyword', text: word });
        continue;
      }

      if (isFunc) {
        tokens.push({ type: 'function', text: word });
        continue;
      }

      tokens.push({ type: 'text', text: word });
      continue;
    }

    // 7. Operators & Punctuation
    if ('=><!+-*/%&|^~:;,.(){}[]'.includes(line[i])) {
      const char = line[i];
      const isOp = '=><!+-*/%&|^~'.includes(char);
      tokens.push({ type: isOp ? 'operator' : 'punctuation', text: char });
      i++;
      continue;
    }

    // 8. Whitespace & fallback
    tokens.push({ type: 'text', text: line[i] });
    i++;
  }

  return tokens;
};

// Map token type to color class
const getTokenColorClass = (type: TokenType): string => {
  switch (type) {
    case 'comment':
      return 'text-slate-400 italic';
    case 'string':
      return 'text-amber-300 font-normal';
    case 'jsonKey':
      return 'text-sky-300 font-medium';
    case 'keyword':
      return 'text-purple-400 font-semibold';
    case 'function':
      return 'text-blue-300 font-medium';
    case 'number':
      return 'text-emerald-400 font-mono';
    case 'boolean':
      return 'text-rose-400 font-semibold';
    case 'variable':
      return 'text-teal-300 font-medium';
    case 'operator':
      return 'text-pink-400 font-medium';
    case 'punctuation':
      return 'text-slate-400';
    case 'text':
    default:
      return 'text-slate-100';
  }
};

export const CodeSnippetBlock: React.FC<CodeSnippetBlockProps> = ({
  code,
  language = 'sql',
  filename,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);

  const cleanCode = code.trim();
  const lines = cleanCode.split('\n');
  const meta = getLanguageMetadata(language);
  const IconComponent = meta.icon;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleanCode);
      } else {
        // Fallback for restricted iframe contexts
        const textarea = document.createElement('textarea');
        textarea.value = cleanCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div
      className={`my-2.5 rounded-lg border border-slate-700/80 bg-[#090d16] text-slate-100 overflow-hidden shadow-md font-sans text-xs ${className}`}
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-slate-800 text-[11px]">
        {/* Language & Filename */}
        <div className="flex items-center gap-2 overflow-hidden">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wide uppercase ${meta.badgeColor}`}
          >
            <IconComponent className="w-3 h-3 shrink-0" />
            <span>{meta.displayName}</span>
          </div>

          {filename && (
            <span className="text-slate-300 font-mono text-[11px] truncate" title={filename}>
              {filename}
            </span>
          )}

          <span className="text-slate-500 text-[10px] hidden sm:inline-block">
            {lines.length} {lines.length === 1 ? 'dòng' : 'dòng'} • {cleanCode.length} ký tự
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Wrap / Unwrap Toggle */}
          <button
            type="button"
            onClick={() => setWrapLines(!wrapLines)}
            title={wrapLines ? 'Tắt xuống dòng (No wrap)' : 'Tự động xuống dòng (Wrap lines)'}
            className={`p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer ${
              wrapLines ? 'text-blue-400 bg-slate-800' : ''
            }`}
          >
            {wrapLines ? <WrapText className="w-3.5 h-3.5" /> : <AlignLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Copy to Clipboard Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-200 cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600'
            }`}
            title="Sao chép toàn bộ mã nguồn vào bộ nhớ tạm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-75 duration-150" />
                <span className="font-semibold text-emerald-300">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                <span>Sao chép</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body with Line Numbers & Syntax Highlighting */}
      <div
        className={`p-2.5 overflow-x-auto font-mono text-[11px] leading-relaxed selection:bg-blue-600/40 selection:text-white ${
          wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
        }`}
      >
        <table className="border-collapse w-full">
          <tbody>
            {lines.map((line, idx) => {
              const tokens = tokenizeLine(line, meta.normalized);
              return (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  {/* Line Number Column (non-selectable) */}
                  <td className="select-none text-right pr-3.5 pl-1 text-slate-600 text-[10px] font-mono align-top w-7">
                    {idx + 1}
                  </td>
                  {/* Code Column */}
                  <td className="align-top font-mono">
                    {tokens.map((token, tIdx) => (
                      <span key={tIdx} className={getTokenColorClass(token.type)}>
                        {token.text}
                      </span>
                    ))}
                    {tokens.length === 0 && ' '}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
