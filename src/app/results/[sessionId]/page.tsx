'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AssessmentResults, AssessmentVersion, UserInfo } from '@/lib/types';
import FullResults from '@/components/results/FullResults';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [version, setVersion] = useState<AssessmentVersion>('standard');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        // First fetch the session to get userInfo
        const sessionRes = await fetch(`/api/sessions/${sessionId}`);
        if (!sessionRes.ok) {
          throw new Error('Session not found');
        }
        const sessionData = await sessionRes.json();
        setUserInfo(sessionData.session.user);
        if (sessionData.session.version) {
          setVersion(sessionData.session.version);
        }

        // If results already computed, use them
        if (sessionData.session.results) {
          setResults(sessionData.session.results);
          setLoading(false);
          return;
        }

        // Otherwise compute results
        const resultsRes = await fetch(`/api/results/${sessionId}`);
        if (!resultsRes.ok) {
          const errData = await resultsRes.json();
          throw new Error(errData.error || 'Failed to compute results');
        }
        const resultsData = await resultsRes.json();
        setResults(resultsData.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [sessionId]);

  if (loading) {
    return <LoadingSpinner message="Computing your results..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/" className="text-indigo-600 underline hover:no-underline">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (!results || !userInfo) {
    return null;
  }

  return <FullResults results={results} userInfo={userInfo} version={version} />;
}
