import React from 'react';

export const MAX_SCORES = {
  readingAndUseOfEnglish: {
    part1: 8,
    part2: 8,
    part3: 8,
    part4: 6,
    part5: 6,
    part6: 6,
    part7: 10,
  },
  writing: {
    total: 40,
  },
  listening: {
    part1: 8,
    part2: 10,
    part3: 5,
    part4: 7,
  },
  speaking: {
    total: 60,
  },
};

export const RUE_POINTS_PER_ITEM = {
    part1: 1,
    part2: 1,
    part3: 1,
    part4: 2,
    part5: 2,
    part6: 2,
    part7: 1,
};

export const TOTAL_RAW_SCORES = {
    readingAndUseOfEnglish: 70,
    writing: 40,
    listening: 30,
    speaking: 60,
}

// Points for piecewise linear interpolation to convert raw scores to Cambridge Scale scores.
// These are estimations as official tables are not public.
// Structure: { low: raw score for ~140, pass: raw score for 160, high: raw score for 180 }
export const CONVERSION_POINTS = {
    readingAndUseOfEnglish: { low: 25, pass: 42, high: 63 },
    writing: { low: 14, pass: 24, high: 36 },
    listening: { low: 10, pass: 18, high: 27 },
    speaking: { low: 21, pass: 36, high: 54 },
};

// FIX: Replaced JSX syntax with React.createElement to be compatible with a .ts file extension.
export const ICONS: { [key: string]: React.ReactNode } = {
    reading: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v11.494m-9-5.747h18" })),
    writing: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" })),
    listening: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 15.858a5 5 0 010-7.072m2.828 9.9a9 9 0 010-12.728" })),
    speaking: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" })),
}