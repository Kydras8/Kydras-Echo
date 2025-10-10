import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  theme = "amber"
}) {
  const iconColors = {
    amber: "text-amber-600/50",
    blue: "text-blue-600/50",
    purple: "text-purple-600/50", 
    green: "text-green-600/50"
  };

  const textColors = {
    amber: "text-amber-200",
    blue: "text-blue-200",
    purple: "text-purple-200",
    green: "text-green-200"
  };

  const subtextColors = {
    amber: "text-amber-400/70",
    blue: "text-blue-400/70",
    purple: "text-purple-400/70",
    green: "text-green-400/70"
  };

  const gradientClasses = {
    amber: "kydras-gradient text-black",
    blue: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    purple: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    green: "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
  };

  return (
    <Card className={`bg-gradient-to-br from-black/60 to-${theme}-900/10 border border-${theme}-500/20 backdrop-blur-sm shadow-2xl smooth-hover`}>
      <CardContent className="text-center py-16">
        <Icon className={`w-20 h-20 ${iconColors[theme]} mx-auto mb-6 animate-bounce`} />
        <h3 className={`text-2xl font-semibold ${textColors[theme]} mb-3`}>
          {title}
        </h3>
        <p className={`${subtextColors[theme]} mb-8 text-lg`}>
          {description}
        </p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className={`${gradientClasses[theme]} font-bold px-8 py-3 shadow-lg smooth-hover gpu-accelerated`}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}