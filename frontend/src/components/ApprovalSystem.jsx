import React, { useState, useRef } from 'react';
import { PenTool, Upload, X } from 'lucide-react';

const ApprovalSystem = ({ approvals, setApprovals }) => {
  const [editingIdx, setEditingIdx] = useState(null);
  const [signName, setSignName] = useState('');
  const [stampImage, setStampImage] = useState(null);
  const fileInputRef = useRef(null);

  // 직책(Role) 텍스트 변경
  const handleRoleChange = (idx, newRole) => {
    setApprovals(prev => prev.map((app, i) => i === idx ? { ...app, role: newRole } : app));
  };

  // 결재 취소 처리
  const handleCancelSign = (idx) => {
    setApprovals(prev => prev.map((app, i) => i === idx ? { ...app, status: 'pending', name: '', date: '', stampImage: null } : app));
    setEditingIdx(null);
  };

  // 결재 팝업 열기
  const openSignModal = (idx, e) => {
    e.stopPropagation();
    const app = approvals[idx];
    setSignName(app.status === 'approved' ? app.name : '');
    setStampImage(app.status === 'approved' ? (app.stampImage || null) : null);
    setEditingIdx(idx);
  };

  // 도장 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setStampImage(event.target.result);
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // 같은 파일 재업로드를 위해 초기화
  };

  // 결재 정보 저장
  const handleSignSubmit = () => {
    const today = new Date();
    const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    setApprovals(prev => prev.map((app, i) => {
      if (i === editingIdx) {
        return {
          ...app,
          status: 'approved',
          name: signName || '결재자',
          date: dateStr,
          stampImage: stampImage
        };
      }
      return app;
    }));
    setEditingIdx(null);
  };

  return (
    <>
      <div className="flex items-stretch bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden select-none">
        {/* 결재란 헤더 (정방향 세로 쓰기 적용) */}
        <div className="bg-slate-50 w-8 flex items-center justify-center border-r border-slate-200 shrink-0">
          <span
            className="text-[12px] font-black text-slate-500 tracking-[0.2em]"
            style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
          >
            결재
          </span>
        </div>

        <div className="flex">
          {approvals.map((app, idx) => (
            <div
              key={idx}
              className={`flex flex-col w-20 sm:w-24 border-r border-slate-100 last:border-0 relative transition-all duration-300 group ${app.status === 'approved' ? 'bg-white' : 'bg-slate-50/50'}`}
            >
              {/* 직책 인라인 입력 필드 */}
              <div className={`h-7 flex items-center justify-center text-[11px] font-bold border-b border-slate-100 transition-colors ${app.status === 'approved' ? 'bg-slate-50' : 'bg-slate-100/50'}`}>
                <input
                  type="text"
                  value={app.role}
                  onChange={(e) => handleRoleChange(idx, e.target.value)}
                  className={`w-full text-center bg-transparent outline-none focus:bg-indigo-50 focus:text-indigo-600 transition-colors ${app.status === 'approved' ? 'text-slate-700' : 'text-slate-500'}`}
                  placeholder="직책 입력"
                />
              </div>

              {/* 도장/서명 영역 */}
              <div
                className="h-16 flex flex-col items-center justify-center relative overflow-hidden bg-white cursor-pointer hover:bg-slate-50"
                onClick={(e) => openSignModal(idx, e)}
              >
                {app.status === 'approved' ? (
                  <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-300 w-full h-full relative p-1">
                    {app.stampImage ? (
                      <img src={app.stampImage} alt="stamp" className="max-w-[44px] max-h-[44px] object-contain drop-shadow-sm opacity-90 z-10" />
                    ) : (
                      <div className="px-2.5 py-1 border-[2.5px] border-rose-600/80 rounded-lg flex items-center justify-center transform -rotate-[8deg] shadow-sm relative before:absolute before:inset-[1.5px] before:border before:border-rose-600/20 before:rounded-[4px] z-10 bg-white">
                        <span className="text-[13px] font-black font-serif tracking-[0.1em] text-rose-600/90 whitespace-nowrap">
                          {app.name}
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-1 text-[9px] font-mono font-bold text-slate-500 bg-white/90 px-1 rounded z-20">{app.date}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-medium text-slate-300 group-hover:opacity-0 transition-opacity">미결재</span>
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50/80 backdrop-blur-[1px]">
                      <span className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold shadow-sm flex items-center gap-1">
                        <PenTool className="w-3 h-3" /> 결재하기
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결재 설정 모달 */}
      {editingIdx !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingIdx(null)} />
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 w-80 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><PenTool size={18} className="text-indigo-600"/> 전자 결재</span>
              {approvals[editingIdx].status === 'approved' && (
                <button onClick={() => handleCancelSign(editingIdx)} className="text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded hover:bg-rose-100 transition-colors font-bold">결재 취소</button>
              )}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">결재자 이름</label>
                <input
                  type="text"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="이름 입력 (예: 홍길동)"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center justify-between">
                  도장 이미지 (선택 사항)
                  {stampImage && (
                    <button onClick={() => setStampImage(null)} className="text-rose-500 hover:text-rose-600 text-[10px]">이미지 제거</button>
                  )}
                </label>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-28 bg-slate-50 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-colors overflow-hidden group ${stampImage ? 'border-indigo-200 hover:border-indigo-400' : 'border-slate-300 hover:border-indigo-400'}`}
                >
                  {stampImage ? (
                    <div className="relative w-full h-full p-2 flex items-center justify-center">
                       <img src={stampImage} alt="uploaded stamp" className="max-h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-white text-xs font-bold flex items-center gap-1"><Upload size={14}/> 변경</span>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                      <Upload size={24} className="mb-2" />
                      <span className="text-[11px] font-bold">이미지 업로드</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingIdx(null)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">취소</button>
              <button onClick={handleSignSubmit} disabled={!signName.trim() && !stampImage} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50">결재 적용</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApprovalSystem;
