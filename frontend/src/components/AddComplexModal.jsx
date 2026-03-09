import React, { useState } from 'react';
import { Building2, X } from 'lucide-react';

const AddComplexModal = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '', region: '', address: '',
    builder: '현대건설', homenet: '현대HT',
    manager: '', contact: '',
    builderManager: '', builderContact: '',
    homenetManager: '', homenetContact: '',
    dongCount: 10, dongStartNum: 101, floorCount: 20, unitsPerFloor: 2,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" /> {initialData ? '단지 정보 수정' : '신규 단지 등록'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          <form id="add-complex-form" onSubmit={handleSubmit} className="space-y-8">
            {/* 단지 기본 정보 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div> 단지 기본 정보
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">단지명 *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="예: 디에이치 아너힐즈" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">지역</label>
                  <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="예: 서울 강남구" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">상세 주소</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="단지 상세 주소 입력" />
                </div>
              </div>
            </div>

            {/* 시스템 정보 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div> 시스템 정보
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">건설사</label>
                  <select name="builder" value={formData.builder} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
                    <option value="현대건설">현대건설</option>
                    <option value="삼성물산">삼성물산</option>
                    <option value="GS건설">GS건설</option>
                    <option value="대우건설">대우건설</option>
                    <option value="DL이앤씨">DL이앤씨</option>
                    <option value="포스코이앤씨">포스코이앤씨</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">홈넷사</label>
                  <select name="homenet" value={formData.homenet} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all">
                    <option value="현대HT">현대HT</option>
                    <option value="삼성SDS">삼성SDS</option>
                    <option value="이지스">이지스</option>
                    <option value="코콤">코콤</option>
                    <option value="코맥스">코맥스</option>
                    <option value="포스코DX">포스코DX</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 단지 구성 정보 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-teal-500 rounded-full"></div> 단지 구성 정보 (동호수)
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">동 수</label>
                  <input type="number" name="dongCount" min={1} max={99} value={formData.dongCount} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" placeholder="10" />
                  <p className="text-[11px] text-slate-400 mt-1">단지 내 전체 동 수</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">시작 동번호</label>
                  <input type="number" name="dongStartNum" min={1} max={999} value={formData.dongStartNum} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" placeholder="101" />
                  <p className="text-[11px] text-slate-400 mt-1">첫 번째 동 번호 (예: 101동)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">층 수</label>
                  <input type="number" name="floorCount" min={1} max={99} value={formData.floorCount} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" placeholder="20" />
                  <p className="text-[11px] text-slate-400 mt-1">각 동의 최고 층수</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">층당 호수</label>
                  <input type="number" name="unitsPerFloor" min={1} max={20} value={formData.unitsPerFloor} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" placeholder="2" />
                  <p className="text-[11px] text-slate-400 mt-1">각 층의 세대 수</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                <p className="text-xs text-teal-700 font-medium">
                  <span className="font-bold">미리보기:</span> {formData.dongStartNum}동 ~ {formData.dongStartNum + formData.dongCount - 1}동 / 각 {formData.floorCount}층 / 층당 {formData.unitsPerFloor}세대 → 총 <span className="font-black">{formData.dongCount * formData.floorCount * formData.unitsPerFloor}</span>세대
                </p>
              </div>
            </div>

            {/* 담당자 정보 */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div> 담당자 정보
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">관리사무소 담당자</label>
                  <input type="text" name="manager" value={formData.manager} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="예: 김소장" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">관리사무소 연락처</label>
                  <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="010-0000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">건설사 담당자</label>
                  <input type="text" name="builderManager" value={formData.builderManager} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="이름/직급" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">건설사 연락처</label>
                  <input type="text" name="builderContact" value={formData.builderContact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="010-0000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">홈넷사 담당자</label>
                  <input type="text" name="homenetManager" value={formData.homenetManager} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="이름/직급" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">홈넷사 연락처</label>
                  <input type="text" name="homenetContact" value={formData.homenetContact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" placeholder="010-0000-0000" />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
            취소
          </button>
          <button type="submit" form="add-complex-form" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all">
            {initialData ? '수정하기' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddComplexModal;
