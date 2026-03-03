'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AssessmentVersion, AssessmentSession, LikertResponse, AnsweredQuestion, UserInfo } from '@/lib/types';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import EmailCapture from './EmailCapture';
import PreviewResults from './PreviewResults';
import UpgradeGate from './UpgradeGate';
import LoadingSpinner from '../shared/LoadingSpinner';
import { colors } from '@/lib/constants';
import { getQuestionById } from '@/lib/question-selection';

const PAGE_SIZE = 5;

type AppStage =
  | 'loading'
  | 'preview'
  | 'email-capture'
  | 'preview-results'
  | 'upgrade'
  | 'assessment'
  | 'computing'
  | 'done';

export default function AssessmentApp() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resume');
  const { data: authSession } = useSession();

  const [stage, setStage] = useState<AppStage>('loading');
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageResponses, setPageResponses] = useState<Record<string, LikertResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [capturedUser, setCapturedUser] = useState<UserInfo | null>(null);

  // Auto-create preview session on mount (zero friction)
  useEffect(() => {
    if (resumeId) {
      // Resume existing session
      setIsLoading(true);
      fetch(`/api/sessions/${resumeId}`)
        .then(res => res.json())
        .then(data => {
          if (data.session) {
            const s = data.session as AssessmentSession;
            setSession(s);
            if (s.user) setCapturedUser(s.user);

            // Route to correct stage
            if (s.stage === 'results') {
              window.location.href = `/results/${resumeId}`;
            } else if (s.assignedBy || s.stage === 'assessment') {
              // Admin-assigned or already in full assessment
              const answered = s.fullAnswers?.length || 0;
              setCurrentPage(Math.floor(answered / PAGE_SIZE));
              setStage('assessment');
            } else if (s.stage === 'upgrade') {
              setStage('upgrade');
            } else if (s.stage === 'preview-results') {
              setStage('preview-results');
            } else if (s.stage === 'email-capture') {
              setStage('email-capture');
            } else {
              // preview stage
              const answered = s.previewAnswers?.length || 0;
              setCurrentPage(Math.floor(answered / PAGE_SIZE));
              setStage('preview');
            }
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      // Create a fresh preview session (no version, no user info — zero friction)
      fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
        .then(res => res.json())
        .then(data => {
          setSession(data.session);
          localStorage.setItem('compass_session_id', data.session.id);
          setCurrentPage(0);
          setStage('preview');
        })
        .catch(error => {
          console.error('Failed to create session:', error);
          setStage('loading');
        });
    }
  }, [resumeId]);

  const getCurrentQuestions = useCallback((): string[] => {
    if (!session) return [];
    if (stage === 'preview') return session.previewQuestionIds;
    if (stage === 'assessment') return session.fullQuestionIds;
    return [];
  }, [session, stage]);

  const handleResponse = (questionId: string, response: LikertResponse) => {
    setPageResponses(prev => ({ ...prev, [questionId]: response }));
  };

  const saveAndAdvance = async () => {
    if (!session) return;

    const questions = getCurrentQuestions();
    const isPreview = stage === 'preview';
    const answerKey = isPreview ? 'previewAnswers' : 'fullAnswers';
    const existingAnswers = isPreview ? session.previewAnswers : session.fullAnswers;

    // Build new answers from page responses
    const pageStart = currentPage * PAGE_SIZE;
    const pageQuestionIds = questions.slice(pageStart, pageStart + PAGE_SIZE);
    const newAnswers: AnsweredQuestion[] = pageQuestionIds.map(qId => ({
      questionId: qId,
      response: pageResponses[qId],
      answeredAt: new Date().toISOString(),
    }));

    // Merge
    const existingMap = new Map(existingAnswers.map(a => [a.questionId, a]));
    newAnswers.forEach(a => existingMap.set(a.questionId, a));
    const updatedAnswers = Array.from(existingMap.values());

    // Update local state
    setSession(prev => prev ? { ...prev, [answerKey]: updatedAnswers } : null);

    // Save to server
    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [answerKey]: updatedAnswers }),
      });
    } catch (error) {
      console.error('Failed to save answers:', error);
    }

    // Check if last page
    const isLastPage = pageStart + PAGE_SIZE >= questions.length;
    if (isLastPage) {
      if (isPreview) {
        // Preview done — check if user is authenticated (skip email capture)
        if (authSession?.user) {
          const user: UserInfo = {
            firstName: authSession.user.name?.split(' ')[0] || '',
            lastName: authSession.user.name?.split(' ').slice(1).join(' ') || '',
            email: authSession.user.email || '',
            company: '',
          };
          setCapturedUser(user);
          // Save user info to session
          await fetch(`/api/sessions/${session.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, stage: 'preview-results' }),
          });
          setStage('preview-results');
        } else {
          // Save stage
          await fetch(`/api/sessions/${session.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage: 'email-capture' }),
          });
          setStage('email-capture');
        }
      } else {
        computeResults();
      }
    } else {
      setCurrentPage(prev => prev + 1);
      setPageResponses({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => prev - 1);
    setPageResponses({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEmailCapture = async (info: { firstName: string; lastName: string; email: string }) => {
    if (!session) return;
    setIsLoading(true);

    const user: UserInfo = { ...info, company: '' };
    setCapturedUser(user);

    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, stage: 'preview-results' }),
      });
      setSession(prev => prev ? { ...prev, user } : null);
      setStage('preview-results');
    } catch (error) {
      console.error('Failed to save user info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (version: AssessmentVersion) => {
    if (!session) return;
    setIsLoading(true);

    try {
      // Upgrade session with version (triggers question selection on server)
      await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version }),
      });

      // Create Stripe checkout session and redirect
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id }),
      });
      const checkoutData = await checkoutRes.json();

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        console.error('No checkout URL returned');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      setIsLoading(false);
    }
  };

  const computeResults = async () => {
    if (!session) return;
    setStage('computing');

    try {
      const res = await fetch(`/api/results/${session.id}`);
      if (res.ok) {
        window.location.href = `/results/${session.id}`;
      }
    } catch (error) {
      console.error('Failed to compute results:', error);
    }
  };

  // ── Render stages ──────────────────────────────────────────────────────────

  if (stage === 'loading') {
    return <LoadingSpinner message="Preparing your assessment..." />;
  }

  if (stage === 'email-capture') {
    return <EmailCapture onSubmit={handleEmailCapture} isLoading={isLoading} />;
  }

  if (stage === 'preview-results' && session) {
    return (
      <PreviewResults
        session={session}
        onUpgrade={() => {
          // Save stage server-side
          fetch(`/api/sessions/${session.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage: 'upgrade' }),
          });
          setStage('upgrade');
        }}
      />
    );
  }

  if (stage === 'upgrade') {
    return (
      <UpgradeGate
        onSelect={handleUpgrade}
        isLoading={isLoading}
      />
    );
  }

  if (stage === 'computing') {
    return <LoadingSpinner message="Analyzing your responses..." />;
  }

  // ── Quiz stages (preview or assessment) — 5 questions per page ──────────

  const questions = getCurrentQuestions();
  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const pageStart = currentPage * PAGE_SIZE;
  const pageQuestionIds = questions.slice(pageStart, pageStart + PAGE_SIZE);
  const pageQuestions = pageQuestionIds
    .map((qId, idx) => ({ id: qId, question: getQuestionById(qId), number: pageStart + idx + 1 }))
    .filter(q => q.question !== null);

  if (pageQuestions.length === 0) {
    return <LoadingSpinner message="Loading questions..." />;
  }

  const phaseLabel = stage === 'preview' ? 'Free Preview' : 'Full Assessment';
  const isPreview = stage === 'preview';
  const answeredSoFar = isPreview
    ? (session?.previewAnswers.length ?? 0)
    : (session?.fullAnswers.length ?? 0);
  const totalAnswered = answeredSoFar + Object.keys(pageResponses).length;
  const allPageAnswered = pageQuestionIds.every(qId => pageResponses[qId] != null);

  return (
    <div className="min-h-screen flex flex-col px-4 py-8" style={{ backgroundColor: colors.porcelain }}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: colors.cream, color: colors.indigo }}>
            {phaseLabel}
          </span>
          <span className="text-xs" style={{ color: colors.slate }}>
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>

        {/* Progress */}
        <ProgressBar
          current={totalAnswered}
          total={questions.length}
          label={`${totalAnswered} of ${questions.length} answered`}
        />

        {/* Questions */}
        <div
          className="mt-6 rounded-xl p-6 md:p-8 space-y-8"
          style={{ backgroundColor: colors.white, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        >
          {pageQuestions.map(({ id, question, number }) => (
            <div key={id}>
              <QuestionCard
                questionText={question!.text}
                questionNumber={number}
                selectedResponse={pageResponses[id] ?? null}
                onResponse={(response) => handleResponse(id, response)}
              />
              {number < pageStart + pageQuestionIds.length && (
                <div className="mt-8 border-b" style={{ borderColor: '#f0f0f0' }} />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {currentPage > 0 && (
              <button
                onClick={goToPreviousPage}
                className="px-6 py-2.5 rounded-full text-sm font-medium transition-all hover:shadow-sm"
                style={{ color: colors.indigo, border: `1.5px solid ${colors.indigo}` }}
              >
                Previous
              </button>
            )}
          </div>

          <button
            onClick={saveAndAdvance}
            disabled={!allPageAnswered}
            className="px-8 py-2.5 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: allPageAnswered ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#9CA3AF' }}
          >
            {pageStart + PAGE_SIZE >= questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
