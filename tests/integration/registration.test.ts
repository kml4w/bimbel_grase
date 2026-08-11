import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Load env
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

describe('Registration Server Action & Trigger Integration', () => {
  const testEmail = `testregister_${Math.floor(Math.random() * 10000)}@example.com`;
  const testPassword = 'Password123!';
  let createdUserId: string;
  let programId: string;

  beforeAll(async () => {
    // Get a valid program id
    const program = await adminClient.from('programs').select('id').limit(1).single();
    if (program.data) {
      programId = program.data.id;
    }
  });

  afterAll(async () => {
    // Cleanup: delete the created user
    if (createdUserId) {
      await adminClient.auth.admin.deleteUser(createdUserId);
    }
  });

  it('Supabase signUp should trigger insertion of profile and students', async () => {
    expect(programId).toBeDefined();

    const students = [
      { student_name: 'Anak Pertama Test', age: 8, program_id: programId },
      { student_name: 'Anak Kedua Test', age: 10, program_id: programId }
    ];

    // Simulate the server action behavior using admin client to bypass email rate limits
    const { data, error } = await adminClient.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Wali Test',
        parent_name: 'Wali Test',
        parent_phone: '08122334455',
        role: 'parent',
        students: students
      }
    });

    expect(error).toBeNull();
    expect(data.user).toBeDefined();
    
    createdUserId = data.user!.id;

    // Wait a short moment for the Postgres trigger to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if profile exists
    const profileRes = await adminClient.from('profiles').select('*').eq('id', createdUserId).single();
    expect(profileRes.error).toBeNull();
    expect(profileRes.data.full_name).toBe('Wali Test');

    // Check if students exist
    const studentsRes = await adminClient.from('students').select('*').eq('parent_id', createdUserId);
    expect(studentsRes.error).toBeNull();
    expect(studentsRes.data?.length).toBe(2);
    expect(studentsRes.data?.find(s => s.student_name === 'Anak Pertama Test')).toBeDefined();
  }, 10000);
});
