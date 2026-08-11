import { describe, it, expect } from 'vitest';
import { calculateQuizGrade } from '../../src/utils/grading';

describe('Quiz Grade Calculation', () => {
  const dummyQuestions = [
    { id: 'q1', text: 'Soal 1', key: 'A' },
    { id: 'q2', text: 'Soal 2', key: 'B' },
    { id: 'q3', text: 'Soal 3', key: 'C' },
    { id: 'q4', text: 'Soal 4', key: 'A' }
  ];

  it('Harus menghitung skor 100% dan predikat A jika semua benar', () => {
    const answers = { q1: 'A', q2: 'B', q3: 'C', q4: 'A' };
    const result = calculateQuizGrade(answers, dummyQuestions, 4);
    
    expect(result.correctCount).toBe(4);
    expect(result.score).toBe(100);
    expect(result.gradeLetter).toBe('A');
  });

  it('Harus menghitung skor 75% dan predikat B jika salah satu', () => {
    // q4 salah dijawab B (seharusnya A)
    const answers = { q1: 'A', q2: 'B', q3: 'C', q4: 'B' };
    const result = calculateQuizGrade(answers, dummyQuestions, 4);
    
    expect(result.correctCount).toBe(3);
    expect(result.score).toBe(75);
    expect(result.gradeLetter).toBe('B');
  });

  it('Harus menghitung skor 50% dan predikat C jika salah dua', () => {
    // q3 dan q4 salah
    const answers = { q1: 'A', q2: 'B', q3: 'A', q4: 'B' };
    const result = calculateQuizGrade(answers, dummyQuestions, 4);
    
    expect(result.correctCount).toBe(2);
    expect(result.score).toBe(50);
    expect(result.gradeLetter).toBe('C');
  });

  it('Harus mengembalikan skor 0 jika jawaban kosong semua', () => {
    const answers = {};
    const result = calculateQuizGrade(answers, dummyQuestions, 4);
    
    expect(result.correctCount).toBe(0);
    expect(result.score).toBe(0);
    expect(result.gradeLetter).toBe('C');
  });
});
