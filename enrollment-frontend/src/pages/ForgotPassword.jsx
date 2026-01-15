import { useState } from "react";
import { api } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.passwordResetRequest(email);
      setDone(true);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center p-6">
      <div className="w-full max-w-sm bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <div className="text-xl font-semibold">Forgot password</div>
          <div className="text-sm text-gray-600">
            Enter your email. If an account exists, we’ll send a reset link.
          </div>
        </div>

        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">{err}</div>}

        {done ? (
          <div className="text-sm text-gray-700 bg-gray-50 border rounded-xl p-3">
            If an account exists for <span className="font-medium">{email}</span>, a reset link was sent.
            <div className="text-xs text-gray-500 mt-2">
              (In dev mode, check your Django terminal — the link is printed there.)
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <label className="block text-sm">
              <div className="text-gray-600 mb-1">Email</div>
              <input
                className="w-full border rounded-xl px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student1@example.com"
              />
            </label>

            <button className="w-full bg-black text-white rounded-xl py-2 text-sm">
              Send reset link
            </button>
          </form>
        )}

        <a className="text-sm underline" href="/">
          Back to login
        </a>
      </div>
    </div>
  );
}
