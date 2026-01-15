import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

function Login({ onLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.login(username, password);
      onLoggedIn();
    } catch (e2) {
      setErr(e2.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 grid place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <div className="text-xl font-semibold">Login</div>
          <div className="text-sm text-gray-600">JWT auth (Django + DRF)</div>
        </div>

        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">{err}</div>}

        <label className="block text-sm">
          <div className="text-gray-600 mb-1">Username</div>
          <input className="w-full border rounded-xl px-3 py-2" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label className="block text-sm">
          <div className="text-gray-600 mb-1">Password</div>
          <input type="password" className="w-full border rounded-xl px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button className="w-full bg-black text-white rounded-xl py-2 text-sm">Sign in</button>

        <div className="flex justify-between text-sm">
          <a className="underline" href="/forgot-password">Forgot password?</a>
        </div>

        <div className="text-xs text-gray-500">
          Create a user via <code>POST /api/auth/register/</code> (we can add a Register UI next).
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [me, setMe] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState("");

  const enrolledIds = useMemo(() => {
    const s = new Set();
    for (const e of enrollments) if (e.status === "ENROLLED") s.add(e.course.id);
    return s;
  }, [enrollments]);

  async function load() {
    setError("");
    try {
      const [m, c, e] = await Promise.all([api.me(), api.listCourses(), api.myEnrollments()]);
      setMe(m);
      setCourses(c);
      setEnrollments(e);
      setAuthed(true);
    } catch (err) {
      setAuthed(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enroll(courseId) {
    setError("");
    try {
      await api.enroll(courseId);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function drop(courseId) {
    setError("");
    try {
      await api.drop(courseId);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  function logout() {
    api.logout();
    setAuthed(false);
    setMe(null);
  }

  if (!authed) return <Login onLoggedIn={load} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Student Enrollment</h1>
            <p className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{me?.first_name} {me?.last_name}</span> ({me?.student_number})
            </p>
          </div>
          <button onClick={logout} className="rounded-xl border bg-white px-4 py-2 text-sm hover:bg-gray-50">
            Logout
          </button>
        </header>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-white p-5">
            <h2 className="font-semibold mb-4">Courses</h2>
            <div className="space-y-3">
              {courses.map((c) => {
                const isEnrolled = enrolledIds.has(c.id);
                const full = c.enrolled_count >= c.capacity;

                return (
                  <div key={c.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{c.code} — {c.title}</div>
                        <div className="text-sm text-gray-600">
                          Seats: {c.enrolled_count}/{c.capacity} • Credits: {c.credits}
                        </div>
                        <div className="text-sm text-gray-600">
                          Instructor: {c.instructor ? c.instructor.name : "TBA"}
                        </div>
                      </div>

                      {!isEnrolled ? (
                        <button
                          onClick={() => enroll(c.id)}
                          disabled={full}
                          className="rounded-xl px-3 py-2 text-sm border bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          Enroll
                        </button>
                      ) : (
                        <button
                          onClick={() => drop(c.id)}
                          className="rounded-xl px-3 py-2 text-sm border bg-white hover:bg-gray-50"
                        >
                          Drop
                        </button>
                      )}
                    </div>
                    {full && !isEnrolled && <div className="mt-2 text-xs text-gray-500">This course is full.</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="font-semibold mb-4">My Enrollments</h2>
            <div className="space-y-3">
              {enrollments.map((e) => (
                <div key={e.id} className="rounded-xl border p-4">
                  <div className="font-medium">{e.course.code} — {e.course.title}</div>
                  <div className="text-sm text-gray-600">Status: <span className="font-medium">{e.status}</span></div>
                  <div className="text-xs text-gray-500">{new Date(e.enrolled_at).toLocaleString()}</div>
                </div>
              ))}
              {enrollments.length === 0 && <div className="text-sm text-gray-600">No enrollments yet.</div>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
