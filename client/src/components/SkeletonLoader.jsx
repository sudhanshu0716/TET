import React from 'react';

// Base shimmer box
export const SkeletonBox = ({ className = '', style = {} }) => (
  <div
    className={`skeleton-shimmer rounded-2xl ${className}`}
    style={style}
  />
);

// Circular shimmer
export const SkeletonCircle = ({ size = 40, className = '' }) => (
  <div
    className={`skeleton-shimmer rounded-full shrink-0 ${className}`}
    style={{ width: size, height: size }}
  />
);

// Multi-line text placeholder
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2.5 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton-shimmer rounded-lg h-3"
        style={{ width: i === lines - 1 ? '60%' : `${85 + Math.random() * 15}%` }}
      />
    ))}
  </div>
);

// Glass card skeleton
export const SkeletonCard = ({ height = 120, className = '' }) => (
  <div className={`glass-card !p-5 ${className}`}>
    <div className="skeleton-shimmer rounded-lg h-3 w-1/3 mb-4" />
    <div className="space-y-2.5">
      <div className="skeleton-shimmer rounded-lg h-8 w-2/3" />
      <div className="skeleton-shimmer rounded-lg h-3 w-full" />
      <div className="skeleton-shimmer rounded-lg h-3 w-4/5" />
    </div>
  </div>
);

