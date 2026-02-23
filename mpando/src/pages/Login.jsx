import React, { useState } from 'react';

/**
 * Login Component
 * Görseldeki "Decko" dashboard stiline uygun olarak tasarlanmıştır.
 * Koyu tema detayları ve canlı yeşil (lime) vurgular içerir.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Giriş yapılıyor:", { email, password });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 font-sans">
      {/* Ana Kart Konteynırı */}
      <div className="bg-white w-full max-w-[1000px] flex flex-col md:flex-row shadow-2xl rounded-[32px] overflow-hidden min-h-[600px]">
        
        {/* Sol Taraf: Dashboard Estetiğini Yansıtan Koyu Panel */}
        <div className="bg-[#111315] w-full md:w-5/12 p-10 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 bg-[#90EE02] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl italic">D</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Decko</span>
            </div>
            
            <h2 className="text-3xl font-medium leading-tight mb-6">
              İşletmenizi <br />
              <span className="text-[#90EE02]">Akıllıca</span> Yönetin.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Verilerinizi analiz edin, müşteri ilişkilerinizi güçlendirin ve satışlarınızı tek bir panelden takip edin.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="bg-[#1C1F21] p-4 rounded-2xl border border-gray-800">
              <p className="text-xs text-gray-500 mb-1">Aktif Kullanıcılar</p>
              <p className="text-2xl font-bold">10.369 <span className="text-[#FF5C5C] text-xs font-normal">-9%</span></p>
            </div>
          </div>
        </div>

        {/* Sağ Taraf: Login Formu */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#111315] mb-2">Tekrar Hoş Geldiniz!</h1>
            <p className="text-gray-500">Lütfen giriş bilgilerinizi aşağıya girin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Girişi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresi</label>
              <input
                type="email"
                placeholder="ornek@mail.com"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#90EE02] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Şifre Girişi */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Şifre</label>
                <a href="#" className="text-xs text-gray-400 hover:text-black transition-colors">Şifremi Unuttum</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#90EE02] focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Hatırla Beni */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 accent-[#90EE02] cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">Beni hatırla</label>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              className="w-full bg-[#111315] text-white font-semibold py-4 rounded-2xl hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-200"
            >
              Giriş Yap
            </button>
          </form>

          {/* Kayıt Ol Yönlendirmesi */}
          <p className="text-center mt-10 text-gray-500 text-sm">
            Hesabınız yok mu? <a href="#" className="text-[#111315] font-bold hover:underline">Ücretsiz Kaydolun</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;