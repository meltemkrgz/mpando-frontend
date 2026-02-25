import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api, setToken } from "../api/client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,

        password,
      });

      // Token kaydet

      setToken(response.token);
      login(response);

      // Dashboard yönlendir

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F3F4] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-[1000px] flex flex-col md:flex-row shadow-2xl rounded-[32px] overflow-hidden min-h-[600px]">
        {/* LEFT */}

        <div className="bg-[#111315] w-full md:w-5/12 p-10 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 bg-[#ffffff] rounded-lg flex items-center justify-center">
                <img
                  className="text-black font-bold text-xl italic"
                  src="/logo.png"
                  alt="logo"
                />
              </div>

              <span className="text-xl font-semibold tracking-tight">
                Mpando
              </span>
            </div>

            <h2 className="text-3xl font-medium leading-tight mb-6">
              Şantiye Yönetimi Artık <br />
              <span className="text-[#d97707]">Çok Daha</span> Kolay
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Tüm tarafları tek sistemde birleştiren bir platform!
            </p>
          </div>

          <div className="hidden md:block">
            <div className="bg-[#1C1F21] p-4 rounded-2xl border border-gray-800">
              <p className="text-xs text-gray-500 mb-1">Aktif Kullanıcılar</p>

              <p className="text-2xl font-bold">
                102
                <span className="text-[#FF5C5C] text-xs font-normal">-9%</span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#111315] mb-2">
              Tekrar Hoş Geldiniz!
            </h1>

            <p className="text-gray-500">
              Lütfen giriş bilgilerinizi aşağıya girin.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-4 bg-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>

              <input
                type="email"
                placeholder="ornek@mail.com"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#90EE02] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Şifre
                </label>

                <a
                  href="#"
                  className="text-xs text-gray-400 hover:text-black transition-colors"
                >
                  Şifremi Unuttum
                </a>
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-[#d97707] cursor-pointer"
              />

              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Beni hatırla
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111315] text-white font-semibold py-4 rounded-2xl hover:bg-black transition-all transform active:scale-[0.98] shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