// Dashboard skeleton layout
export const DashboardSkeleton = () => (
  <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in">
    {/* Header greeting */}
    <div className="space-y-2">
      <div className="skeleton-shimmer rounded-xl h-8 w-3/4" />
      <div className="skeleton-shimmer rounded-lg h-4 w-1/2" />
    </div>

    {/* Stats row */}
    <div className="flex gap-3">
      <div className="glass-card !p-4 flex-1">
        <div className="skeleton-shimmer rounded-full w-8 h-8 mx-auto mb-2" />
        <div className="skeleton-shimmer rounded-lg h-6 w-12 mx-auto mb-1" />
        <div className="skeleton-shimmer rounded-md h-2.5 w-16 mx-auto" />
      </div>
      <div className="glass-card !p-4 flex-1">
        <div className="skeleton-shimmer rounded-full w-8 h-8 mx-auto mb-2" />
        <div className="skeleton-shimmer rounded-lg h-6 w-12 mx-auto mb-1" />
        <div className="skeleton-shimmer rounded-md h-2.5 w-16 mx-auto" />
      </div>
      <div className="glass-card !p-4 flex-1">
        <div className="skeleton-shimmer rounded-full w-8 h-8 mx-auto mb-2" />
        <div className="skeleton-shimmer rounded-lg h-6 w-12 mx-auto mb-1" />
        <div className="skeleton-shimmer rounded-md h-2.5 w-16 mx-auto" />
      </div>
    </div>

    {/* Daily progress card */}
    <div className="glass-card !p-5">
      <div className="skeleton-shimmer rounded-lg h-3 w-1/4 mb-4" />
      <div className="skeleton-shimmer rounded-xl h-10 w-1/2 mb-3" />
      <div className="skeleton-shimmer rounded-full h-3 w-full" />
    </div>

    {/* Contest card */}
    <div className="glass-card !p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton-shimmer rounded-2xl w-12 h-12" />
        <div className="flex-1">
          <div className="skeleton-shimmer rounded-lg h-4 w-2/3 mb-2" />
          <div className="skeleton-shimmer rounded-md h-3 w-1/2" />
        </div>
      </div>
      <div className="skeleton-shimmer rounded-xl h-12 w-full" />
    </div>

    {/* Feature cards */}
    {[1, 2].map(i => (
      <div key={i} className="glass-card !p-5">
        <div className="flex items-center gap-3">
          <div className="skeleton-shimmer rounded-2xl w-14 h-14 shrink-0" />
          <div className="flex-1">
            <div className="skeleton-shimmer rounded-lg h-4 w-3/4 mb-2" />
            <div className="skeleton-shimmer rounded-md h-3 w-full" />
          </div>
        </div>
      </div>
    ))}

    {/* Recent activity */}
    <div>
      <div className="skeleton-shimmer rounded-lg h-3 w-1/3 mb-4" />
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-card !p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer rounded-xl w-10 h-10 shrink-0" />
            <div className="flex-1">
              <div className="skeleton-shimmer rounded-lg h-3.5 w-2/3 mb-1.5" />
              <div className="skeleton-shimmer rounded-md h-2.5 w-1/3" />
            </div>
            <div className="skeleton-shimmer rounded-lg h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Progress page skeleton
export const ProgressSkeleton = () => (
  <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in">
    {/* Header */}
    <div className="space-y-1">
      <div className="skeleton-shimmer rounded-xl h-8 w-3/4" />
      <div className="skeleton-shimmer rounded-lg h-3 w-1/2" />
    </div>

    {/* Score predictor */}
    <div className="glass-card !p-5">
      <div className="skeleton-shimmer rounded-md h-2.5 w-1/4 mb-4" />
      <div className="flex items-end gap-4">
        <div className="skeleton-shimmer rounded-xl h-12 w-24" />
        <div className="skeleton-shimmer rounded-full h-5 w-16" />
      </div>
      <div className="skeleton-shimmer rounded-lg h-2.5 w-3/4 mt-3" />
    </div>

    {/* Performance summary */}
    <div className="glass-card !p-5">
      <div className="skeleton-shimmer rounded-md h-2.5 w-1/3 mb-5" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="skeleton-shimmer rounded-xl h-10 w-20 mb-1" />
          <div className="skeleton-shimmer rounded-md h-2.5 w-14" />
        </div>
        <div className="text-right">
          <div className="skeleton-shimmer rounded-xl h-10 w-12 ml-auto mb-1" />
          <div className="skeleton-shimmer rounded-md h-2.5 w-14 ml-auto" />
        </div>
      </div>
      <div className="skeleton-shimmer rounded-full h-3 w-full mt-6" />
    </div>

    {/* Radar chart placeholder */}
    <div className="glass-card !p-5">
      <div className="skeleton-shimmer rounded-md h-2.5 w-1/3 mb-4" />
      <div className="skeleton-shimmer rounded-2xl h-[200px] w-full" />
    </div>

    {/* Topic insights */}
    <div className="glass-card !p-5">
      <div className="skeleton-shimmer rounded-md h-2.5 w-2/5 mb-4" />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 mb-3">
          <div className="skeleton-shimmer rounded-xl w-10 h-10 shrink-0" />
          <div className="flex-1">
            <div className="skeleton-shimmer rounded-lg h-3 w-2/3 mb-1.5" />
            <div className="skeleton-shimmer rounded-full h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Revision zone skeleton
export const RevisionSkeleton = () => (
  <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in">
    {/* Header */}
    <div className="space-y-1">
      <div className="skeleton-shimmer rounded-xl h-8 w-3/4" />
      <div className="skeleton-shimmer rounded-lg h-3 w-1/2" />
    </div>

    {/* Stats card */}
    <div className="glass-card !p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="skeleton-shimmer rounded-full w-20 h-20" />
        <div className="flex-1 ml-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="skeleton-shimmer rounded-lg w-10 h-10" />
            <div className="skeleton-shimmer rounded-md h-3 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <div className="skeleton-shimmer rounded-lg w-10 h-10" />
            <div className="skeleton-shimmer rounded-md h-3 w-20" />
          </div>
        </div>
      </div>
    </div>

    {/* Tab bar */}
    <div className="flex gap-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton-shimmer rounded-xl h-10 flex-1" />
      ))}
    </div>

    {/* Question cards */}
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="glass-card !p-4">
        <div className="skeleton-shimmer rounded-lg h-3.5 w-full mb-2" />
        <div className="skeleton-shimmer rounded-md h-3 w-4/5 mb-3" />
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer rounded-full h-5 w-16" />
          <div className="skeleton-shimmer rounded-full h-5 w-12" />
        </div>
      </div>
    ))}
  </div>
);

// Generic page skeleton (for Profile, Leaderboard, etc)
export const GenericPageSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-5 max-w-md mx-auto w-full animate-fade-in">
    <div className="relative">
      <div className="skeleton-shimmer rounded-full w-16 h-16" />
      <div className="absolute inset-0 rounded-full bg-sky-500/10 animate-ping" style={{ animationDuration: '2s' }} />
    </div>
    <div className="space-y-2 text-center w-full">
      <div className="skeleton-shimmer rounded-lg h-5 w-1/2 mx-auto" />
      <div className="skeleton-shimmer rounded-md h-3 w-1/3 mx-auto" />
    </div>
  </div>
);
