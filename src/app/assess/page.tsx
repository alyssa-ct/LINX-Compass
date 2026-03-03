import { Suspense } from 'react';
import AssessmentApp from '@/components/assessment/AssessmentApp';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AssessPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading assessment..." />}>
      <AssessmentApp />
    </Suspense>
  );
}
