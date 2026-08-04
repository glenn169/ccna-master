import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock3,
  Flag,
  History,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { modules } from "../data";
import { recordExamAttempt, useProgress } from "../hooks/useProgress";
import {
  answerInstruction,
  canonicalAnswerIndexes,
  correctAnswerIndexes,
  isQuestionCorrect,
  questionsByTopic,
  randomizeQuestion,
  shuffleItems,
  type PracticeQuestion,
} from "../questions";

type ExamQuestion = PracticeQuestion & {
  moduleId: string;
  moduleTitle: string;
  topicId: string;
  topicTitle: string;
};
type ExamAnswers = Record<string, number[]>;
type ExamState = "intro" | "active" | "result";
type ExamMode = "quick" | "full";
type ReviewFilter = "all" | "incorrect" | "flagged" | "unanswered";
const EXAM_CONFIG = {
  quick: { label: "Quick Mock", questions: 20, seconds: 30 * 60 },
  full: { label: "Full Simulation", questions: 100, seconds: 120 * 60 },
} as const;
const PASS_PERCENT = 70;

function questionPool() {
  return modules.flatMap((module) =>
    module.lessons.flatMap((topic) =>
      (questionsByTopic[topic.id] ?? []).map((question) => ({
        ...question,
        moduleId: module.id,
        moduleTitle: module.title,
        topicId: topic.id,
        topicTitle: topic.title,
      })),
    ),
  );
}

function createExam(mode: ExamMode, recentQuestionIds = new Set<string>()) {
  const pool = questionPool();
  const total = EXAM_CONFIG[mode].questions;
  return shuffleItems(
    modules.flatMap((module) => {
      const domainPool = pool.filter((question) => question.moduleId === module.id)
      const fresh = shuffleItems(domainPool.filter((question) => !recentQuestionIds.has(question.id)))
      const recent = shuffleItems(domainPool.filter((question) => recentQuestionIds.has(question.id)))
      return [...fresh, ...recent].slice(0, Math.round((module.weight / 100) * total))
    }),
  ).map(randomizeQuestion);
}

function formatTimer(seconds: number) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function answerText(
  question: PracticeQuestion,
  selected: number[] | undefined,
) {
  return selected?.length
    ? selected.map((index) => question.choices[index]).join("; ")
    : "Not answered";
}

function toggleExamAnswer(
  current: ExamAnswers,
  question: ExamQuestion,
  choiceIndex: number,
): ExamAnswers {
  const required = correctAnswerIndexes(question).length;
  const selected = current[question.id] ?? [];
  if (required === 1) return { ...current, [question.id]: [choiceIndex] };
  const next = selected.includes(choiceIndex)
    ? selected.filter((value) => value !== choiceIndex)
    : selected.length < required
      ? [...selected, choiceIndex]
      : selected;
  if (!next.length) {
    const { [question.id]: _removed, ...rest } = current;
    void _removed;
    return rest;
  }
  return { ...current, [question.id]: next };
}

