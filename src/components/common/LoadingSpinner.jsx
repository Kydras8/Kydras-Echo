import React from 'react';

export default function LoadingSpinner({ 
  size = "lg", 
  message = "Loading...", 
  theme = "amber" 
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  };

  const themeClasses = {
    amber: "border-amber-500/20 border-t-amber-400",
    blue: "border-blue-500/20 border-t-blue-400",
    purple: "border-purple-500/20 border-t-purple-400",
    green: "border-green-500/20 border-t-green-400"
  };

  const textColors = {
    amber: "text-amber-200",
    blue: "text-blue-200", 
    purple: "text-purple-200",
    green: "text-green-200"
  };

  return (
    <div className="text-center gpu-accelerated">
      <div className="relative mb-6">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 ${themeClasses[theme]} mx-auto`}></div>
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-${theme}-400/20 to-${theme}-400/20 blur-xl animate-pulse`}></div>
      </div>
      <p className={`${textColors[theme]} font-medium animate-pulse`}>{message}</p>
    </div>
  );
}