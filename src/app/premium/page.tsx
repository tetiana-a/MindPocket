'use client';

import { useState } from 'react';

export default function PremiumPage() {
  const wallet = 'TFA319WbHsYfhYqVa67vXiwboxioBQM82R';
  const [code, setCode] = useState('');

  const copyWallet = async () => {
    await navigator.clipboard.writeText(wallet);
    alert('Wallet copied');
  };

  const activatePremium = () => {
    if (code.trim() === 'MINDPOCKET2026') {
      localStorage.setItem('mindpocket_premium', 'true');
      alert('Premium activated');
      window.location.href = '/';
    } else {
      alert('Wrong code');
    }
  };

  return (
    <main className="min-h-screen bg-[#05060a] text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.25),transparent_35%),radial-gradient(circle_at_bottom,rgba(34,211,238,0.18),transparent_40%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-md w-full rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl p-6 text-center shadow-2xl">
        <h1 className="text-4xl font-bold mb-2">MindPocket Premium</h1>

        <p className="text-white/60 mb-6">
          Unlimited AI emotional support and calming tools.
        </p>

        <div className="rounded-3xl bg-black/40 border border-white/10 p-5 mb-5">
          <p className="text-sm text-white/50 mb-2">Premium Access</p>
          <p className="text-3xl font-bold mb-1">10 USDT</p>
          <p className="text-xs text-white/40">Network: TRON TRC20 only</p>
        </div>

        <div className="rounded-2xl bg-white text-black p-4 mb-4 break-all text-sm font-semibold">
          {wallet}
        </div>

        <button
          onClick={copyWallet}
          className="w-full rounded-2xl bg-white/10 hover:bg-white/20 py-3 mb-4 font-semibold border border-white/10"
        >
          Copy Wallet Address
        </button>

        <a
          href="https://t.me/MindPocketPremium"
          target="_blank"
          className="block w-full rounded-2xl bg-white text-black py-3 font-bold mb-5"
        >
          I Paid — Confirm in Telegram
        </a>

        <div className="border-t border-white/10 pt-5">
          <p className="text-sm text-white/60 mb-3">
            Already paid? Enter your access code:
          </p>

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Premium code"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 mb-3 text-white outline-none"
          />

          <button
            onClick={activatePremium}
            className="w-full rounded-2xl bg-cyan-300 text-black py-3 font-bold"
          >
            Activate Premium
          </button>
        </div>
      </div>
    </main>
  );
}