export function Exam() {
  const [state, setState] = useState<ExamState>("intro");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswers>({});
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<ExamMode>("quick");
  const [secondsLeft, setSecondsLeft] = useState(EXAM_CONFIG.quick.seconds);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(0);
  const submitted = useRef(false);
  const { examAttempts, bestExamScore } = useProgress();

  async function submitExam() {
    if (submitted.current || !questions.length) return;
    submitted.current = true;
    setSaving(true);
    const finalScore = questions.filter((question) =>
      isQuestionCorrect(question, answers[question.id]),
    ).length;
    await recordExamAttempt(
      questions.map((question) => question.id),
      Object.fromEntries(questions.map((question) => [question.id, canonicalAnswerIndexes(question, answers[question.id])])),
      finalScore,
      EXAM_CONFIG[mode].seconds - secondsLeft,
      mode,
    );
    setScore(finalScore);
    setState("result");
    setSaving(false);
  }

  useEffect(() => {
    if (state !== "active") return;
    if (secondsLeft <= 0) {
      void submitExam();
      return;
    }
    const timer = window.setInterval(
      () => setSecondsLeft((value) => value - 1),
      1000,
    );
    return () => window.clearInterval(timer);
  });

  function startExam(selectedMode: ExamMode = mode) {
    const recentQuestionIds = new Set(examAttempts.slice(0, 3).flatMap((attempt) => attempt.questionIds))
    setMode(selectedMode);
    setQuestions(createExam(selectedMode, recentQuestionIds));
    setIndex(0);
    setAnswers({});
    setFlags(new Set());
    setSecondsLeft(EXAM_CONFIG[selectedMode].seconds);
    setReviewFilter("all");
    setScore(0);
    submitted.current = false;
    setState("active");
  }

  if (state === "intro")
    return (
      <section className="mx-auto max-w-4xl">
        <header className="rounded-3xl bg-navy-950 p-7 text-white sm:p-10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400 text-navy-950">
            <ClipboardCheck size={28} />
          </span>
          <p className="eyebrow mt-6">CCNA exam mode</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">
            Choose your CCNA exam mode
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Test all six domains under timed conditions. Questions follow the
            official blueprint weighting and feedback is shown only after
            submission.
          </p>
        </header>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ModeCard title="Quick Mock" text="A focused daily check with 20 weighted questions in 30 minutes." onClick={() => startExam("quick")} />
          <ModeCard title="Full Simulation" text="A complete 100-question experience with a 120-minute countdown." onClick={() => startExam("full")} featured />
        </div>
        <div className="card mt-6 p-6">
          <h2 className="text-xl font-black text-navy-950">Before you begin</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>
              • Answered, unanswered and flagged questions are visible in the
              question navigator.
            </li>
            <li>
              • You can move backward and forward until you submit or the timer
              reaches zero.
            </li>
            <li>
              • Your score, domain breakdown and answer review are saved only on
              this device.
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {examAttempts.length > 0 && (
              <Link
                to="/exam/history"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-black"
              >
                <History size={18} />
                History · Best {bestExamScore}%
              </Link>
            )}
          </div>
        </div>
      </section>
    );

  if (state === "result") {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <section className="mx-auto max-w-5xl">
        <div className="card p-7 text-center sm:p-10">
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${percent >= PASS_PERCENT ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
          >
            <Trophy size={31} />
          </span>
          <p className="eyebrow mt-5">Mock exam complete</p>
          <h1 className="mt-2 text-3xl font-black text-navy-950">
            {percent >= PASS_PERCENT
              ? "Target achieved"
              : "Keep building your score"}
          </h1>
          <p className="mt-3 text-slate-600">
            You scored{" "}
            <strong>
              {score} out of {questions.length}
            </strong>{" "}
            ({percent}%).
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => startExam(mode)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy-950 px-5 py-3 text-sm font-black text-white"
            >
              <RotateCcw size={17} />
              New {EXAM_CONFIG[mode].label}
            </button>
            <Link
              to="/exam/history"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-black"
            >
              <History size={17} />
              Exam history
            </Link>
          </div>
        </div>
        <DomainBreakdown questions={questions} answers={answers} />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-3"><h2 className="text-2xl font-black text-navy-950">Answer review</h2><div className="flex flex-wrap gap-2">{(['all','incorrect','flagged','unanswered'] as ReviewFilter[]).map((filter) => <button key={filter} onClick={() => setReviewFilter(filter)} className={`rounded-lg px-3 py-2 text-xs font-black capitalize ${reviewFilter === filter ? 'bg-navy-950 text-white' : 'bg-slate-100 text-slate-600'}`}>{filter}</button>)}</div></div>
        <div className="mt-4 space-y-4">
          {questions.map((question, questionIndex) => ({ question, questionIndex })).filter(({question}) => reviewFilter === 'all' || (reviewFilter === 'incorrect' && !isQuestionCorrect(question, answers[question.id])) || (reviewFilter === 'flagged' && flags.has(question.id)) || (reviewFilter === 'unanswered' && answers[question.id] === undefined)).map(({question, questionIndex}) => {
            const selected = answers[question.id];
            const correct = isQuestionCorrect(question, selected);
            return (
              <article className="card p-5 sm:p-6" key={question.id}>
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 ${correct ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {correct ? <CheckCircle2 /> : <XCircle />}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      Question {questionIndex + 1} · {question.moduleTitle}
                    </p>
                    <h3 className="mt-2 font-black leading-6 text-navy-950">
                      {question.prompt}
                    </h3>
                    <p className="mt-3 text-sm">
                      <strong>Your answer:</strong>{" "}
                      {answerText(question, selected)}
                    </p>
                    {!correct && (
                      <p className="mt-1 text-sm text-emerald-800">
                        <strong>Correct answer:</strong>{" "}
                        {correctAnswerIndexes(question)
                          .map((answerIndex) => question.choices[answerIndex])
                          .join("; ")}
                      </p>
                    )}
                    <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  const question = questions[index];
  const answeredCount = Object.keys(answers).length;
  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{EXAM_CONFIG[mode].label}</p>
          <h1 className="text-2xl font-black text-navy-950">
            Question {index + 1} of {questions.length}
          </h1>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-black ${secondsLeft < 300 ? "bg-rose-100 text-rose-700" : "bg-navy-950 text-white"}`}
        >
          <Clock3 size={18} />
          {formatTimer(secondsLeft)}
        </span>
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="card p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-bold text-slate-500">
                {question.moduleTitle} · {question.topicTitle}
              </p>
              <button
                onClick={() =>
                  setFlags((current) => {
                    const next = new Set(current);
                    if (next.has(question.id)) next.delete(question.id);
                    else next.add(question.id);
                    return next;
                  })
                }
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black ${flags.has(question.id) ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}
              >
                <Flag
                  size={15}
                  fill={flags.has(question.id) ? "currentColor" : "none"}
                />
                {flags.has(question.id) ? "Flagged" : "Flag"}
              </button>
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-wide text-cyan-700">
              {answerInstruction(question)}
            </p>
            <h2 className="mt-2 text-xl font-black leading-8 text-navy-950 sm:text-2xl">
              {question.prompt}
            </h2>
            <div className="mt-6 space-y-3">
              {question.choices.map((choice, choiceIndex) => (
                <button
                  key={choice}
                  onClick={() => setAnswers((current) => toggleExamAnswer(current, question, choiceIndex))}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left text-sm font-bold transition ${answers[question.id]?.includes(choiceIndex) ? "border-cyan-500 bg-cyan-50 text-navy-950" : "border-slate-200 hover:border-cyan-400"}`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100">
                    {String.fromCharCode(65 + choiceIndex)}
                  </span>
                  {choice}
                </button>
              ))}
            </div>
            {correctAnswerIndexes(question).length > 1 && (
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Selected {answers[question.id]?.length ?? 0} of {correctAnswerIndexes(question).length}
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-between gap-3">
            <button
              disabled={index === 0}
              onClick={() => setIndex((value) => value - 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-black disabled:opacity-40"
            >
              <ArrowLeft size={17} />
              Previous
            </button>
            {index < questions.length - 1 ? (
              <button
                onClick={() => setIndex((value) => value + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-navy-950"
              >
                Next <ArrowRight size={17} />
              </button>
            ) : (
              <button
                onClick={() => void submitExam()}
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {saving ? "Submitting…" : "Submit exam"}
              </button>
            )}
          </div>
        </div>
        <aside className="card h-fit p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-navy-950">Navigator</h2>
            <span className="text-xs font-bold text-slate-500">
              {answeredCount}/{questions.length}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((item, itemIndex) => (
              <button
                key={item.id}
                onClick={() => setIndex(itemIndex)}
                aria-label={`Go to question ${itemIndex + 1}`}
                className={`relative grid h-10 place-items-center rounded-lg text-xs font-black ${itemIndex === index ? "ring-2 ring-cyan-500 ring-offset-2" : ""} ${answers[item.id] !== undefined ? "bg-cyan-100 text-cyan-800" : "bg-slate-100 text-slate-500"}`}
              >
                {itemIndex + 1}
                {flags.has(item.id) && (
                  <Flag
                    className="absolute -right-1 -top-1 text-amber-600"
                    size={12}
                    fill="currentColor"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-2 text-xs font-semibold text-slate-500">
            <p className="flex items-center gap-2">
              <Circle size={12} className="fill-cyan-100 text-cyan-100" />
              Answered
            </p>
            <p className="flex items-center gap-2">
              <Flag size={12} className="text-amber-600" />
              Flagged for review
            </p>
          </div>
          {answeredCount < questions.length && (
            <p className="mt-5 flex gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <AlertTriangle className="shrink-0" size={17} />
              {questions.length - answeredCount} unanswered question
              {questions.length - answeredCount === 1 ? "" : "s"}.
            </p>
          )}
          <button
            onClick={() => void submitExam()}
            disabled={saving}
            className="mt-5 w-full rounded-xl bg-navy-950 px-4 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            {saving ? "Submitting…" : "Submit exam"}
          </button>
        </aside>
      </div>
    </section>
  );
}

function Info({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="card p-5">
      <span className="text-cyan-600">{icon}</span>
      <p className="mt-3 text-xl font-black text-navy-950">{value}</p>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}

function ModeCard({ title, text, onClick, featured = false }: { title: string; text: string; onClick: () => void; featured?: boolean }) {
  return <button onClick={onClick} className={`card p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${featured ? 'ring-2 ring-cyan-400' : ''}`}><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-700"><ClipboardCheck size={22}/></span>{featured && <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800">Complete mode</span>}</div><h2 className="mt-5 text-xl font-black text-navy-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-cyan-700">Start exam <ArrowRight size={17}/></span></button>
}

function DomainBreakdown({
  questions,
  answers,
}: {
  questions: ExamQuestion[];
  answers: ExamAnswers;
}) {
  return (
    <section className="mt-6">
      <h2 className="text-2xl font-black text-navy-950">
        Performance by domain
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {modules.map((module) => {
          const domainQuestions = questions.filter(
            (question) => question.moduleId === module.id,
          );
          const correct = domainQuestions.filter((question) =>
            isQuestionCorrect(question, answers[question.id]),
          ).length;
          const percent = Math.round((correct / domainQuestions.length) * 100);
          return (
            <div className="card p-4" key={module.id}>
              <div className="flex justify-between gap-3 text-sm">
                <span className="font-black text-navy-950">{module.title}</span>
                <span className="font-bold text-slate-500">
                  {correct}/{domainQuestions.length} · {percent}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${percent >= PASS_PERCENT ? "bg-emerald-500" : "bg-amber-400"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ExamHistory() {
  const { examAttempts, bestExamScore } = useProgress();
  return (
    <section className="mx-auto max-w-4xl">
      <Link
        to="/exam"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"
      >
        <ArrowLeft size={17} />
        Exam mode
      </Link>
      <header className="mt-5">
        <p className="eyebrow">Synchronized exam records</p>
        <h1 className="mt-1 text-3xl font-black text-navy-950">
          Mock exam history
        </h1>
        <p className="mt-2 text-slate-600">
          Track quick mocks and full simulations across your signed-in devices.
        </p>
      </header>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Info
          icon={<Trophy />}
          value={`${bestExamScore}%`}
          label="Best score"
        />
        <Info
          icon={<History />}
          value={String(examAttempts.length)}
          label="Completed exams"
        />
      </div>
      <div className="mt-6 space-y-3">
        {examAttempts.length ? (
          examAttempts.map((attempt, index) => {
            const percent = Math.round((attempt.score / attempt.total) * 100);
            return (
              <article
                className="card flex items-center gap-4 p-5"
                key={attempt.id}
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl font-black ${percent >= PASS_PERCENT ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {percent}%
                </span>
                <div className="flex-1">
                  <p className="font-black text-navy-950">
                    {attempt.mode === 'full' || attempt.total === 100 ? 'Full Simulation' : 'Quick Mock'} · {attempt.score} of {attempt.total} correct
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {new Date(attempt.completedAt).toLocaleString()} ·{" "}
                    {formatTimer(attempt.durationSeconds)}
                  </p>
                </div>
                {index === 0 && (
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                    Latest
                  </span>
                )}
              </article>
            );
          })
        ) : (
          <div className="card p-8 text-center">
            <History className="mx-auto text-slate-400" />
            <h2 className="mt-3 font-black text-navy-950">
              No exam attempts yet
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Complete a mock exam and your result will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
