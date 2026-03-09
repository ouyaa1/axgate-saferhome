import React, { useState } from 'react';
import {
  Shield, X, Info, Building2, Download, Mail, Globe, ArrowUpRight,
  User, Lock, Loader2
} from 'lucide-react';

const LoginPage = ({ onLogin, onLoginWithRole }) => {
  const loginRole = 'admin';
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveId, setSaveId] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 가상의 로그인 처리 지연 효과
    setTimeout(() => {
      setIsLoading(false);
      onLoginWithRole(loginRole);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col lg:flex-row items-center lg:items-center" style={{
      fontFamily: "'Inter', sans-serif",
      backgroundImage: "url('/login-bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#1a9aa8',
    }}>

      {/* ── 상단 네비 (배경 위 오버레이) ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-end gap-4 sm:gap-8 px-4 sm:px-12 py-5 sm:py-7" style={{ zIndex: 10 }}>
        <div className="hidden md:flex items-center gap-8">
          {['ABOUT','COMPANY','DOWNLOAD','CONTACT'].map(item => (
            item === 'COMPANY' ? (
              <a key={item} href="https://www.axgate.com/main/company/about.php" target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold tracking-wider cursor-pointer hover:opacity-100 transition-opacity" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>{item}</a>
            ) : (
              <span key={item} className="text-[13px] font-semibold tracking-wider cursor-pointer hover:opacity-100 transition-opacity" style={{ color: 'rgba(255,255,255,0.75)' }}>{item}</span>
            )
          ))}
          <button className="px-6 py-2 rounded-full text-[13px] font-bold tracking-wider" style={{ color: 'white', border: '2px solid rgba(255,255,255,0.85)' }}>
            SIGN IN
          </button>
        </div>
        <button onClick={() => setMobileMenuOpen(prev => !prev)} className="flex flex-col gap-[5px] cursor-pointer ml-1 relative z-50">
          {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 2, transition: 'all 0.2s' }} />)}
        </button>
      </div>

      {/* ── 모바일/햄버거 메뉴 패널 (화이트 테마) ── */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-30" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-72 h-full z-40 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl" style={{ backgroundColor: '#FFFFFF' }}>
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #E2E8F0' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: '#1B3A6B' }}>
                  <Shield size={14} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-[14px] leading-none" style={{ color: '#1B3A6B' }}>AX<span style={{ color: '#f97316' }}>GATE</span></div>
                  <div className="text-[9px] font-bold tracking-widest uppercase leading-none mt-0.5" style={{ color: '#94A3B8' }}>SaferHome</div>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: '#94A3B8' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 메뉴 항목 */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <p className="text-[10px] font-bold px-3 mb-3 tracking-widest uppercase" style={{ color: '#94A3B8' }}>MENU</p>
              <nav className="space-y-1 mb-8">
                {[
                  { label: 'ABOUT', icon: Info, desc: '서비스 소개' },
                  { label: 'COMPANY', icon: Building2, desc: '회사 소개', url: 'https://www.axgate.com/main/company/about.php' },
                  { label: 'DOWNLOAD', icon: Download, desc: '자료 다운로드' },
                  { label: 'CONTACT', icon: Mail, desc: '문의하기' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <a key={item.label} href={item.url || '#'} target={item.url ? '_blank' : undefined} rel={item.url ? 'noopener noreferrer' : undefined} onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                      style={{ color: '#334155', textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#1B3A6B'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#F1F5F9' }}>
                        <Icon size={16} style={{ color: '#64748B' }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold">{item.label}</p>
                        <p className="text-[10px]" style={{ color: '#94A3B8' }}>{item.desc}</p>
                      </div>
                    </a>
                  );
                })}
              </nav>

              <p className="text-[10px] font-bold px-3 mb-3 tracking-widest uppercase" style={{ color: '#94A3B8' }}>PARTNER SITES</p>
              <nav className="space-y-1">
                {[
                  { name: 'AXGATE', desc: '엑스게이트 공식', url: 'https://www.axgate.com' },
                  { name: 'CVnet', desc: '홈네트워크 전문기업', url: 'https://cvnet.imweb.me/' },
                  { name: '현대HT', desc: '현대홈넷', url: 'https://hyundaiht.co.kr' },
                  { name: '삼성SDS', desc: '삼성SDS 홈IoT', url: 'https://www.samsungsds.com' },
                  { name: '코맥스', desc: '스마트홈 솔루션', url: 'https://www.commax.com' },
                  { name: '코콤', desc: '홈네트워크', url: 'https://www.kocom.co.kr' },
                ].map((site, idx) => (
                  <a key={idx} href={site.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                    style={{ color: '#334155', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#1B3A6B'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#F1F5F9' }}>
                      <Globe size={16} style={{ color: '#64748B' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold">{site.name}</p>
                      <p className="text-[10px]" style={{ color: '#94A3B8' }}>{site.desc}</p>
                    </div>
                    <ArrowUpRight size={14} style={{ color: '#CBD5E1' }} className="shrink-0" />
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* ── 로그인 카드 ── */}
      <div className="mx-auto lg:mx-0 lg:ml-14 my-20 sm:my-10 flex flex-col w-[90vw] sm:w-[400px]" style={{
        backgroundColor: '#ffffff',
        maxWidth: '420px',
        borderRadius: '28px',
        padding: '36px 32px 28px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
        zIndex: 10,
        flexShrink: 0,
      }}>
        {/* 로고 */}
        <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1B3A6B' }}>
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <div className="font-black text-[15px] leading-tight" style={{ color: '#1B3A6B' }}>
              AX<span style={{ color: '#f97316' }}>GATE</span>
            </div>
            <div className="text-[9px] font-bold tracking-widest uppercase" style={{ color: '#94A3B8' }}>SaferHome</div>
          </div>
        </div>

        {/* 아바타 */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full flex items-center justify-center" style={{ backgroundColor: '#1B3A6B' }}>
            <User size={40} className="text-white" />
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* 아이디 */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-full transition-all" style={{ border: '1.5px solid #CBD5E1' }}>
            <User size={15} style={{ color: '#94A3B8', flexShrink: 0 }} />
            <input
              type="text" required value={userId} onChange={e => setUserId(e.target.value)}
              className="flex-1 outline-none text-[13px] bg-transparent font-semibold tracking-widest"
              style={{ color: '#1B3A6B' }}
              onFocus={e => { e.currentTarget.parentElement.style.borderColor = '#1B3A6B'; }}
              onBlur={e => { e.currentTarget.parentElement.style.borderColor = '#CBD5E1'; }}
              placeholder="admin@axgate.com"
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-full transition-all" style={{ border: '1.5px solid #CBD5E1' }}>
            <Lock size={15} style={{ color: '#94A3B8', flexShrink: 0 }} />
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="flex-1 outline-none text-[14px] bg-transparent"
              style={{ color: '#1B3A6B', letterSpacing: '0.18em' }}
              onFocus={e => { e.currentTarget.parentElement.style.borderColor = '#1B3A6B'; }}
              onBlur={e => { e.currentTarget.parentElement.style.borderColor = '#CBD5E1'; }}
              placeholder="••••••••••••"
            />
          </div>


          {/* 로그인 버튼 */}
          <button
            type="submit" disabled={isLoading}
            className="w-full text-white text-[13px] font-black rounded-full py-3.5 tracking-[0.18em] uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: '#1B3A6B' }}
            onMouseEnter={e => !isLoading && (e.currentTarget.style.backgroundColor = '#142d54')}
            onMouseLeave={e => !isLoading && (e.currentTarget.style.backgroundColor = '#1B3A6B')}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'LOGIN'}
          </button>
        </form>

        {/* Remember / Forgot */}
        <div className="flex justify-between items-center mt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={saveId} onChange={e => setSaveId(e.target.checked)} className="w-3.5 h-3.5 rounded" style={{ accentColor: '#1B3A6B' }} />
            <span className="text-[11px]" style={{ color: '#94A3B8' }}>로그인 정보 저장</span>
          </label>
          <a href="#" className="text-[11px] hover:opacity-70 transition-opacity" style={{ color: '#94A3B8' }}>비밀번호를 잊으셨나요?</a>
        </div>

        {/* 하단 점 3개 */}
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {[0,1,2].map(i => (
            <div key={i} className="rounded-full" style={{ width: 9, height: 9, backgroundColor: '#CBD5E1' }} />
          ))}
        </div>
      </div>

      {/* ── 우측 Welcome 텍스트 ── */}
      <div className="hidden lg:flex flex-1 flex-col justify-end pb-14 px-14" style={{ zIndex: 5 }}>
        <h1 className="font-black leading-none mb-4" style={{ color: '#ffffff', fontSize: 'clamp(48px, 6vw, 88px)', letterSpacing: '-4px', textShadow: '0 2px 24px rgba(0,0,0,0.1)' }}>
          Welcome.
        </h1>
        <p className="text-[15px] font-bold tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
          AXGATE SAFERHOME
        </p>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '300px' }}>
          홈네트워크 안전점검부터 취약점 분석까지<br />신뢰할 수 있는 통합 보안 관제 플랫폼입니다.
        </p>
        <p className="text-[13px] mt-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
          계정이 없으신가요?{' '}
          <a href="#" style={{ color: '#ffffff', fontWeight: 700 }}>지금 가입하기</a>
        </p>
      </div>

      {/* ── 우하단 별 아이콘 ── */}
      <div className="absolute bottom-8 right-10 hidden sm:block" style={{ zIndex: 5, color: 'rgba(255,255,255,0.5)', fontSize: '28px', lineHeight: 1 }}>✦</div>
    </div>
  );
};

export default LoginPage;
