import React, { useState } from 'react';
import {
  FileText, FileDown, Search, Download, Filter, ChevronDown, ChevronRight,
  ArrowLeft, MapPin, Grid3X3, ListFilter, X, ShieldCheck, Building2,
  AlertTriangle, Layers
} from 'lucide-react';

const ReportDashboard = ({ complexId, complexList, reportData, onSelectComplex, isAdmin, onDataChange }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('전체');
  const [landingSearch, setLandingSearch] = useState('');
  const [landingView, setLandingView] = useState('grid');
  const [checkedIds, setCheckedIds] = useState([]);
  const [statusDropdownId, setStatusDropdownId] = useState(null);
  const [previewReport, setPreviewReport] = useState(null);

  const downloadReportPdf = () => {
    const element = document.getElementById('pdf-report-preview-content');
    if (!element) return;

    const styles = Array.from(document.styleSheets).map(sheet => {
      try { return Array.from(sheet.cssRules).map(r => r.cssText).join(''); }
      catch { return ''; }
    }).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
      <style>${styles}</style>
      <style>
        @page { margin: 0; size: A4 portrait; }
        body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      </style>
    </head><body>${element.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
  };

  const reports = complexId ? (reportData[complexId] || []) : [];

  const handleStatusChange = (reportId, newStatus) => {
    if (!isAdmin || !complexId) return;
    const updated = reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r);
    onDataChange(complexId, updated);
    setStatusDropdownId(null);
  };

  const filteredReports = reports.filter(report => {
    const matchSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        report.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === '전체' || report.type === filterType;
    return matchSearch && matchType;
  });

  const groupedReports = filteredReports.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {});

  const handleSelectAll = (items) => {
    const itemIds = items.map(i => i.id);
    const allSelected = itemIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !itemIds.includes(id)));
    } else {
      const newIds = [...selectedIds];
      itemIds.forEach(id => {
        if (!newIds.includes(id)) newIds.push(id);
      });
      setSelectedIds(newIds);
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sId => sId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- 랜딩 모드 (단지 미선택) ---
  if (!complexId) {
    const filtered = landingSearch.trim()
      ? complexList.filter(c =>
          c.name.toLowerCase().includes(landingSearch.toLowerCase()) ||
          c.region.toLowerCase().includes(landingSearch.toLowerCase())
        )
      : complexList;

    const toggleCheck = (id, e) => {
      e.stopPropagation();
      setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const allChecked = filtered.length > 0 && filtered.every(c => checkedIds.includes(c.id));
    const toggleAll = () => {
      if (allChecked) setCheckedIds(prev => prev.filter(id => !filtered.find(c => c.id === id)));
      else setCheckedIds(prev => [...new Set([...prev, ...filtered.map(c => c.id)])]);
    };

    return (
      <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        <div className="rounded-3xl p-8 shadow-sm border border-slate-300/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ backgroundColor: '#E2E8F0' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">통합 보고서 센터 — 단지 선택</h2>
              <p className="text-xs text-slate-400 mt-0.5">보고서를 확인할 단지를 선택하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={landingSearch}
                onChange={(e) => setLandingSearch(e.target.value)}
                placeholder="단지명 또는 지역 검색..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
              <button onClick={() => setLandingView('grid')} className={`p-2 rounded-lg transition-all ${landingView === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setLandingView('list')} className={`p-2 rounded-lg transition-all ${landingView === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}><ListFilter className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => alert(checkedIds.length > 0 ? `선택된 ${checkedIds.length}개 단지 보고서 일괄 다운로드 (데모)` : '전체 단지 보고서 일괄 다운로드 (데모)')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${checkedIds.length > 0 ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              <Download className="w-4 h-4" /> 일괄 다운로드{checkedIds.length > 0 && ` (${checkedIds.length})`}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 font-medium bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
        ) : landingView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map(c => {
              const data = reportData[c.id] || [];
              const typeCount = {};
              data.forEach(r => { typeCount[r.type] = (typeCount[r.type] || 0) + 1; });
              const isChecked = checkedIds.includes(c.id);
              const statusColor = c.status === '정상' ? 'emerald' : c.status === '점검중' ? 'amber' : 'rose';
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectComplex(c.id)}
                  className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group ${isChecked ? 'border-purple-300 ring-2 ring-purple-100' : 'border-slate-200/60 hover:border-purple-200'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleCheck(c.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer mt-0.5 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 group-hover:text-purple-600 transition-colors">{c.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.region}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100`}>{c.status}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-black text-slate-800">{data.length}</span>
                      <span className="text-[10px] font-bold text-slate-400">건</span>
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(typeCount).slice(0, 4).map(([type, cnt]) => (
                        <span key={type} className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">{type.replace(' 점검', '').replace(' 보고서', '')} {cnt}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">단지명</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">지역</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상태</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">보고서 수</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">최근 보고서</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => {
                  const data = reportData[c.id] || [];
                  const latest = data[0];
                  const isChecked = checkedIds.includes(c.id);
                  return (
                    <tr key={c.id} className={`transition-colors cursor-pointer ${isChecked ? 'bg-purple-50/50' : 'hover:bg-slate-50/70'}`} onClick={() => onSelectComplex(c.id)}>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isChecked} onChange={(e) => toggleCheck(c.id, e)} className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-slate-800 hover:text-purple-600 transition-colors">{c.name}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">{c.region}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${c.status === '정상' ? 'bg-emerald-50 text-emerald-600' : c.status === '점검중' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-black text-sky-600">{data.length}건</td>
                      <td className="px-4 py-4 text-xs text-slate-500 truncate max-w-[200px]">{latest ? `${latest.date} — ${latest.title}` : '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => onSelectComplex(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all"><ChevronRight className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // --- 상세 모드 (단지 선택됨) ---
  const currentComplex = complexList.find(c => c.id === complexId);
  const totalReports = reports.length;
  const typeCounts = {};
  reports.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500" onClick={() => statusDropdownId && setStatusDropdownId(null)}>

      {/* 보고서 미리보기 모달 */}
      {previewReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setPreviewReport(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            {/* 모달 헤더 */}
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start shrink-0">
              <div className="flex-1 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{previewReport.type}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    previewReport.status === '완료' ? 'text-emerald-600 bg-emerald-50' :
                    previewReport.status === '점검중' ? 'text-amber-600 bg-amber-50' :
                    'text-slate-500 bg-slate-50'
                  }`}>{previewReport.status || '완료'}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{previewReport.title}</h3>
              </div>
              <button onClick={() => setPreviewReport(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors shrink-0"><X size={20} /></button>
            </div>

            {/* 문서 정보 */}
            <div className="px-8 py-4 border-b border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">문서 번호</p>
                <p className="text-sm font-mono font-bold text-slate-700">{previewReport.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">등록 일자</p>
                <p className="text-sm font-bold text-slate-700">{previewReport.date}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">작성자</p>
                <p className="text-sm font-bold text-slate-700">{previewReport.author}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">파일 용량</p>
                <p className="text-sm font-bold text-slate-700">{previewReport.size}</p>
              </div>
            </div>

            {/* 미리보기 본문 */}
            <div className="flex-1 overflow-y-auto p-8">
              <div id="pdf-report-preview-content" className="bg-slate-50 rounded-2xl border border-slate-200 p-8">
                {/* 문서 헤더 영역 */}
                <div className="text-center mb-8 pb-6 border-b border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">AXGATE SAFERHOME</p>
                  <h4 className="text-xl font-black text-slate-800 mb-1">{previewReport.title}</h4>
                  <p className="text-xs text-slate-500">{currentComplex?.name} · {currentComplex?.region}</p>
                </div>

                {/* 점검 개요 */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    점검 개요
                  </h5>
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="py-2.5 text-xs font-bold text-slate-500 w-28">점검 유형</td>
                        <td className="py-2.5 text-xs text-slate-700">{previewReport.type}</td>
                        <td className="py-2.5 text-xs font-bold text-slate-500 w-28">점검 일자</td>
                        <td className="py-2.5 text-xs text-slate-700">{previewReport.date}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="py-2.5 text-xs font-bold text-slate-500">점검 대상</td>
                        <td className="py-2.5 text-xs text-slate-700">{currentComplex?.name}</td>
                        <td className="py-2.5 text-xs font-bold text-slate-500">담당자</td>
                        <td className="py-2.5 text-xs text-slate-700">{previewReport.author}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-xs font-bold text-slate-500">점검 결과</td>
                        <td colSpan={3} className="py-2.5 text-xs text-slate-700">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            previewReport.status === '완료' ? 'bg-emerald-50 text-emerald-600' :
                            previewReport.status === '점검중' ? 'bg-amber-50 text-amber-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>{previewReport.status || '완료'}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 세부 내용 */}
                <div className="mb-6">
                  <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-slate-400 rounded-full"></div>
                    세부 점검 내용
                  </h5>
                  <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <p>본 보고서는 {currentComplex?.name}에 대한 {previewReport.type} 결과를 기록한 문서입니다.</p>
                    <p>점검 항목 전반에 걸쳐 홈네트워크 시스템의 보안 상태를 평가하였으며, 취약 사항에 대한 조치 방안을 포함하고 있습니다.</p>
                    <p>세부 점검 결과 및 조치 이력은 별첨 자료를 참고하시기 바랍니다.</p>
                  </div>
                </div>

                {/* 비고 */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">비고</p>
                  <p className="text-xs text-slate-500">본 문서는 데모용 미리보기입니다. 실제 환경에서는 전체 보고서 내용이 표시됩니다.</p>
                </div>
              </div>
            </div>

            {/* 모달 하단 */}
            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setPreviewReport(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">닫기</button>
              <button onClick={() => downloadReportPdf(previewReport)} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> PDF 다운로드
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 뒤로가기 바 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 flex items-center gap-3">
        <button onClick={() => onSelectComplex(null)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-all">
          <ArrowLeft className="w-4 h-4" /> 단지 목록으로
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-slate-800">{currentComplex?.name}</span>
          <span className="text-xs text-slate-400">{currentComplex?.region}</span>
        </div>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <div
          onClick={() => setFilterType('전체')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '전체' ? 'border-slate-400 ring-2 ring-slate-100 shadow-md transform scale-[1.02]' : 'border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">총 누적 보고서</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{totalReports}<span className="text-sm font-medium text-slate-500 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '전체' ? 'bg-slate-200 text-slate-700' : 'bg-slate-50 text-slate-500'}`}><FileText /></div>
        </div>

        <div
          onClick={() => setFilterType('취약점 점검')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '취약점 점검' ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-md transform scale-[1.02]' : 'border-indigo-100 shadow-sm hover:border-indigo-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">취약점 점검</p>
            <p className="text-3xl font-black text-indigo-600 mt-1">{typeCounts['취약점 점검'] || 0}<span className="text-sm font-medium text-indigo-600/60 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '취약점 점검' ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-50 text-indigo-600'}`}><AlertTriangle /></div>
        </div>

        <div
          onClick={() => setFilterType('안전 점검')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '안전 점검' ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md transform scale-[1.02]' : 'border-emerald-100 shadow-sm hover:border-emerald-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">안전 점검</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{typeCounts['안전 점검'] || 0}<span className="text-sm font-medium text-emerald-600/60 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '안전 점검' ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-50 text-emerald-600'}`}><ShieldCheck /></div>
        </div>

        <div
          onClick={() => setFilterType('단지 보고서')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '단지 보고서' ? 'border-purple-500 ring-2 ring-purple-100 shadow-md transform scale-[1.02]' : 'border-purple-100 shadow-sm hover:border-purple-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">단지 보고서</p>
            <p className="text-3xl font-black text-purple-600 mt-1">{typeCounts['단지 보고서'] || 0}<span className="text-sm font-medium text-purple-600/60 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '단지 보고서' ? 'bg-purple-100 text-purple-700' : 'bg-purple-50 text-purple-600'}`}><Building2 /></div>
        </div>

        <div
          onClick={() => setFilterType('종합 보고서')}
          className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${filterType === '종합 보고서' ? 'border-orange-500 ring-2 ring-orange-100 shadow-md transform scale-[1.02]' : 'border-orange-100 shadow-sm hover:border-orange-300 hover:shadow-md'}`}
        >
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">종합 점검</p>
            <p className="text-3xl font-black text-orange-600 mt-1">{typeCounts['종합 보고서'] || 0}<span className="text-sm font-medium text-orange-600/60 ml-1">건</span></p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${filterType === '종합 보고서' ? 'bg-orange-100 text-orange-700' : 'bg-orange-50 text-orange-600'}`}><Layers /></div>
        </div>
      </div>

      {/* 보고서 목록 */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 rounded-t-[2.5rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <FileDown className="w-6 h-6 text-indigo-600" /> 종합 점검 보고서 이력
          </h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="보고서 제목 또는 작성자 검색"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="relative shrink-0">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none w-[130px] px-4 py-2.5 pl-10 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="전체">모든 유형</option>
                <option value="취약점 점검">취약점 점검</option>
                <option value="안전 점검">안전 점검</option>
                <option value="단지 보고서">단지 보고서</option>
                <option value="종합 보고서">종합 보고서</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${
                selectedIds.length > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              disabled={selectedIds.length === 0}
            >
              <Download className="w-4 h-4" /> 선택 다운로드 {selectedIds.length > 0 && `(${selectedIds.length})`}
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {Object.keys(groupedReports).length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-medium bg-slate-50 rounded-3xl border border-slate-100">
                검색 결과가 없습니다.
              </div>
            ) : (
              Object.entries(groupedReports).map(([category, items], catIdx) => {
                const isAllSelected = items.length > 0 && items.every(item => selectedIds.includes(item.id));

                return (
                  <div key={catIdx} className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60">
                    <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                      <div className={`w-1.5 h-4 rounded-full ${
                        category === '취약점 점검' ? 'bg-indigo-500' :
                        category === '안전 점검' ? 'bg-emerald-500' :
                        category === '단지 보고서' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      {category}
                      <span className="text-xs font-bold text-slate-400 ml-1">({items.length}건)</span>
                    </h4>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 w-12 text-center">
                              <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={() => handleSelectAll(items)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-36">문서 번호</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-36">등록 일자</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">보고서 제목</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-24">작성자</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-24">용량</th>
                            <th className="px-4 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-28 text-center">상태</th>
                            <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-32 text-center">다운로드</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {items.map((report, idx) => (
                            <tr key={idx} className={`transition-colors group ${selectedIds.includes(report.id) ? 'bg-indigo-50/50' : 'hover:bg-slate-50/70'}`}>
                              <td className="px-6 py-5 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(report.id)}
                                  onChange={() => handleSelect(report.id)}
                                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                              </td>
                              <td className="px-4 py-5 text-xs font-mono font-bold text-slate-500">{report.id}</td>
                              <td className="px-4 py-5 text-xs font-bold text-slate-600">{report.date}</td>
                              <td className="px-4 py-5 text-sm font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors" onClick={(e) => { e.stopPropagation(); setPreviewReport(report); }}>
                                <div className="flex items-center gap-3">
                                  <FileText className={`w-4 h-4 transition-colors ${selectedIds.includes(report.id) ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                  {report.title}
                                </div>
                              </td>
                              <td className="px-4 py-5 text-xs font-bold text-slate-600">{report.author}</td>
                              <td className="px-4 py-5 text-xs font-mono font-medium text-slate-500">{report.size}</td>
                              <td className="px-4 py-5 text-center relative">
                                {isAdmin ? (
                                  <div className="relative inline-block">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setStatusDropdownId(statusDropdownId === report.id ? null : report.id); }}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                                        report.status === '완료' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' :
                                        report.status === '점검중' ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' :
                                        'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                      }`}
                                    >
                                      {report.status || '완료'} <ChevronDown className="w-3 h-3 inline-block ml-0.5 -mt-px" />
                                    </button>
                                    {statusDropdownId === report.id && (
                                      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 min-w-[100px]">
                                        {['완료', '점검중', '대기'].map(s => (
                                          <button
                                            key={s}
                                            onClick={(e) => { e.stopPropagation(); handleStatusChange(report.id, s); }}
                                            className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors flex items-center gap-2 ${
                                              report.status === s ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                          >
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                              s === '완료' ? 'bg-emerald-500' : s === '점검중' ? 'bg-amber-500' : 'bg-slate-400'
                                            }`} />
                                            {s}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                    report.status === '완료' ? 'bg-emerald-50 text-emerald-600' :
                                    report.status === '점검중' ? 'bg-amber-50 text-amber-600' :
                                    'bg-slate-50 text-slate-500'
                                  }`}>
                                    {report.status || '완료'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-5 text-center">
                                <button onClick={() => setPreviewReport(report)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all shadow-sm">
                                  <Download className="w-3.5 h-3.5" /> PDF
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
