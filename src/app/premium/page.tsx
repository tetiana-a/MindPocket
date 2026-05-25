export default function PremiumPage() {
  const wallet = 'TFA319WbHsYfhYqVa67vXiwboxioBQM82R';

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
        <h1 className="text-3xl font-bold mb-3">MindPocket Premium</h1>

        <p className="text-white/60 mb-6">
          Unlock unlimited AI chat and premium calming features.
        </p>

        <div className="rounded-2xl bg-black/50 border border-white/10 p-4 mb-5">
          <p className="text-sm text-white/50 mb-2">Price</p>
          <p className="text-2xl font-bold">10 USDT</p>
          <p className="text-xs text-white/40 mt-1">Network: TRON TRC20 only</p>
        </div>

        <div className="rounded-2xl bg-white text-black p-4 mb-4 break-all text-sm font-semibold">
          {wallet}
        </div>

        <button
          onClick={() => navigator.clipboard.writeText(wallet)}
          className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 mb-4 font-semibold"
        >
          Copy wallet address
        </button>

        <a
          href="https://t.me/DigitalTK"
          target="_blank"
          className="block w-full rounded-2xl bg-white text-black py-3 font-semibold"
        >
          I paid — confirm in Telegram
        </a>

        <p className="text-xs text-white/35 mt-4">
          After payment, send screenshot and your email/username in Telegram.
        </p>
      </div>
    </main>
  );
}
