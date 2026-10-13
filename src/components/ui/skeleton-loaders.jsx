import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, AlertCircle, RefreshCw } from "lucide-react";

/**
 * Enhanced base Skeleton component with pulse and subtle shimmer.
 */
export function Skeleton({
  className,
  variant = "rounded", // "text" | "circular" | "rounded" | "rect"
  width,
  height,
  style,
  ...props
}) {
  const variantClass =
    variant === "circular"
      ? "rounded-full"
      : variant === "text"
      ? "rounded h-4 my-1"
      : variant === "rect"
      ? "rounded-none"
      : "rounded-md";

  return (
    <div
      role="status"
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-[#1A3626]/10 dark:bg-white/10 select-none pointer-events-none",
        variantClass,
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * Image with integrated Skeleton loading state and error fallback.
 * Prevents layout shifts by maintaining aspect ratio and dimensions.
 */
export function ImageWithSkeleton({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  aspectRatio = "aspect-square",
  fallbackIcon: FallbackIcon = ImageIcon,
  fallbackText,
  onClick,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no source is provided at all
  if (!src) {
    return (
      <div
        className={cn(
          "w-full h-full flex flex-col items-center justify-center bg-[#1A3626]/5 text-[#1A3626]/40",
          aspectRatio,
          containerClassName
        )}
      >
        <FallbackIcon className="w-8 h-8 opacity-60" />
        {fallbackText && <span className="text-xs mt-1 font-medium">{fallbackText}</span>}
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", aspectRatio, containerClassName)}
      onClick={onClick}
    >
      {!loaded && !hasError && (
        <Skeleton
          className="absolute inset-0 w-full h-full rounded-none bg-[#1A3626]/10"
        />
      )}
      {hasError ? (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#1A3626]/5 text-[#1A3626]/40 p-2">
          <FallbackIcon className="w-8 h-8 opacity-60" />
          <span className="text-[11px] mt-1 text-center font-medium opacity-80">
            {fallbackText || "Image unavailable"}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setHasError(true);
            setLoaded(true);
          }}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * Standardized Error State with Retry button
 */
export function ErrorState({
  title = "Unable to load data",
  message = "A temporary connection issue occurred. Please check your network and try again.",
  onRetry,
  className = "",
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-rose-500/20 bg-rose-50/50 dark:bg-rose-950/20 p-8 text-center max-w-lg mx-auto my-6",
        className
      )}
    >
      <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-sm font-semibold transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

/**
 * Standardized Empty State
 */
export function EmptyState({
  icon: Icon = ImageIcon,
  title = "No records found",
  description = "There is no information to display at this time.",
  action,
  className = "",
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50 p-10 text-center max-w-md mx-auto my-6",
        className
      )}
    >
      <div className="mx-auto w-12 h-12 rounded-2xl bg-[#1A3626]/10 text-[#1A3626] dark:text-[#C5A059] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
      {action}
    </div>
  );
}

/**
 * Product Card Skeleton — matches exact layout and dimensions of ProductCard.jsx
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#1A3626]/10 flex flex-col animate-pulse">
      <div className="aspect-square bg-[#1A3626]/10 relative" />
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <Skeleton className="h-3 w-1/3 rounded-full" />
        <Skeleton className="h-5 w-4/5 rounded" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-3.5 w-3.5 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#1A3626]/5">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Health Camp Card Skeleton — matches exact layout of HealthCamps.jsx
 */
export function HealthCampCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#1A3626]/10 overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-video bg-[#1A3626]/10 relative" />
      <div className="p-6 flex flex-col flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded" />
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="pt-4 mt-auto">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Gallery Card Skeleton — matches Gallery.jsx grid item
 */
export function GalleryCardSkeleton({ isVideo = false }) {
  return (
    <div className="bg-white rounded-2xl border border-[#1A3626]/10 overflow-hidden animate-pulse">
      <div className={cn("bg-[#1A3626]/10", isVideo ? "aspect-video" : "aspect-[4/3]")} />
      <div className="p-5 space-y-2.5">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-3.5 w-1/3 rounded-full" />
        <div className="space-y-1 pt-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  );
}

/**
 * Table Skeleton — preserves exact table columns, rows, widths, and pagination
 */
export function TableSkeleton({
  columns = 5,
  rows = 5,
  hasCheckbox = false,
  hasActions = true,
  className = "",
}) {
  const colCount = typeof columns === "number" ? columns : columns.length;
  const colWidths = ["w-2/5", "w-3/5", "w-1/2", "w-3/4", "w-1/3", "w-2/3"];

  return (
    <div className={cn("w-full border rounded-xl overflow-hidden bg-white dark:bg-slate-900", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <tr>
              {hasCheckbox && (
                <th className="p-3 w-10">
                  <Skeleton className="h-4 w-4 rounded" />
                </th>
              )}
              {Array.from({ length: colCount }).map((_, i) => (
                <th key={i} className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
              {hasActions && (
                <th className="p-3 w-24 text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                {hasCheckbox && (
                  <td className="p-3">
                    <Skeleton className="h-4 w-4 rounded" />
                  </td>
                )}
                {Array.from({ length: colCount }).map((_, cIdx) => (
                  <td key={cIdx} className="p-3">
                    <Skeleton
                      className={cn(
                        "h-4 rounded",
                        colWidths[(rIdx + cIdx) % colWidths.length]
                      )}
                    />
                  </td>
                ))}
                {hasActions && (
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Bar Skeleton */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Form Skeleton — input field rows, textareas, and submit buttons
 */
export function FormSkeleton({ fields = 4, columns = 2, hasSubmit = true }) {
  return (
    <div className="space-y-5 animate-pulse">
      <div
        className={cn(
          "grid gap-4",
          columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        )}
      >
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3.5 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-32 rounded" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      {hasSubmit && (
        <div className="flex justify-end gap-3 pt-2">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      )}
    </div>
  );
}

/**
 * Dropdown / Select Skeleton
 */
export function DropdownSkeleton({ className = "" }) {
  return (
    <div
      className={cn(
        "h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 flex items-center justify-between animate-pulse",
        className
      )}
    >
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-4 rounded" />
    </div>
  );
}

/**
 * Full Page Skeleton with Hero Banner and content container
 */
export function PageSkeleton({
  heroHeight = "h-48",
  contentBlocks = 3,
  className = "",
}) {
  return (
    <div className={cn("w-full space-y-8 animate-pulse", className)}>
      <div className={cn("w-full bg-[#1A3626]/10 rounded-2xl flex flex-col justify-center p-8", heroHeight)}>
        <Skeleton className="h-4 w-32 rounded-full mb-3" />
        <Skeleton className="h-8 w-2/3 max-w-lg mb-2" />
        <Skeleton className="h-4 w-1/2 max-w-md" />
      </div>
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: contentBlocks * 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-white">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
