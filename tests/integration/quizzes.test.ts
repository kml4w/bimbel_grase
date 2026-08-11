import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

describe('Quizzes (Kuis) Integration Tests', () => {
  let programId: string;
  let createdQuizId: string;

  beforeAll(async () => {
    // Buat program dummy
    const { data: program } = await adminClient.from('programs').insert({
      name: 'Program Untuk Kuis Test',
      fee: 100000
    }).select('id').single();
    if (program) programId = program.id;
  });

  afterAll(async () => {
    // Cleanup kuis dan program
    if (createdQuizId) {
      await adminClient.from('quizzes').delete().eq('id', createdQuizId);
    }
    if (programId) {
      await adminClient.from('programs').delete().eq('id', programId);
    }
  });

  it('Skenario Sukses: Berhasil membuat kuis baru', async () => {
    const { data, error } = await adminClient.from('quizzes').insert({
      program_id: programId,
      title: 'Kuis Evaluasi Mingguan',
      duration: 30, // 30 menit
      questions_count: 0,
      questions: []
    }).select('*').single();

    expect(error).toBeNull();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('Kuis Evaluasi Mingguan');
    expect(data.duration).toBe(30);
    
    createdQuizId = data.id;
  });

  it('Skenario Sukses: Berhasil mengupdate pertanyaan kuis', async () => {
    const newQuestions = [
      {
        id: 'q1',
        text: 'Berapa 1 + 1?',
        options: { A: '1', B: '2', C: '3' },
        key: 'B'
      }
    ];

    const { data, error } = await adminClient.from('quizzes').update({
      questions: newQuestions,
      questions_count: 1
    }).eq('id', createdQuizId).select('*').single();

    expect(error).toBeNull();
    expect(data.questions_count).toBe(1);
    expect(data.questions).toHaveLength(1);
    expect(data.questions[0].key).toBe('B');
  });

  it('Skenario Gagal Validasi: Gagal membuat kuis jika program_id tidak diisi', async () => {
    const { data, error } = await adminClient.from('quizzes').insert({
      title: 'Kuis Tanpa Kelas',
      duration: 15
    });

    // Harus error karena program_id adalah Foreign Key yang NOT NULL
    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });

  it('Skenario Gagal Validasi: Gagal menyimpan durasi kosong (tipe data salah / constraint null)', async () => {
    const { data, error } = await adminClient.from('quizzes').insert({
      program_id: programId,
      title: 'Kuis Durasi Kosong'
      // duration tidak diisi, padahal di skema wajib (NOT NULL)
    });

    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });
});
