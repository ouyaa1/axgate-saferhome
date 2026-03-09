import React, { useState, useMemo } from 'react';
import {
  Users, ShieldHalf, Building2, LogOut, Search, UserPlus, UserCheck,
  X, Edit, Trash2
} from 'lucide-react';
import { INITIAL_ACCOUNTS } from '../constants/data';

const AccountManagementDashboard = ({ onLog }) => {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [formData, setFormData] = useState({
    id: '', name: '', password: '', role: 'Complex Manager', status: '활성', target: ''
  });

  const filteredAccounts = accounts.filter(acc =>
    acc.name.includes(searchTerm) || acc.id.includes(searchTerm) || acc.role.includes(searchTerm)
  );

  const stats = useMemo(() => {
    return {
      total: accounts.length,
      superAdmins: accounts.filter(a => a.role === 'Super Admin').length,
      activeManagers: accounts.filter(a => a.role === 'Complex Manager' && a.status === '활성').length,
      inactive: accounts.filter(a => a.status === '비활성').length
    };
  }, [accounts]);

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({ ...account, password: '' });
    } else {
      setEditingAccount(null);
      setFormData({ id: '', name: '', password: '', role: 'Complex Manager', status: '활성', target: '' });
    }
    setShowModal(true);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (editingAccount) {
      setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...formData } : a));
      onLog && onLog(`[SYSTEM] 계정 권한이 수정되었습니다. (ID: ${formData.id})`);
    } else {
      const newAccount = { ...formData, lastLogin: '최초 로그인 전' };
      setAccounts([newAccount, ...accounts]);
      onLog && onLog(`[SYSTEM] 신규 계정이 생성되었습니다. (ID: ${formData.id})`);
    }
    setShowModal(false);
  };

  const handleDeleteAccount = (id) => {
    if (window.confirm('정말 해당 계정을 삭제하시겠습니까?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
      onLog && onLog(`[SYSTEM] 계정이 삭제되었습니다. (ID: ${id})`);
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Super Admin': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'System Engineer': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Complex Manager': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 relative">

      {/* 계정 추가/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-indigo-600" /> {editingAccount ? '계정 권한 수정' : '신규 계정 생성'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveAccount} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">사용자 이름</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="예: 홍길동" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">로그인 ID</label>
                  <input required type="text" disabled={editingAccount} value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50" placeholder="영문, 숫자 조합" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">초기 비밀번호 {editingAccount && '(변경시에만 입력)'}</label>
                <input type="password" required={!editingAccount} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="비밀번호를 입력하세요" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">권한 등급 (Role)</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer">
                    <option value="Super Admin">Super Admin (최고관리자)</option>
                    <option value="System Engineer">System Engineer (엔지니어)</option>
                    <option value="Complex Manager">Complex Manager (단지관리자)</option>
                    <option value="Viewer">Viewer (단순열람)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">계정 상태</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer">
                    <option value="활성">활성 (접속 허용)</option>
                    <option value="비활성">비활성 (접속 차단)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">담당 단지 및 접속 허용 범위</label>
                <input type="text" value={formData.target} onChange={e => setFormData({...formData, target: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="예: AX-PRM-01, AX-PRM-02 또는 전체" />
                <p className="text-[10px] text-slate-400 mt-1.5 ml-1">* 단지관리자(Complex Manager) 권한 부여 시 반드시 열람 가능한 단지를 명시해야 합니다.</p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">취소</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all">{editingAccount ? '권한 수정' : '계정 생성'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상단 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">전체 등록 계정</p><p className="text-3xl font-black text-slate-800 mt-1">{stats.total}<span className="text-sm font-medium text-slate-500 ml-1">명</span></p></div>
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500"><Users /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-rose-600 uppercase tracking-wider">최고 권한 (Admin)</p><p className="text-3xl font-black text-rose-600 mt-1">{stats.superAdmins}<span className="text-sm font-medium text-rose-600/60 ml-1">명</span></p></div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600"><ShieldHalf /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">단지 관리자 (Active)</p><p className="text-3xl font-black text-emerald-600 mt-1">{stats.activeManagers}<span className="text-sm font-medium text-emerald-600/60 ml-1">명</span></p></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Building2 /></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between opacity-80">
          <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">비활성 계정</p><p className="text-3xl font-black text-slate-600 mt-1">{stats.inactive}<span className="text-sm font-medium text-slate-400 ml-1">명</span></p></div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400"><LogOut /></div>
        </div>
      </div>

      {/* 메인 리스트 영역 */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-200/60 flex flex-col overflow-hidden min-h-[500px]">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <ShieldHalf className="w-6 h-6 text-indigo-600" /> 관리자 접근 제어 리스트
          </h3>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <input type="text" placeholder="이름, ID, 권한 검색..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-64 bg-white border border-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm placeholder:text-slate-400" />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button onClick={() => handleOpenModal()} className="px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> 신규 계정 발급
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-40">이름 / ID</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-48 text-center">권한 그룹 (Role)</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center w-28">상태</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">접근 허용 단지 범위</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-40 text-center">최근 접속일시</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider w-24 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map(account => (
                  <tr key={account.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{account.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">{account.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded border text-[11px] font-bold ${getRoleBadge(account.role)}`}>
                        {account.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap ${account.status === '활성' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {account.status === '활성' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></div>}
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 truncate max-w-[200px]" title={account.target}>
                      {account.target}
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-mono text-slate-500">
                      {account.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleOpenModal(account)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="수정"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteAccount(account.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="삭제"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-slate-400 font-medium bg-slate-50/50">
                      등록된 계정이 없거나 검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagementDashboard;
