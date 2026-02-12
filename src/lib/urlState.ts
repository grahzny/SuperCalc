"use client";

export const parseNum = (params: URLSearchParams, key: string, fallback: number): number => {
  const raw = params.get(key);
  const parsed = raw === null ? NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const writeUrl = (params: Record<string, number | string>) => {
  const next = new URLSearchParams(window.location.search);
  Object.entries(params).forEach(([key, value]) => {
    next.set(key, String(value));
  });
  const nextUrl = `${window.location.pathname}?${next.toString()}`;
  window.history.replaceState({}, "", nextUrl);
};
