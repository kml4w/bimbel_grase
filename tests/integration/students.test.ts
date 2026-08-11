import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

describe('Students (Siswa) Integration Tests', () => {
  let parentId: string;
  let programId: string;
  let createdStudentId: string;

  beforeAll(async () => {
    // Buat program dummy
    const { data: program } = await adminClient.from('programs').insert({
      name: 'Program Untuk Siswa Test',
      fee: 100000
    }).select('id').single();
    if (program) programId = program.id;

    // Ambil akun user sebagai parent
    const { data: users } = await adminClient.auth.admin.listUsers();
    if (users.users.length > 0) {
      parentId = users.users[0].id;
    }
  });

  afterAll(async () => {
    // Cleanup
    if (createdStudentId) {
      await adminClient.from('students').delete().eq('id', createdStudentId);
    }
    if (programId) {
      await adminClient.from('programs').delete().eq('id', programId);
    }
  });

  it('Skenario Sukses: Berhasil membuat data siswa baru', async () => {
    const { data, error } = await adminClient.from('students').insert({
      parent_id: parentId,
      program_id: programId,
      student_name: 'Budi Test Vitest'
    }).select('*').single();

    expect(error).toBeNull();
    expect(data).toHaveProperty('id');
    expect(data.student_name).toBe('Budi Test Vitest');
    
    createdStudentId = data.id;
  });

  it('Skenario Sukses: Berhasil membaca data siswa yang baru dibuat', async () => {
    const { data, error } = await adminClient.from('students').select('*').eq('id', createdStudentId).single();

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.student_name).toBe('Budi Test Vitest');
  });

  it('Skenario Sukses: Berhasil mengedit data siswa (mengubah status pembayaran)', async () => {
    const { data, error } = await adminClient.from('students').update({
      payment_status: 'verified'
    }).eq('id', createdStudentId).select('*').single();

    expect(error).toBeNull();
    expect(data.payment_status).toBe('verified');
  });

  it('Skenario Gagal Validasi: Gagal membuat siswa jika tidak ada student_name', async () => {
    const { data, error } = await adminClient.from('students').insert({
      parent_id: parentId,
      program_id: programId
    });

    // Harus error karena student_name adalah NOT NULL
    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });
});
