import React, { useEffect, useMemo } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Code2,
  Trophy,
  Users,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Zap,
  Target,
  BookOpen,
  GitBranch,
  Terminal,
} from "lucide-react";

function HomePage() {
  const { getAllProblems, problems } = useProblemStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  const stats = useMemo(() => {
    if (!Array.isArray(problems) || problems.length === 0)
      return { total: 0, solved: 0, easy: 0, medium: 0, hard: 0 };
    let solved = 0, easy = 0, medium = 0, hard = 0;
    problems.forEach((p) => {
      const isSolved = (p.solvedBy || []).some((s) => s.userId === authUser?.id);
      if (isSolved) solved++;
      if (p.difficulty === "EASY") easy++;
      else if (p.difficulty === "MEDIUM") medium++;
      else if (p.difficulty === "HARD") hard++;
    });
    return { total: problems.length, solved, easy, medium, hard };
  }, [problems, authUser]);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* ═══════ DOT GRID BACKGROUND ═══════ */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        {/* Floating Language Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top left */}
          <div className="absolute top-[12%] left-[8%] text-4xl animate-float-slow opacity-60 select-none">
            <span className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl font-bold border border-blue-500/20">C++</span>
          </div>
          {/* Top center */}
          <div className="absolute top-[8%] left-[42%] text-3xl animate-float-medium opacity-50 select-none">
            <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-xl font-bold border border-yellow-500/20">JS</span>
          </div>
          {/* Top right */}
          <div className="absolute top-[15%] right-[10%] text-3xl animate-float-fast opacity-50 select-none">
            <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-xl font-bold border border-cyan-500/20">Go</span>
          </div>
          {/* Mid left */}
          <div className="absolute top-[55%] left-[5%] text-3xl animate-float-medium opacity-40 select-none">
            <span className="bg-red-500/10 text-red-400 px-3 py-1.5 rounded-xl font-bold border border-red-500/20">Java</span>
          </div>
          {/* Mid right */}
          <div className="absolute top-[45%] right-[6%] text-3xl animate-float-slow opacity-50 select-none">
            <span className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-xl font-bold border border-green-500/20">Py</span>
          </div>
          {/* Bottom */}
          <div className="absolute bottom-[20%] right-[25%] text-2xl animate-float-fast opacity-40 select-none">
            <span className="bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-xl font-bold border border-purple-500/20">TS</span>
          </div>
          <div className="absolute bottom-[25%] left-[20%] text-2xl animate-float-medium opacity-40 select-none">
            <span className="bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-xl font-bold border border-orange-500/20">Rust</span>
          </div>
        </div>

        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            A Lab where Coders{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Practice</span>
              <span className="absolute inset-0 bg-primary/80 -skew-y-1 rounded-lg -z-0 scale-x-105 scale-y-110"></span>
            </span>{" "}
            and{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Prove</span>
              <span className="absolute inset-0 bg-blue-500/80 -skew-y-1 rounded-lg -z-0 scale-x-105 scale-y-110"></span>
            </span>{" "}
            Themselves
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Train rigorously, solve real challenges, and sharpen your coding mind.
            <br />
            LeetLab is your lab to practice and push past your limits — built for coders who want to lead.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            {authUser ? (
              <>
                <Link
                  to="/problems"
                  className="btn btn-lg bg-white text-black hover:bg-gray-200 border-none rounded-xl px-8 font-bold gap-2 shadow-lg shadow-white/10"
                >
                  Start Solving
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/contests"
                  className="btn btn-lg btn-outline rounded-xl px-8 font-bold gap-2 border-gray-600 hover:bg-white/5"
                >
                  <Trophy className="w-5 h-5" />
                  Explore Contests
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="btn btn-lg bg-white text-black hover:bg-gray-200 border-none rounded-xl px-8 font-bold gap-2 shadow-lg shadow-white/10"
                >
                  Join For Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-lg btn-outline rounded-xl px-8 font-bold gap-2 border-gray-600 hover:bg-white/5"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ BENTO FEATURE GRID ═══════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">
          Everything you need to{" "}
          <span className="text-primary">level up</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
          Powerful tools designed to help you master data structures, algorithms, and ace your coding interviews.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ── Card 1: Problem Library (wide) ── */}
          <div className="md:col-span-2 bg-base-200 rounded-3xl p-6 border border-base-300 group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Code2 className="w-7 h-7 text-primary" />
              </div>
              <Link to="/problems" className="btn btn-ghost btn-sm gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Browse <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <h3 className="text-xl font-bold mb-2">Curated Problem Library</h3>
            <p className="text-gray-400 text-sm mb-5">
              Handpicked problems across Arrays, Trees, Graphs, DP, and more — organized by topic and difficulty.
            </p>
            {/* Mini problem preview */}
            <div className="space-y-2">
              {[
                { title: "Two Sum", diff: "EASY", tags: ["Array", "Hash Table"] },
                { title: "Longest Substring", diff: "MEDIUM", tags: ["String", "Sliding Window"] },
                { title: "Merge K Sorted Lists", diff: "HARD", tags: ["Linked List", "Heap"] },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 bg-base-300/50 rounded-xl px-4 py-2.5">
                  <div className={`w-2 h-2 rounded-full ${p.diff === "EASY" ? "bg-success" : p.diff === "MEDIUM" ? "bg-warning" : "bg-error"}`} />
                  <span className="font-medium text-sm flex-1">{p.title}</span>
                  <div className="flex gap-1">
                    {p.tags.map((t, j) => (
                      <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-base-100/50 text-gray-400">{t}</span>
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold ${p.diff === "EASY" ? "text-success" : p.diff === "MEDIUM" ? "text-warning" : "text-error"}`}>
                    {p.diff}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Card 2: Live Contests ── */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 group hover:border-blue-500/30 transition-all duration-300">
            <div className="p-3 bg-blue-500/10 rounded-2xl w-fit mb-4">
              <Trophy className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Contests</h3>
            <p className="text-gray-400 text-sm mb-5">
              Compete in timed contests with students worldwide. Climb the leaderboard and prove your skills.
            </p>
            <div className="bg-base-300/50 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </span>
                <span className="text-success font-bold text-sm">Live Now</span>
              </div>
              <p className="text-xs text-gray-500">Contest running — join and compete!</p>
              <Link to="/contests" className="btn btn-sm btn-primary mt-3 gap-1">
                Enter <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* ── Card 3: Track Progress ── */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 group hover:border-emerald-500/30 transition-all duration-300">
            <div className="p-3 bg-emerald-500/10 rounded-2xl w-fit mb-4">
              <Target className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-400 text-sm mb-4">
              Monitor your growth with detailed stats and streak tracking.
            </p>
            {/* Progress circles */}
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="radial-progress text-success text-sm" style={{ "--value": stats.easy ? 70 : 0, "--size": "3.5rem", "--thickness": "4px" }} role="progressbar">
                  <span className="text-xs font-bold">{stats.easy}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Easy</p>
              </div>
              <div className="text-center">
                <div className="radial-progress text-warning text-sm" style={{ "--value": stats.medium ? 50 : 0, "--size": "3.5rem", "--thickness": "4px" }} role="progressbar">
                  <span className="text-xs font-bold">{stats.medium}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Medium</p>
              </div>
              <div className="text-center">
                <div className="radial-progress text-error text-sm" style={{ "--value": stats.hard ? 30 : 0, "--size": "3.5rem", "--thickness": "4px" }} role="progressbar">
                  <span className="text-xs font-bold">{stats.hard}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Hard</p>
              </div>
            </div>
          </div>

          {/* ── Card 4: Language Suite (wide) ── */}
          <div className="md:col-span-2 bg-base-200 rounded-3xl p-6 border border-base-300 group hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl">
                <Terminal className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Language Support</h3>
            <p className="text-gray-400 text-sm mb-5">
              Write and submit solutions in your preferred language. We support all major programming languages with our integrated code editor.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "JavaScript", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                { name: "Python", color: "text-green-400 bg-green-500/10 border-green-500/20" },
                { name: "Java", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                { name: "C++", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { name: "TypeScript", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
                { name: "Go", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
              ].map((lang) => (
                <div key={lang.name} className={`px-4 py-2.5 rounded-xl font-semibold text-sm border ${lang.color}`}>
                  {lang.name}
                </div>
              ))}
            </div>
          </div>

          {/* ── Card 5: Learning Paths ── */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 group hover:border-violet-500/30 transition-all duration-300 md:col-span-1">
            <div className="p-3 bg-violet-500/10 rounded-2xl w-fit mb-4">
              <GitBranch className="w-7 h-7 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Learning Roadmaps</h3>
            <p className="text-gray-400 text-sm mb-4">
              Follow structured paths from beginner to advanced with curated playlists.
            </p>
            <Link to="/problems" className="btn btn-sm btn-outline gap-1 border-gray-700">
              <BookOpen className="w-4 h-4" /> Explore
            </Link>
          </div>

          {/* ── Card 6: Real-time Execution ── */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 group hover:border-rose-500/30 transition-all duration-300 md:col-span-1">
            <div className="p-3 bg-rose-500/10 rounded-2xl w-fit mb-4">
              <Zap className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Execution</h3>
            <p className="text-gray-400 text-sm mb-4">
              Run and test your code instantly with our Judge0-powered execution engine. Get detailed results per test case.
            </p>
            {/* Mini terminal look */}
            <div className="bg-black/40 rounded-xl p-3 font-mono text-xs">
              <p className="text-green-400">$ leetlab run solution.js</p>
              <p className="text-gray-500 mt-1">Running 3 test cases...</p>
              <p className="text-success mt-1">✓ All test cases passed (0.02s)</p>
            </div>
          </div>

          {/* ── Card 7: Performance Dashboard ── */}
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300 group hover:border-cyan-500/30 transition-all duration-300 md:col-span-1">
            <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit mb-4">
              <BarChart3 className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Performance Stats</h3>
            <p className="text-gray-400 text-sm mb-4">
              Detailed analytics on your submissions, time complexity, and comparison with peers.
            </p>
            {/* Mini bar chart */}
            <div className="flex items-end gap-2 h-16">
              {[40, 65, 30, 80, 55, 90, 45, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-cyan-500/60 to-cyan-400/20 rounded-t-md transition-all group-hover:from-cyan-500/80 group-hover:to-cyan-400/40"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS SECTION ═══════ */}
      <section className="relative z-10 py-16 border-t border-b border-base-300">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${stats.total}+`, label: "Coding Problems", icon: Code2, color: "text-primary" },
              { value: `${stats.solved}`, label: "Problems Solved", icon: CheckCircle2, color: "text-success" },
              { value: "3", label: "Languages", icon: Terminal, color: "text-amber-400" },
              { value: "Live", label: "Contests", icon: Trophy, color: "text-blue-400" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <p className="text-3xl md:text-4xl font-extrabold">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Ready to <span className="text-primary">start coding</span>?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join LeetLab today and begin your journey to mastering data structures and algorithms.
          </p>
          <Link
            to={authUser ? "/problems" : "/signup"}
            className="btn btn-lg btn-primary rounded-xl px-10 font-bold gap-2 shadow-lg shadow-primary/20"
          >
            {authUser ? "Start Solving Now" : "Join For Free"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="relative z-10 bg-neutral text-neutral-content">
        {/* Dot grid on footer */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          {/* Footer top */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-extrabold">LeetLab</h3>
            <p className="text-gray-400 mt-2">Empowering Coders to Excel, One Challenge at a Time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* About */}
            <div>
              <h4 className="font-bold text-lg mb-4">About LeetLab</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                LeetLab is your ultimate platform for coding excellence. Solve problems, track progress, and grow your skills with our cutting-edge tools.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/problems" className="text-gray-400 hover:text-primary transition-colors">Problems</Link></li>
                <li><Link to="/contests" className="text-gray-400 hover:text-primary transition-colors">Contests</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-primary transition-colors">Profile</Link></li>
              </ul>
            </div>

            {/* Built With */}
            <div>
              <h4 className="font-bold text-lg mb-4">Built With</h4>
              <div className="flex flex-wrap gap-2">
                {["React", "Node.js", "Prisma", "PostgreSQL", "Judge0", "TailwindCSS"].map((tech) => (
                  <span key={tech} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="border-t border-white/10 mt-12 pt-6 text-center">
            <p className="text-sm text-gray-500">© 2026 LeetLab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;