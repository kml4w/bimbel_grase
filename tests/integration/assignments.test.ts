import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

describe('Assignments & Submissions Integration (Backlog 85)', () => {
  let programId: string;
  let assignmentId: string;
  let studentId: string;

  beforeAll(async () => {
    // Cari program pertama
    const program = await adminClient.from('programs').select('id').limit(1).single();
    if (program.data) {
      programId = program.data.id;
    }

    // Cari student pertama
    const student = await adminClient.from('students').select('id').eq('program_id', programId).limit(1).single();
    if (student.data) {
      studentId = student.data.id;
    }

    // Buat assignment dummy
    const { data: assignmentData } = await adminClient.from('assignments').insert({
      program_id: programId,
      title: 'Tugas Integration Test',
      due_date: new Date(Date.now() + 86400000).toISOString()
    }).select('id').single();
    
    if (assignmentData) {
      assignmentId = assignmentData.id;
    }
  });

  afterAll(async () => {
    // Hapus assignment dummy
    if (assignmentId) {
      await adminClient.from('assignments').delete().eq('id', assignmentId);
    }
  });

  it('Siswa bisa mengunggah jawaban (submission status = submitted)', async () => {
    // Insert submission
    const { data, error } = await adminClient.from('submissions').insert({
      assignment_id: assignmentId,
      student_id: studentId,
      submitted_file_path: 'submissions/test-file.pdf',
      status: 'submitted'
    }).select('*').single();

    expect(error).toBeNull();
    expect(data.status).toBe('submitted');
    expect(data.assignment_id).toBe(assignmentId);
    expect(data.student_id).toBe(studentId);
  });

  it('Tutor/Admin bisa memberikan nilai (status menjadi graded, score tersimpan)', async () => {
    // Update submission (Penilaian)
    const { data, error } = await adminClient.from('submissions').update({
      status: 'graded',
      score: 90,
      notes: 'Bagus sekali!'
    })
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .select('*').single();

    expect(error).toBeNull();
    expect(data.status).toBe('graded');
    expect(data.score).toBe(90);
    expect(data.notes).toBe('Bagus sekali!');
  });
});
