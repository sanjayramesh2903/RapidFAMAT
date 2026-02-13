'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { rounds } from '@/lib/problems';
import { Mode, Problem, Round } from '@/lib/types';

type Feedback = { kind: 'correct' | 'incorrect'; text: string } | null;

const contestSize = 25;

function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function HomePage() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<Mode>('infinite');
  const [roundFilter, setRoundFilter] = useState<'All' | Round>('All');
  const [dark, setDark] = useState(false);
  const [rating, setRating] = useState(1200);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [allTimeSolved, setAllTimeSolved] = useState(0);
  const [timedSeconds, setTimedSeconds] = useState(600);
  const [timedCorrect, setTimedCorrect] = useState(0);
  const [contestRemaining, setContestRemaining] = useState(1500);
  const [contestIndex, setContestIndex] = useState(0);
  const [contestCorrect, setContestCorrect] = useState(0);
  const [lastReview, setLastReview] = useState<{ answer: string; solution: string } | null>(null);
  const [topicPerf, setTopicPerf] = useState<Record<string, { correct: number; total: number }>>({});
  const [allowBlankSkip] = useState(false);

  const seenRef = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const setRootTheme = useCallback((isDark: boolean) => {
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    const storedBest = Number(localStorage.getItem('bestStreak') ?? 0);
    const storedSolved = Number(localStorage.getItem('allTimeSolved') ?? 0);
    const storedDark = localStorage.getItem('darkMode') === '1';
    setBestStreak(storedBest);
    setAllTimeSolved(storedSolved);
    setDark(storedDark);
    setRootTheme(storedDark);
  }, [setRootTheme]);

  const fetchProblem = useCallback(async () => {
    setLoading(true);
    const exclude = Array.from(seenRef.current).join(',');
    const res = await fetch(`/api/problems?exclude=${encodeURIComponent(exclude)}&round=${encodeURIComponent(roundFilter)}&rating=${rating}`);
    const data = await res.json();
    const nextProblem: Problem = data.problem;

    if (seenRef.current.size >= 200) {
      seenRef.current.clear();
    }
    seenRef.current.add(nextProblem.id);
    setProblem(nextProblem);
    setInput('');
    setFeedback(null);
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [rating, roundFilter]);

  useEffect(() => {
    void fetchProblem();
  }, [fetchProblem, mode]);

  useEffect(() => {
    if (mode !== 'timed') return;
    if (timedSeconds <= 0) return;
    const t = setInterval(() => setTimedSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [mode, timedSeconds]);

  useEffect(() => {
    if (mode !== 'contest') return;
    if (contestRemaining <= 0) return;
    const t = setInterval(() => setContestRemaining((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [mode, contestRemaining]);

  const onModeChange = (nextMode: Mode) => {
    setMode(nextMode);
    setCurrentStreak(0);
    setSessionStreak(0);
    seenRef.current.clear();
    if (nextMode === 'timed') {
      setTimedSeconds(600);
      setTimedCorrect(0);
    }
    if (nextMode === 'contest') {
      setContestRemaining(1500);
      setContestCorrect(0);
      setContestIndex(0);
    }
  };

  const submit = async () => {
    if (!problem || loading || submitting) return;
    if (!input.trim() && !allowBlankSkip) return;

    setSubmitting(true);
    const guess = input.trim();
    const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const correct = normalize(guess) === normalize(problem.answer);

    setTopicPerf((prev) => {
      const next = { ...prev };
      for (const topic of problem.topics) {
        const current = next[topic] ?? { correct: 0, total: 0 };
        next[topic] = {
          correct: current.correct + (correct ? 1 : 0),
          total: current.total + 1
        };
      }
      return next;
    });

    if (correct) {
      setFeedback({ kind: 'correct', text: '✓ Correct' });
      setCurrentStreak((v) => v + 1);
      setSessionStreak((v) => v + 1);
      setAllTimeSolved((v) => {
        const next = v + 1;
        localStorage.setItem('allTimeSolved', String(next));
        return next;
      });
      setRating((r) => r + 8);
      if (mode === 'timed') setTimedCorrect((v) => v + 1);
      if (mode === 'contest') {
        setContestCorrect((v) => v + 1);
        setContestIndex((v) => v + 1);
      }

      const streakAfter = currentStreak + 1;
      if (streakAfter > bestStreak) {
        setBestStreak(streakAfter);
        localStorage.setItem('bestStreak', String(streakAfter));
      }

      setTimeout(() => {
        if (mode === 'contest' && contestIndex + 1 >= contestSize) {
          setFeedback({ kind: 'correct', text: 'Contest complete!' });
        } else {
          void fetchProblem();
        }
      }, 700);
    } else {
      setFeedback({ kind: 'incorrect', text: '✗ Incorrect' });
      setCurrentStreak(0);
      setRating((r) => Math.max(900, r - 12));
      setLastReview({ answer: problem.answer, solution: problem.shortSolution });
      if (mode === 'contest') setContestIndex((v) => v + 1);
    }

    setSubmitting(false);
  };

  const contestScore = useMemo(() => contestCorrect * 6, [contestCorrect]);

  return (
    <main className="min-h-screen px-4 py-3 md:px-8">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-accent">FAMATrivial</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold">Streak: {currentStreak}</span>
          <button
            aria-label="toggle dark mode"
            className="rounded border px-2 py-1"
            onClick={() => {
              const next = !dark;
              setDark(next);
              localStorage.setItem('darkMode', next ? '1' : '0');
              setRootTheme(next);
            }}
          >
            ⚙︎
          </button>
        </div>
      </header>

      <section className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-xs md:text-sm">
        <select className="rounded border px-2 py-1" value={roundFilter} onChange={(e) => setRoundFilter(e.target.value as 'All' | Round)}>
          <option value="All">All problems</option>
          {rounds.map((round) => (
            <option key={round} value={round}>{round}</option>
          ))}
        </select>

        <select className="rounded border px-2 py-1" value={mode} onChange={(e) => onModeChange(e.target.value as Mode)}>
          <option value="infinite">Infinite</option>
          <option value="timed">10-min Sprint</option>
          <option value="contest">Contest Sim (25)</option>
        </select>

        <div className="rounded border px-2 py-1">Best: {bestStreak}</div>
        <div className="rounded border px-2 py-1">Session: {sessionStreak}</div>
        <div className="rounded border px-2 py-1">Solved: {allTimeSolved}</div>
      </section>

      {mode === 'timed' && <p className="mt-3 text-center font-semibold">Time: {formatSeconds(Math.max(0, timedSeconds))} • Correct: {timedCorrect}</p>}
      {mode === 'contest' && <p className="mt-3 text-center font-semibold">Contest Time: {formatSeconds(Math.max(0, contestRemaining))} • #{contestIndex + 1}/{contestSize} • Score: {contestScore}</p>}

      <section className="mx-auto mt-10 flex max-w-3xl flex-col items-center text-center">
        <div className="mb-2 text-5xl font-black">{currentStreak}</div>
        {problem ? (
          <article className="fade-in w-full">
            <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
              {problem.round} • {problem.year} P{problem.number} • est {problem.estimatedSolveTimeSec}s
            </p>
            <p className="text-2xl leading-relaxed">{problem.statement}</p>
          </article>
        ) : (
          <p>Loading problem…</p>
        )}
      </section>

      <section className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-2">
        <div className="flex w-full gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void submit();
              }
            }}
            placeholder="Type answer"
            className="w-full rounded border px-3 py-2"
            disabled={loading || submitting || (mode === 'timed' && timedSeconds <= 0) || (mode === 'contest' && contestRemaining <= 0)}
          />
          <button onClick={() => void submit()} className="rounded bg-accent px-4 py-2 font-semibold text-white disabled:opacity-50" disabled={submitting || loading}>
            Submit
          </button>
        </div>

        <div className="h-5 text-sm">
          {feedback && <span className={feedback.kind === 'correct' ? 'text-green-600' : 'text-red-600'}>{feedback.text}</span>}
        </div>

        {feedback?.kind === 'incorrect' && (
          <button className="rounded border px-3 py-1 text-sm" onClick={() => void fetchProblem()}>
            Next Problem
          </button>
        )}

        {lastReview && (
          <aside className="mt-2 w-full rounded border border-zinc-300 p-3 text-left text-sm dark:border-zinc-700">
            <div className="font-semibold">Review</div>
            <div>Official answer: {lastReview.answer}</div>
            <div>Why: {lastReview.solution}</div>
          </aside>
        )}

        <details className="mt-3 w-full text-xs text-zinc-600 dark:text-zinc-300">
          <summary className="cursor-pointer">Topic performance</summary>
          <ul className="mt-2 space-y-1">
            {Object.entries(topicPerf).map(([topic, stats]) => {
              const pct = Math.round((stats.correct / stats.total) * 100);
              return <li key={topic}>{topic}: {stats.correct}/{stats.total} ({pct}%)</li>;
            })}
          </ul>
        </details>
      </section>
    </main>
  );
}
