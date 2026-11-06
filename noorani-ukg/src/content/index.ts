import type { Lesson, Subject } from '../types/content';
import { day1 } from './academic/day1';
import { day2 } from './academic/day2';
import { day3 } from './academic/day3';
import { day4 } from './academic/day4';
import { day5 } from './academic/day5';
import { islamicLessons } from './islamic/lessons';

export const academicLessons = [...day1, ...day2, ...day3, ...day4, ...day5];

const SUBJECT_ORDER: Subject[] = ['maths', 'english', 'bengali', 'world', 'islamic'];

export const allLessons: Lesson[] = [...academicLessons, ...islamicLessons].sort(
  (a, b) => a.day - b.day || SUBJECT_ORDER.indexOf(a.subject) - SUBJECT_ORDER.indexOf(b.subject),
);

export const lessonById: Record<string, Lesson> = Object.fromEntries(allLessons.map((l) => [l.id, l]));

export const SUBJECTS = SUBJECT_ORDER;
