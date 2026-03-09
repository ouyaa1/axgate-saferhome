import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, CalendarDays, User, CheckSquare, Eye, Download,
  Search, MapPin, ChevronRight, ArrowLeft, Grid3X3, ListFilter
} from 'lucide-react';
import ApprovalSystem from '../components/ApprovalSystem';
import DocumentPreviewModal from '../components/DocumentPreviewModal';

const SafetyInspectionDashboard = ({ onLog, complexId, complexList, safetyInspectionData, onDataChange, onSelectComplex }) => {
  // 결재 상태 관리
  const [approvals, setApprovals] = useState([
    { role: '담 당', name: '박신일', date: '02.20', status: 'approved' },
    { role: '주 임', name: '', date: '', status: 'pending' },
    { role: '과 장', name: '', date: '', status: 'pending' },
    { role: '소 장', name: '', date: '', status: 'pending' }
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [inspectDate, setInspectDate] = useState(new Date().toISOString().split('T')[0]);
  const [landingSearch, setLandingSearch] = useState('');
  const [landingView, setLandingView] = useState('grid');
  const [checkedIds, setCheckedIds] = useState([]);

  const [checklist, setChecklist] = useState(
    complexId ? (safetyInspectionData[complexId] || []) : []
  );

  useEffect(() => {
    if (complexId && safetyInspectionData[complexId]) {
      setChecklist(safetyInspectionData[complexId]);
    }
  }, [complexId]);

  const handleResultChange = (id, newResult) => {
    const updated = checklist.map(item => item.id === id ? { ...item, result: newResult } : item);
    setChecklist(updated);
    if (complexId && onDataChange) onDataChange(complexId, updated);
  };

  const groupedList = checklist.reduce((acc, curr) => {
    const { category } = curr;
    if (!acc[category]) acc[category] = [];
    acc[category].push(curr);
    return acc;
  }, {});

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
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ClipboardCheck className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">홈네트워크 안전점검 — 단지 선택</h2>
              <p className="text-xs text-slate-400 mt-0.5">점검할 단지를 선택하세요</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={landingSearch}
                onChange={(e) => setLandingSearch(e.target.value)}
                placeholder="단지명 또는 지역 검색..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            {/* 뷰 전환 탭 */}
            <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
              <button onClick={() => setLandingView('grid')} className={`p-2 rounded-lg transition-all ${landingView === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setLandingView('list')} className={`p-2 rounded-lg transition-all ${landingView === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}><ListFilter className="w-4 h-4" /></button>
            </div>
            <button
              onClick={() => alert(checkedIds.length > 0 ? `선택된 ${checkedIds.length}개 단지 안전점검 보고서 일괄 다운로드 (데모)` : '전체 단지 안전점검 보고서 일괄 다운로드 (데모)')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap ${checkedIds.length > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-900 text-white hover:bg-black'}`}
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
              const data = safetyInspectionData[c.id] || [];
              const good = data.filter(i => i.result === '양호').length;
              const bad = data.filter(i => i.result === '불량').length;
              const isChecked = checkedIds.includes(c.id);
              const statusColor = c.status === '정상' ? 'emerald' : c.status === '점검중' ? 'amber' : 'rose';
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectComplex(c.id)}
                  className={`bg-white rounded-3xl border shadow-sm p-6 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group ${isChecked ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200/60 hover:border-emerald-200'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleCheck(c.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-0.5 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">{c.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.region}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold bg-${statusColor}-50 text-${statusColor}-600 border border-${statusColor}-100`}>{c.status}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-black text-slate-800">{data.length}</span>
                      <span className="text-[10px] font-bold text-slate-400">건</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">양호 {good}</span>
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">불량 {bad}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* 목록 뷰 */
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  </th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">단지명</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">지역</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상태</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">총 항목</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">점검 현황</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => {
                  const data = safetyInspectionData[c.id] || [];
                  const good = data.filter(i => i.result === '양호').length;
                  const bad = data.filter(i => i.result === '불량').length;
                  const isChecked = checkedIds.includes(c.id);
                  return (
                    <tr key={c.id} className={`transition-colors cursor-pointer ${isChecked ? 'bg-emerald-50/50' : 'hover:bg-slate-50/70'}`} onClick={() => onSelectComplex(c.id)}>
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isChecked} onChange={(e) => toggleCheck(c.id, e)} className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors">{c.name}</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">{c.region}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${c.status === '정상' ? 'bg-emerald-50 text-emerald-600' : c.status === '점검중' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-black text-emerald-600">{data.length}건</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1.5">
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">양호 {good}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">불량 {bad}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => onSelectComplex(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"><ChevronRight className="w-4 h-4" /></button>
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

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {showPreview && (
        <DocumentPreviewModal
          onClose={() => setShowPreview(false)}
          title="홈네트워크 안전점검표 - 일간 레포트"
          date={inspectDate}
          approvals={approvals}
          checklist={checklist}
          type="safety"
        />
      )}

      {/* 뒤로가기 바 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 flex items-center gap-3">
        <button onClick={() => onSelectComplex(null)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
          <ArrowLeft className="w-4 h-4" /> 단지 목록으로
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-bold text-slate-800">{currentComplex?.name}</span>
          <span className="text-xs text-slate-400">{currentComplex?.region}</span>
        </div>
      </div>

      {/* 상단 컨트롤 바 */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">점검 일자</p>
              <input type="date" value={inspectDate} onChange={(e) => setInspectDate(e.target.value)} className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer hover:text-indigo-600 transition-colors" />
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100"></div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">점검자</p>
              <input type="text" defaultValue="박신일" className="font-bold text-slate-800 bg-transparent outline-none w-24 hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        </div>

          <ApprovalSystem approvals={approvals} setApprovals={setApprovals} />
      </div>

      {/* 메인 점검 리스트 */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 flex flex-col overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <ClipboardCheck className="w-6 h-6 text-indigo-600" /> 홈네트워크 안전점검표
          </h3>
          <div className="flex gap-2">
            <button onClick={() => onLog && onLog('[SAFETY] 점검 결과가 저장되었습니다.')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> 결과 저장
            </button>
            <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm flex items-center gap-2">
              <Eye className="w-4 h-4" /> 미리보기
            </button>
            <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-md flex items-center gap-2">
              <Download className="w-4 h-4" /> PDF 다운로드
            </button>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="space-y-8">
            {Object.entries(groupedList).map(([category, items], catIdx) => (
              <div key={catIdx} className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60">
                <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div> {category}
                </h4>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/2">점검 항목</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/4 text-center">점검 주기 (권고/의무)</th>
                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-1/4 text-center">점검 결과</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((checkItem, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-4 text-xs font-bold text-slate-700">{checkItem.item}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg">
                              <span className="text-[10px] font-bold text-slate-500">{checkItem.cycleRec}</span>
                              <span className="text-[8px] text-slate-300">/</span>
                              <span className="text-[10px] font-bold text-indigo-600">{checkItem.cycleMan}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <select
                              value={checkItem.result}
                              onChange={(e) => handleResultChange(checkItem.id, e.target.value)}
                              className={`bg-white border border-slate-200 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-100 cursor-pointer hover:border-emerald-300 transition-colors ${
                                checkItem.result === '양호' ? 'text-emerald-600' :
                                checkItem.result === '불량' ? 'text-rose-600' :
                                'text-slate-400'
                              }`}
                            >
                              <option value="양호" className="text-emerald-600">양호</option>
                              <option value="불량" className="text-rose-600">불량</option>
                              <option value="해당없음" className="text-slate-400">해당없음</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyInspectionDashboard;
