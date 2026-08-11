import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client using Service Role (Bypasses RLS) - used for setup/teardown
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

// Clients for User A and User B
const clientA = createClient(supabaseUrl, supabaseAnonKey);
const clientB = createClient(supabaseUrl, supabaseAnonKey);

let userAId: string;
let userBId: string;
let studentAId: string;
let programId: string;

describe('Row Level Security (RLS) - Students Table', () => {
  beforeAll(async () => {
    // 1. Buat User A
    const { data: dataA, error: errA } = await adminClient.auth.admin.createUser({
      email: 'usera@example.com',
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { full_name: 'Parent A' }
    });
    if (errA && !errA.message.includes('already exists')) throw errA;

    // 2. Buat User B
    const { data: dataB, error: errB } = await adminClient.auth.admin.createUser({
      email: 'userb@example.com',
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { full_name: 'Parent B' }
    });
    if (errB && !errB.message.includes('already exists')) throw errB;

    // 3. Ambil ID User
    const users = await adminClient.auth.admin.listUsers();
    userAId = users.data.users.find(u => u.email === 'usera@example.com')!.id;
    userBId = users.data.users.find(u => u.email === 'userb@example.com')!.id;

    // 4. Pastikan profil mereka ada (Triggers should handle this, tapi mari kita pastikan role=parent)
    await adminClient.from('profiles').update({ role: 'parent' }).eq('id', userAId);
    await adminClient.from('profiles').update({ role: 'parent' }).eq('id', userBId);

    // 5. Login User A di clientA
    await clientA.auth.signInWithPassword({
      email: 'usera@example.com',
      password: 'Password123!'
    });

    // 6. Login User B di clientB
    await clientB.auth.signInWithPassword({
      email: 'userb@example.com',
      password: 'Password123!'
    });

    // 7. Ambil satu program_id valid
    const program = await adminClient.from('programs').select('id').limit(1).single();
    if (program.data) {
      programId = program.data.id;
    }
  });

  afterAll(async () => {
    // Bersihkan data tes
    if (studentAId) {
      await adminClient.from('students').delete().eq('id', studentAId);
    }
    await adminClient.auth.admin.deleteUser(userAId);
    await adminClient.auth.admin.deleteUser(userBId);
  });

  it('User A dapat membuat (insert) data siswa untuk dirinya sendiri', async () => {
    const { data, error } = await clientA
      .from('students')
      .insert({
        parent_id: userAId,
        student_name: 'Anak User A',
        age: 10,
        program_id: programId,
        payment_status: 'unpaid'
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.student_name).toBe('Anak User A');
    
    studentAId = data.id; // Simpan untuk tes berikutnya
  });

  it('User A tidak dapat membuat (insert) data siswa dengan parent_id milik User B', async () => {
    const { error } = await clientA
      .from('students')
      .insert({
        parent_id: userBId, // Mencoba inject ID orang lain
        student_name: 'Hacked Anak',
        age: 12,
        program_id: programId,
        payment_status: 'unpaid'
      });

    // Harus error karena RLS Insert melarang parent_id != auth.uid()
    expect(error).not.toBeNull();
  });

  it('User B tidak dapat melihat (select) data siswa milik User A', async () => {
    const { data, error } = await clientB
      .from('students')
      .select('*')
      .eq('id', studentAId);

    expect(error).toBeNull(); // RLS tidak throw error pada SELECT, tapi mengembalikan 0 rows
    expect(data?.length).toBe(0);
  });

  it('User B tidak dapat merubah (update) data siswa milik User A', async () => {
    const { data, error } = await clientB
      .from('students')
      .update({ student_name: 'Nama Berubah' })
      .eq('id', studentAId)
      .select();

    // Data yang dikembalikan harus 0 karena tidak ada baris yang bisa di-update
    expect(data?.length).toBe(0);

    // Pastikan nama aslinya tidak berubah di database (cek pakai adminClient)
    const check = await adminClient.from('students').select('student_name').eq('id', studentAId).single();
    expect(check.data?.student_name).toBe('Anak User A');
  });

  it('User B tidak dapat menghapus (delete) data siswa milik User A', async () => {
    const { data, error } = await clientB
      .from('students')
      .delete()
      .eq('id', studentAId)
      .select();

    expect(data?.length).toBe(0);

    // Pastikan data masih ada
    const check = await adminClient.from('students').select('id').eq('id', studentAId).single();
    expect(check.data).not.toBeNull();
  });
});
