import { useMemo, useState } from "react";
import { api } from "../api";

function useQueryParam(name) {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
  }, [name]);
}

export default function ResetPassword() {
  const uid = useQueryParam("uid");
  const token = useQueryParam("token");

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const missing = !uid || !token;

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (pw1.length < 8) return setErr("Password must be at least 8 characters.");
    if (pw1 !== pw2) return setErr("Passwords do not match.");

    try {
      await api.passwordResetConfirm(uid, token, pw1);
      setDone(true);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center p-6">
      <div className="w-full max-w-sm bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <div className="text-xl font-semibold">Reset password</div>
          <div className="text-sm text-gray-600">
            Choose a new password.
          </div>
        </div>

        {missing && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
            Missing uid/token in URL. Make sure you opened the reset link.
          </div>
        )}

        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">{err}</div>}

        {done ? (
          <div className="text-sm text-gray-700 bg-gray-50 border rounded-xl p-3">
            Password reset successful. You can now log in.
            <div className="mt-3">
              <a className="text-sm underline" href="/">Go to login</a>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <label className="block text-sm">
              <div className="text-gray-600 mb-1">New password</div>
              <input
                type="password"
                className="w-full border rounded-xl px-3 py-2"
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
                disabled={missing}
              />
            </label>

            <label className="block text-sm">
              <div className="text-gray-600 mb-1">Confirm new password</div>
              <input
                type="password"
                className="w-full border rounded-xl px-3 py-2"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                disabled={missing}
              />
            </label>

            <button
              className="w-full bg-black text-white rounded-xl py-2 text-sm disabled:opacity-50"
              disabled={missing}
            >
              Reset password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
