'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import PbcTab from '../../components/PbcTab';

export default function ProjectPbcListPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  return (
    <PbcTab
      projectId={projectId}
      showBackButton={true}
      onBack={() => router.push(`/portal/projects/${projectId}`)}
    />
  );
}
