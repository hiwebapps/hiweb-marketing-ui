import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';
import { QUIZ_CATEGORY_LABELS, QUIZ_QUESTIONS, QUIZ_TOTAL_STEPS } from '../../lib/growth/quiz/questions';
import { startQuizSession } from '../../lib/growth/quiz/session';
import { submitQuiz, updateQuizSession } from '../../lib/growth/quiz/client';
import type { QuizAnswers, QuizLeadInput, QuizScoreResult } from '../../lib/growth/quiz/types';

type Phase = 'questions' | 'lead' | 'result';

const emptyLead: QuizLeadInput = {
  name: '',
  email: '',
  company: '',
  phone: '',
  website: '',
  industry: '',
};

export function MarketingQuiz() {
  const [phase, setPhase] = useState<Phase>('questions');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [sessionId, setSessionId] = useState('');
  const [lead, setLead] = useState<QuizLeadInput>(emptyLead);
  const [result, setResult] = useState<QuizScoreResult | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    startQuizSession().then((id) => {
      if (!cancelled) setSessionId(id);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const question = QUIZ_QUESTIONS[step];
  const selected = question ? answers[question.id] : undefined;

  function choose(optionId: string) {
    if (!question) return;
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    setError('');
    if (sessionId) {
      void updateQuizSession({
        sessionId,
        questionId: question.id,
        optionId,
        currentStep: step + 1,
      }).catch(() => {
        // The answers stay in the page if the session request fails.
      });
    }
  }

  function continueQuestions() {
    if (!selected) {
      setError('Elige una opción para continuar.');
      return;
    }
    if (step < QUIZ_TOTAL_STEPS - 1) {
      setStep(step + 1);
      setError('');
      return;
    }
    setPhase('lead');
    setError('');
  }

  async function sendLead(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const response = await submitQuiz({ sessionId, lead, answers });
      setResult(response.result);
      setPhase('result');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No pudimos guardar el diagnóstico.');
    } finally {
      setPending(false);
    }
  }

  if (phase === 'result' && result) {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 pb-24">
        <div className="rounded-3xl border border-border bg-canvas p-6 md:p-10">
          <p className="font-display text-xs font-medium tracking-[0.14em] text-muted uppercase">
            Resultado
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl">{result.resultLevelLabel}</h2>
          <p className="mt-3 text-lg text-ink/80">{result.scorePercentage}% · {result.scoreTotal} de {result.scoreMax}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/80">{result.resultSummary}</p>

          <ul className="mt-8 grid gap-3">
            {result.categoryScores.map((category) => (
              <li key={category.category} className="flex items-center justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
                <span>{QUIZ_CATEGORY_LABELS[category.category]}</span>
                <span className="font-display text-sm">{category.percentage}%</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-10 text-xl">Servicios recomendados</h3>
          <ul className="mt-4 grid gap-2">
            {result.recommendedServices.map((service) => (
              <li key={service} className="rounded-2xl border border-border px-4 py-3">
                {service}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href="/calendario">Agendar una cita</Button>
          </div>
        </div>
      </section>
    );
  }

  if (phase === 'lead') {
    return (
      <section className="mx-auto w-full max-w-3xl px-6 pb-24">
        <form className="grid gap-5 rounded-3xl border border-border bg-canvas p-6 md:p-10" onSubmit={sendLead}>
          <div>
            <p className="font-display text-xs font-medium tracking-[0.14em] text-muted uppercase">
              Tus datos
            </p>
            <h2 className="mt-3 text-3xl">Para enviarte el diagnóstico</h2>
          </div>
          <TextField
            label="Nombre"
            name="name"
            required
            value={lead.name}
            onChange={(event) => setLead({ ...lead, name: event.target.value })}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            required
            value={lead.email}
            onChange={(event) => setLead({ ...lead, email: event.target.value })}
          />
          <TextField
            label="Empresa"
            name="company"
            value={lead.company ?? ''}
            onChange={(event) => setLead({ ...lead, company: event.target.value })}
          />
          <TextField
            label="Teléfono"
            name="phone"
            value={lead.phone ?? ''}
            onChange={(event) => setLead({ ...lead, phone: event.target.value })}
          />
          <TextField
            label="Sitio web"
            name="website"
            value={lead.website ?? ''}
            onChange={(event) => setLead({ ...lead, website: event.target.value })}
          />
          <TextField
            label="Industria"
            name="industry"
            value={lead.industry ?? ''}
            onChange={(event) => setLead({ ...lead, industry: event.target.value })}
          />
          {error ? <p className="text-sm text-accent-orange">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => setPhase('questions')}>
              Volver
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Enviando…' : 'Ver resultado'}
            </Button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 pb-24">
      <div className="rounded-3xl border border-border bg-canvas p-6 md:p-10">
        <p className="font-display text-xs font-medium tracking-[0.14em] text-muted uppercase">
          {question ? QUIZ_CATEGORY_LABELS[question.category] : 'Diagnóstico'} · {step + 1} de {QUIZ_TOTAL_STEPS}
        </p>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-ink"
            style={{ width: `${((step + (selected ? 1 : 0)) / QUIZ_TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <h2 className="mt-8 text-2xl leading-snug md:text-3xl">{question?.question}</h2>
        <div className="mt-6 grid gap-3">
          {question?.options.map((option) => {
            const active = selected === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => choose(option.id)}
                className={[
                  'rounded-2xl border px-4 py-4 text-left transition-colors',
                  active ? 'border-ink bg-ink text-canvas' : 'border-border bg-canvas hover:bg-surface',
                ].join(' ')}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        {error ? <p className="mt-4 text-sm text-accent-orange">{error}</p> : null}
        <div className="mt-8 flex flex-wrap gap-3">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
              Anterior
            </Button>
          ) : null}
          <Button type="button" onClick={continueQuestions}>
            {step === QUIZ_TOTAL_STEPS - 1 ? 'Continuar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </section>
  );
}
