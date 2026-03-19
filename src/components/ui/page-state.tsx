'use client';

import type { ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, Loading01Icon, SentIcon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PageStateProps {
  icon: typeof Loading01Icon;
  title: string;
  description: string;
  action?: ReactNode;
  animate?: boolean;
}

function PageStateCard({ icon, title, description, action, animate = false }: PageStateProps) {
  return (
    <Card className="border-border/50 bg-card/40 mx-auto w-full max-w-3xl backdrop-blur-md">
      <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="bg-muted/40 text-primary flex size-14 items-center justify-center rounded-2xl">
          <HugeiconsIcon icon={icon} size={24} className={animate ? 'animate-spin' : ''} />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-muted-foreground max-w-md text-sm">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}

export function LoadingState({
  title = 'Loading',
  description = 'Fetching the latest data from your home.',
}: {
  title?: string;
  description?: string;
}) {
  return <PageStateCard icon={Loading01Icon} title={title} description={description} animate />;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return <PageStateCard icon={SentIcon} title={title} description={description} action={action} />;
}

export function ErrorState({
  title = 'Could not load this page',
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <PageStateCard
      icon={Alert02Icon}
      title={title}
      description={description}
      action={
        onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        ) : undefined
      }
    />
  );
}
