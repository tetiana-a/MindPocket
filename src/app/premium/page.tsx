'use client';

export default function PremiumPage() {
  const wallet = 'TFA319WbHsYfhYqVa67vXiwboxioBQM82R';

  const copyWallet = async () => {
    await navigator.clipboard.writeText(wallet);
    alert('Wallet copied');
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center shadow-2xl">

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">
            MindPocket Premium
          </h1>

          <p className="text-white/60">
            Unlimited AI emotional support and calming tools.
          </p>
        </div>

        <div className="rounded-3xl bg-black/40 border border-white/10 p-5 mb-5">
          <p className="text-sm text-white/50 mb-2">
            Premium Access
          </p>

          <p className="text-3xl font-bold mb-1">
            10 USDT
          </p>

          <p className="text-xs text-white/40">
            Network: TRON (TRC20)
          </p>
        </div>

        <div className="rounded-2xl bg-white text-black p-4 mb-4 break-all text-sm font-semibold">
          {wallet}
        </div>

        <button
          onClick={copyWallet}
          className="w-full rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 py-3 mb-4 font-semibold border border-white/10"
        >
          Copy Wallet Address
        </button>

        <a
          href="https://t.me/DigitalTK"
          target="_blank"
          className="block w-full rounded-2xl bg-white text-black py-3 font-bold hover:scale-[1.02] transition-all duration-300"
        >
          I Paid — Confirm in Telegram
        </a>

        <p className="text-xs text-white/35 mt-5 leading-relaxed">
          After payment, send payment screenshot and your email or username in Telegram.
        </p>
      </div>
    </main>
  );
}
