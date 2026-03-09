import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckCircle2, Building2, Grid3X3, Search, Plus, Upload, Download,
  Edit, Trash2, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import AddComplexModal from '../components/AddComplexModal';

const ComplexListDashboard = ({ onNavigate, onSelectComplex, complexList, setComplexList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체상태');
  const [builderFilter, setBuilderFilter] = useState('건설사 전체');
  const [homenetFilter, setHomenetFilter] = useState('홈넷사 전체');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingComplex, setEditingComplex] = useState(null);

  // --- 엑셀 관련 상태 및 Ref 추가 ---
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);

  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);

  // 필터링 로직
  const filteredList = complexList.filter(item => {
    const matchSearch = item.name.includes(searchTerm) || item.builder.includes(searchTerm) || item.homenet.includes(searchTerm);
    const matchStatus = statusFilter === '전체상태' || item.status === statusFilter;
    const matchBuilder = builderFilter === '건설사 전체' || item.builder === builderFilter;
    const matchHomenet = homenetFilter === '홈넷사 전체' || item.homenet === homenetFilter;
    return matchSearch && matchStatus && matchBuilder && matchHomenet;
  });

  // 필터나 표시 수량이 변경되면 첫 페이지로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, builderFilter, homenetFilter, itemsPerPage]);

  // 현재 페이지에 표시할 리스트 계산
  const displayedList = useMemo(() => {
    if (itemsPerPage === 'all') return filteredList;
    const start = (currentPage - 1) * Number(itemsPerPage);
    return filteredList.slice(start, start + Number(itemsPerPage));
  }, [filteredList, currentPage, itemsPerPage]);

  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredList.length / Number(itemsPerPage));

  const handleSelectAll = () => {
    const displayedIds = displayedList.map(item => item.id);
    const allDisplayedSelected = displayedIds.length > 0 && displayedIds.every(id => selectedIds.includes(id));

    if (allDisplayedSelected) {
      setSelectedIds(selectedIds.filter(id => !displayedIds.includes(id)));
    } else {
      const newSelected = [...selectedIds];
      displayedIds.forEach(id => {
        if (!newSelected.includes(id)) newSelected.push(id);
      });
      setSelectedIds(newSelected);
    }
  };

  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleEditClick = () => {
    if (selectedIds.length === 1) {
      const complexToEdit = complexList.find(c => c.id === selectedIds[0]);
      setEditingComplex(complexToEdit);
      setShowAddModal(true);
    }
  };

  const handleDeleteClick = () => {
    setComplexList(prev => prev.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    setToastMessage(`${selectedIds.length}건의 단지가 삭제되었습니다.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveComplex = (formData) => {
    if (formData.id) {
      // 수정 모드
      setComplexList(prev => prev.map(c => c.id === formData.id ? { ...c, ...formData } : c));
      setToastMessage('단지 정보가 수정되었습니다.');
    } else {
      // 신규 등록 모드
      const newId = `AX-PRM-${String(complexList.length + 1).padStart(2, '0')}`;
      const today = new Date().toISOString().split('T')[0];

      const newComplex = {
        ...formData,
        id: newId,
        status: '정상',
        report: '미발급',
        regDate: today,
        registrant: '관리자'
      };
      setComplexList([newComplex, ...complexList]);
      setToastMessage('신규 단지가 등록되었습니다.');
    }

    setShowAddModal(false);
    setEditingComplex(null);
    setSelectedIds([]); // 등록/수정 완료 후 선택 해제
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- 엑셀 템플릿 다운로드 핸들러 ---
  const handleDownloadTemplate = () => {
    const headers = ['단지명(필수)', '지역', '상세주소', '건설사', '홈넷사', '관리사무소_담당자', '관리사무소_연락처', '건설사_담당자', '건설사_연락처', '홈넷사_담당자', '홈넷사_연락처'];
    const sampleData = ['테스트 래미안', '서울 마포구', '서울특별시 마포구 테스트로 123', '삼성물산', '삼성SDS', '이소장', '010-1234-5678', '김과장', '010-2222-3333', '박대리', '010-4444-5555'];

    // BOM을 추가하여 엑셀에서 한글 깨짐 방지
    const csvContent = "\uFEFF" + headers.join(',') + '\n' + sampleData.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "AXGATE_단지등록_양식.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 엑셀(CSV) 업로드 핸들러 ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n');
      const newComplexes = [];

      // 첫 번째 줄은 헤더이므로 인덱스 1부터 시작
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // 빈 줄 건너뛰기
        const cols = rows[i].split(',');
        if (cols.length < 1) continue;

        const newId = `AX-PRM-EX${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        newComplexes.push({
          id: newId,
          name: cols[0] ? cols[0].trim() : '이름없음',
          region: cols[1] ? cols[1].trim() : '',
          address: cols[2] ? cols[2].trim() : '',
          builder: cols[3] ? cols[3].trim() : '기타',
          homenet: cols[4] ? cols[4].trim() : '기타',
          manager: cols[5] ? cols[5].trim() : '',
          contact: cols[6] ? cols[6].trim() : '',
          builderManager: cols[7] ? cols[7].trim() : '',
          builderContact: cols[8] ? cols[8].trim() : '',
          homenetManager: cols[9] ? cols[9].trim() : '',
          homenetContact: cols[10] ? cols[10].trim() : '',
          status: '정상',
          report: '미발급',
          regDate: new Date().toISOString().split('T')[0],
          registrant: '엑셀등록'
        });
      }

      if (newComplexes.length > 0) {
        setComplexList(prev => [...newComplexes, ...prev]);
        setToastMessage(`${newComplexes.length}건의 단지가 성공적으로 등록되었습니다.`);
        setTimeout(() => setToastMessage(''), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // input 초기화
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] w-full mx-auto animate-in fade-in duration-500 h-[calc(100vh-176px)] min-h-[600px] relative">
      {/* 성공 토스트 메시지 */}
      {toastMessage && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {showAddModal && <AddComplexModal onClose={() => { setShowAddModal(false); setEditingComplex(null); }} onSave={handleSaveComplex} initialData={editingComplex} />}

      <div className="bg-gradient-to-r from-[#2563eb] to-[#4f46e5] rounded-[1.5rem] p-6 shadow-md flex flex-col gap-4 relative overflow-hidden shrink-0">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <Building2 size={240} />
        </div>
        <div className="relative z-10 flex items-center gap-3 mb-2 text-white">
          <Grid3X3 className="w-6 h-6" />
          <h2 className="text-xl font-black tracking-tight">내 단지관리</h2>
        </div>
        <div className="relative z-10 flex flex-wrap gap-4 items-center">
          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20 backdrop-blur-sm">
            <span className="text-white text-xs font-bold px-3 py-1.5 opacity-90">생성일자</span>
            <input type="date" defaultValue="2024-01-01" className="bg-white text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none" />
            <span className="text-white px-2">~</span>
            <input type="date" defaultValue="2026-12-31" className="bg-white text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none" />
          </div>

          <select
            className="bg-white text-slate-700 text-xs font-bold rounded-xl px-4 py-2 border border-white/20 outline-none shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="전체상태">전체 상태</option>
            <option value="정상">정상</option>
            <option value="오프라인">오프라인</option>
            <option value="점검중">점검중</option>
          </select>

          <select
            className="bg-white text-slate-700 text-xs font-bold rounded-xl px-4 py-2 border border-white/20 outline-none shadow-sm cursor-pointer"
            value={builderFilter}
            onChange={(e) => setBuilderFilter(e.target.value)}
          >
            <option value="건설사 전체">건설사 전체</option>
            <option value="현대건설">현대건설</option>
            <option value="삼성물산">삼성물산</option>
            <option value="GS건설">GS건설</option>
            <option value="대우건설">대우건설</option>
            <option value="DL이앤씨">DL이앤씨</option>
            <option value="포스코이앤씨">포스코이앤씨</option>
          </select>

          <select
            className="bg-white text-slate-700 text-xs font-bold rounded-xl px-4 py-2 border border-white/20 outline-none shadow-sm cursor-pointer"
            value={homenetFilter}
            onChange={(e) => setHomenetFilter(e.target.value)}
          >
            <option value="홈넷사 전체">홈넷사 전체</option>
            <option value="현대HT">현대HT</option>
            <option value="삼성SDS">삼성SDS</option>
            <option value="이지스">이지스</option>
            <option value="코콤">코콤</option>
            <option value="코맥스">코맥스</option>
            <option value="포스코DX">포스코DX</option>
          </select>

          <div className="relative flex-1 min-w-[200px] max-w-md ml-auto">
            <input
              type="text"
              placeholder="단지명, 건설사, 홈넷사 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:bg-white/20 transition-all backdrop-blur-sm"
            />
            <Search className="w-4 h-4 text-white/70 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 리스트 영역 */}
      <div className="flex-1 bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-0">
        <div className="px-6 py-4 bg-[#3b82f6] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold">
              단지내역 <span className="font-normal opacity-80">(전체: {complexList.length}건, 검색: {filteredList.length}건)</span>
            </div>
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <span className="text-xs font-medium opacity-90">표시 수량</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                className="bg-white/10 text-white text-xs font-bold rounded px-2 py-1 outline-none border border-white/20 cursor-pointer [&>option]:text-slate-800"
              >
                <option value="5">5개</option>
                <option value="10">10개</option>
                <option value="20">20개</option>
                <option value="50">50개</option>
                <option value="all">전체</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#3b82f6] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> 단지 등록
            </button>
            <div className="w-px h-6 bg-white/20 mx-1"></div>

            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> 엑셀등록
            </button>
            <button onClick={handleDownloadTemplate} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> 양식 다운로드
            </button>

            <div className="w-px h-6 bg-white/20 mx-1"></div>
            <button onClick={handleEditClick} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50" disabled={selectedIds.length !== 1}>
              <Edit className="w-3.5 h-3.5" /> 수정
            </button>
            <button onClick={handleDeleteClick} className="px-3 py-1.5 bg-white/10 hover:bg-rose-500 border border-white/20 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50" disabled={selectedIds.length === 0}>
              <Trash2 className="w-3.5 h-3.5" /> 삭제
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#f8fafc] border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={displayedList.length > 0 && displayedList.every(item => selectedIds.includes(item.id))}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider">단지명(아파트)</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">건설사</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">홈넷사</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">연결상태</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">단지주소</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">담당자</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">연락처</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">리포트상태</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">최초 등록자</th>
                <th className="px-4 py-4 text-[12px] font-black text-slate-500 tracking-wider text-center">서비스등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedList.length > 0 ? displayedList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group cursor-pointer" onClick={(e) => { if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) handleSelect(item.id); }}>
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onSelectComplex ? onSelectComplex(item.id) : onNavigate('complex_detail')}
                      className="text-sm font-bold text-blue-600 hover:underline hover:text-blue-800 text-left transition-colors"
                    >
                      {item.name}
                    </button>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.region}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-sm"></div> {item.builder}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center text-xs font-bold text-slate-600 gap-1.5">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> {item.homenet}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black ${
                      item.status === '정상' ? 'bg-emerald-500 text-white' :
                      item.status === '오프라인' ? 'bg-slate-400 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs text-slate-600 truncate block max-w-[160px] mx-auto" title={item.address}>{item.address}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-bold text-slate-700">{item.manager}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-mono text-slate-500">{item.contact}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded border text-[11px] font-bold ${
                      item.report === '발급' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-400 bg-slate-50'
                    }`}>
                      {item.report}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-bold text-slate-700">{item.registrant}</span>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                    {item.regDate}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" className="px-4 py-16 text-center text-slate-400 font-medium text-sm">
                    검색 조건에 일치하는 단지가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이징 영역 */}
        {itemsPerPage !== 'all' && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-center items-center gap-4 shrink-0">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-slate-600">
              <span className="text-blue-600">{currentPage}</span> / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-colors"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplexListDashboard;
