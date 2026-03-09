import React, { useMemo } from 'react';
import { FileText, X, Printer, Download } from 'lucide-react';

const DocumentPreviewModal = ({ onClose, title, date, approvals, checklist, type, customMeta }) => {

  const stats = useMemo(() => {
    const total = checklist.length;
    const good = checklist.filter(i => i.result === '양호').length;
    const bad = checklist.filter(i => i.result === '취약' || i.result === '불량' || i.result === '미흡').length;
    const manual = checklist.filter(i => i.result === '수동점검').length;
    const etc = total - good - bad - manual;
    return { total, good, bad, manual, etc };
  }, [checklist]);

  const docNo = useMemo(() => {
    const y = (date || new Date().toISOString().split('T')[0]).substring(0, 4);
    const typeCode = type === 'vulnerability' ? 'VUL' : type === 'unit' ? 'UNT' : type === 'complex_mgmt' ? 'MGT' : 'SAF';
    const seq = Math.floor(Math.random() * 900 + 100);
    return `AXGT-${y}-${typeCode}-${seq}`;
  }, [date, type]);

  const openPrintWindow = () => {
    const element = document.getElementById('pdf-report-content');
    if (!element) return;
    const pw = window.open('', '_blank');
    pw.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>${docNo}_${title}</title>
      <style>
        @page { margin: 0; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; font-family: 'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif; }
        #pdf-report-content { width: 100% !important; min-height: auto !important; box-shadow: none !important; margin: 0 !important; }
        table { border-collapse: collapse; page-break-inside: auto; width: 100%; }
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        tr { page-break-inside: avoid; page-break-after: auto; }
      </style>
    </head><body>${element.outerHTML}</body></html>`);
    pw.document.close();
    const filename = `${docNo}_${title}`;
    pw.document.title = filename;
    pw.onload = () => {
      pw.document.title = filename;
      pw.print();
    };
  };

  const resultBadge = (result) => {
    const base = 'white-space:nowrap;display:inline-block;';
    if (result === '양호') return base + 'background:#d1fae5;color:#065f46;border:1px solid #a7f3d0';
    if (result === '취약' || result === '불량' || result === '미흡') return base + 'background:#fee2e2;color:#991b1b;border:1px solid #fca5a5';
    if (result === '수동점검') return base + 'background:#fef9c3;color:#854d0e;border:1px solid #fde047';
    return base + 'background:#f1f5f9;color:#475569;border:1px solid #cbd5e1';
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center bg-slate-900/80 backdrop-blur-md overflow-y-auto p-4 sm:p-8 custom-scrollbar">
      <div className="relative w-full max-w-[860px] shrink-0 mt-10">
        {/* 상단 툴바 */}
        <div className="sticky top-0 z-[160] flex justify-between items-center mb-6 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 shadow-2xl no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-base">리포트 미리보기</h3>
              <p className="text-[11px] font-bold text-slate-400">문서번호: {docNo}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={openPrintWindow} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
              <Printer className="w-4 h-4" /> 인쇄하기
            </button>
            <button onClick={openPrintWindow} className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-300">
              <Download className="w-4 h-4" /> PDF 저장
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1 self-center"></div>
            <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── A4 문서 본체 ── */}
        <div id="pdf-report-content" style={{
          width: '210mm', minHeight: '297mm', background: '#fff',
          margin: '0 auto', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)',
          fontFamily: "'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif",
          fontSize: '10pt', color: '#1e293b', position: 'relative',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* 상단 컬러바 */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg,#1B2A4A 0%,#f97316 100%)', flexShrink: 0 }} />

          {/* ── 헤더 영역 ── */}
          <div style={{ padding: '7mm 12mm 5mm', borderBottom: '2px solid #1B2A4A', flexShrink: 0, pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5mm' }}>

              {/* 로고 + 발신 정보 */}
              <div>
                <div style={{ fontSize: '20pt', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1, color: '#1e293b' }}>
                  AX<span style={{ color: '#f97316' }}>GATE</span>
                </div>
                <div style={{ fontSize: '6pt', color: '#f97316', fontWeight: 700, letterSpacing: '3px', marginTop: '2px' }}>SECURITY &amp; BEYOND</div>
                <div style={{ marginTop: '4px', fontSize: '6.5pt', color: '#64748b', lineHeight: 1.7 }}>
                  <div>㈜엑스게이트 ICT사업본부</div>
                  <div>서울특별시 금천구 가산디지털1로 168, A동 1503호</div>
                  <div>TEL: 02-1644-4306 | www.axgate.com</div>
                </div>
              </div>

              {/* 결재 테이블 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ fontSize: '6pt', color: '#94a3b8', fontWeight: 700, letterSpacing: '2px', textAlign: 'right' }}>APPROVAL</div>
                <table style={{ borderCollapse: 'collapse', fontSize: '7pt', minWidth: '160px' }}>
                  <tbody>
                    <tr>
                      <td rowSpan={2} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, color: '#475569', padding: '3px 5px', textAlign: 'center', writingMode: 'vertical-rl', textOrientation: 'upright', width: '18px' }}>결재</td>
                      {approvals.map((app, i) => (
                        <td key={i} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 700, color: '#334155', padding: '4px 8px', textAlign: 'center', minWidth: '46px' }}>{app.role}</td>
                      ))}
                    </tr>
                    <tr>
                      {approvals.map((app, i) => (
                        <td key={i} style={{ border: '1px solid #cbd5e1', height: '38px', textAlign: 'center', verticalAlign: 'middle', padding: '3px' }}>
                          {app.status === 'approved' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {app.stampImage
                                ? <img src={app.stampImage} alt="stamp" style={{ maxWidth: '34px', maxHeight: '34px', opacity: 0.9 }} />
                                : <div style={{ border: '2.5px solid rgba(225,29,72,0.8)', borderRadius: '6px', padding: '2px 7px', transform: 'rotate(-8deg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(225,29,72,0.18)' }}>
                                    <span style={{ fontSize: '9pt', fontWeight: 900, color: 'rgba(225,29,72,0.9)', fontFamily: 'serif', whiteSpace: 'nowrap', letterSpacing: '0.1em' }}>{app.name}</span>
                                  </div>
                              }
                              <span style={{ fontSize: '6pt', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>{app.date}</span>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 문서 제목 + 메타 */}
            <div style={{ borderLeft: '3px solid #f97316', paddingLeft: '10px', marginBottom: '4mm' }}>
              <div style={{ fontSize: '6.5pt', color: '#f97316', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '3px' }}>Official Inspection Report</div>
              <div style={{ fontSize: '15pt', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{title}</div>
            </div>

            {/* 문서 정보 박스 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px 12px', display: 'flex', flexWrap: 'wrap', gap: '0' }}>
              {(customMeta ? customMeta : [
                { label: '문서 번호', value: docNo },
                { label: '작성일', value: date || new Date().toISOString().split('T')[0] },
                { label: '보안 등급', value: '대외비 (CONFIDENTIAL)' },
                { label: '작성 부서', value: 'ICT사업본부 기술지원팀' },
              ]).map((m, i, arr) => (
                <div key={i} style={{ flex: '1 1 40%', padding: '4px 8px', borderRight: i % 2 === 0 && i < arr.length - 1 ? '1px solid #e2e8f0' : 'none', borderBottom: i < arr.length - 2 ? '1px solid #e2e8f0' : 'none' }}>
                  <div style={{ fontSize: '6pt', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1px' }}>{m.label}</div>
                  <div style={{ fontSize: '7.5pt', fontWeight: 700, color: '#1e293b' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 요약 통계 ── */}
          <div style={{ padding: '4mm 12mm', borderBottom: '1px solid #e2e8f0', flexShrink: 0, background: '#fafafa', pageBreakInside: 'avoid', pageBreakAfter: 'avoid' }}>
            <div style={{ fontSize: '6.5pt', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>INSPECTION SUMMARY</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: '전체 항목', value: stats.total, bg: '#f1f5f9', border: '#e2e8f0', color: '#334155' },
                { label: '양호 / 정상', value: stats.good, bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
                { label: '취약 / 불량', value: stats.bad, bg: '#fff1f2', border: '#fecdd3', color: '#9f1239' },
                { label: '수동 점검', value: stats.manual, bg: '#fefce8', border: '#fef08a', color: '#854d0e' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, background: s.bg, border: `1px solid ${s.border}`, borderRadius: '6px', padding: '5px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '6pt', fontWeight: 700, color: s.color, marginBottom: '2px', whiteSpace: 'nowrap' }}>{s.label}</div>
                  <div style={{ fontSize: '14pt', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '6pt', color: s.color, opacity: 0.7, marginTop: '2px' }}>
                    {stats.total > 0 ? Math.round(s.value / stats.total * 100) : 0}%
                  </div>
                  <div style={{ marginTop: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', height: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.total > 0 ? Math.round(s.value / stats.total * 100) : 0}%`, height: '100%', background: s.color, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 점검 내역 테이블 ── */}
          <div style={{ padding: '4mm 12mm', flex: 1 }}>
            <div style={{ fontSize: '6.5pt', fontWeight: 800, color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>INSPECTION DETAILS</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', tableLayout: 'fixed', pageBreakInside: 'auto' }}>
              <thead style={{ display: 'table-header-group' }}>
                <tr style={{ background: '#1B2A4A', color: '#fff' }}>
                  {type === 'unit' ? (<>
                    <th style={{ padding: '5px 8px', width: '75px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>분류</th>
                    <th style={{ padding: '5px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 항목</th>
                    <th style={{ padding: '5px 8px', width: '62px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>결과</th>
                    <th style={{ padding: '5px 8px', width: '110px', textAlign: 'center', fontWeight: 700 }}>상세 내용</th>
                  </>) : type === 'vulnerability' ? (<>
                    <th style={{ padding: '5px 8px', width: '52px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>ID</th>
                    <th style={{ padding: '5px 8px', width: '80px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>분류</th>
                    <th style={{ padding: '5px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 항목</th>
                    <th style={{ padding: '5px 8px', width: '62px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>결과</th>
                    <th style={{ padding: '5px 8px', width: '90px', textAlign: 'center', fontWeight: 700 }}>비고</th>
                  </>) : type === 'complex_mgmt' ? (<>
                    <th style={{ padding: '5px 8px', width: '52px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>ID</th>
                    <th style={{ padding: '5px 8px', width: '80px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>분류</th>
                    <th style={{ padding: '5px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 항목</th>
                    <th style={{ padding: '5px 8px', width: '62px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>결과</th>
                    <th style={{ padding: '5px 8px', width: '90px', textAlign: 'center', fontWeight: 700 }}>비고</th>
                  </>) : (<>
                    <th style={{ padding: '5px 8px', width: '90px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>분류</th>
                    <th style={{ padding: '5px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 항목</th>
                    <th style={{ padding: '5px 8px', width: '62px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>점검 주기</th>
                    <th style={{ padding: '5px 8px', width: '58px', textAlign: 'center', fontWeight: 700 }}>결과</th>
                  </>)}
                </tr>
              </thead>
              <tbody>
                {checklist.map((item, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #e2e8f0', pageBreakInside: 'avoid' }}>
                    {type === 'unit' ? (<>
                      <td style={{ padding: '4px 7px', textAlign: 'center', fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.category}</td>
                      <td style={{ padding: '4px 7px', color: '#334155', lineHeight: 1.4, borderRight: '1px solid #e2e8f0' }}>{item.item}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                        <span style={{ padding: '1px 5px', borderRadius: '3px', fontWeight: 800, fontSize: '6.5pt', ...Object.fromEntries(resultBadge(item.result).split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()]; })) }}>{item.result}</span>
                      </td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontSize: '6.5pt' }}>{item.note}</td>
                    </>) : type === 'vulnerability' ? (<>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontFamily: 'monospace', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.id}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.category}</td>
                      <td style={{ padding: '4px 7px', color: '#334155', lineHeight: 1.4, borderRight: '1px solid #e2e8f0' }}>{item.item}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                        <span style={{ padding: '1px 5px', borderRadius: '3px', fontWeight: 800, fontSize: '6.5pt', ...Object.fromEntries(resultBadge(item.result).split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()]; })) }}>{item.result}</span>
                      </td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontSize: '6.5pt' }}>{item.note}</td>
                    </>) : type === 'complex_mgmt' ? (<>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontFamily: 'monospace', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.id}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.category}</td>
                      <td style={{ padding: '4px 7px', color: '#334155', lineHeight: 1.4, borderRight: '1px solid #e2e8f0' }}>{item.item}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                        <span style={{ padding: '1px 5px', borderRadius: '3px', fontWeight: 800, fontSize: '6.5pt', ...Object.fromEntries(resultBadge(item.result).split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()]; })) }}>{item.result}</span>
                      </td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontSize: '6.5pt' }}>{item.note}</td>
                    </>) : (<>
                      <td style={{ padding: '4px 7px', textAlign: 'center', fontWeight: 700, color: '#475569', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.category}</td>
                      <td style={{ padding: '4px 7px', color: '#334155', lineHeight: 1.4, borderRight: '1px solid #e2e8f0' }}>{item.item}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center', color: '#64748b', fontFamily: 'monospace', borderRight: '1px solid #e2e8f0', fontSize: '7pt' }}>{item.cycleRec}</td>
                      <td style={{ padding: '4px 7px', textAlign: 'center' }}>
                        <span style={{ padding: '1px 5px', borderRadius: '3px', fontWeight: 800, fontSize: '6.5pt', ...Object.fromEntries(resultBadge(item.result).split(';').filter(Boolean).map(s => { const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v.trim()]; })) }}>{item.result}</span>
                      </td>
                    </>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── 푸터 ── */}
          <div style={{ padding: '5mm 12mm 6mm', borderTop: '2px solid #1B2A4A', background: '#f8fafc', flexShrink: 0, pageBreakInside: 'avoid', pageBreakBefore: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '6.5pt', color: '#94a3b8', lineHeight: 1.7 }}>
                <div style={{ fontWeight: 800, color: '#475569', marginBottom: '2px' }}>㈜엑스게이트 · ICT사업본부 기술지원팀</div>
                <div>서울특별시 금천구 가산디지털1로 168, A동 1503호</div>
                <div>TEL: 02-1644-4306 | FAX: 02-2026-4306 | www.axgate.com</div>
                <div style={{ marginTop: '3px', color: '#cbd5e1' }}>본 문서는 {docNo} 기준으로 작성되었으며, 무단 배포를 금합니다.</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16pt', fontWeight: 900, color: '#1B2A4A', letterSpacing: '-1px', lineHeight: 1 }}>AX<span style={{ color: '#f97316' }}>GATE</span></div>
                <div style={{ fontSize: '6pt', color: '#94a3b8', letterSpacing: '2px', marginTop: '2px' }}>COPYRIGHT © AXGATE CO., LTD.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
