import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminClient = createClient(supabaseUrl, supabaseServiceKey);

describe('Programs (Kelas) Integration Tests', () => {
  let createdProgramId: string;

  afterAll(async () => {
    // Cleanup
    if (createdProgramId) {
      await adminClient.from('programs').delete().eq('id', createdProgramId);
    }
  });

  it('Skenario Sukses: Berhasil membuat program kelas baru', async () => {
    const { data, error } = await adminClient.from('programs').insert({
      name: 'Kelas Testing Vitest',
      description: 'Deskripsi untuk kelas testing',
      fee: 250000
    }).select('*').single();

    expect(error).toBeNull();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Kelas Testing Vitest');
    expect(data.fee).toBe(250000);
    
    createdProgramId = data.id;
  });

  it('Skenario Sukses: Berhasil membaca data program yang baru dibuat', async () => {
    const { data, error } = await adminClient.from('programs').select('*').eq('id', createdProgramId).single();

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.name).toBe('Kelas Testing Vitest');
  });

  it('Skenario Sukses: Berhasil mengedit data program', async () => {
    const { data, error } = await adminClient.from('programs').update({
      fee: 300000
    }).eq('id', createdProgramId).select('*').single();

    expect(error).toBeNull();
    expect(data.fee).toBe(300000);
  });

  it('Skenario Gagal Validasi: Gagal membuat program tanpa nama kelas', async () => {
    const { data, error } = await adminClient.from('programs').insert({
      description: 'Ini tanpa nama',
      fee: 100000
    });

    // Harus error karena kolom 'name' NOT NULL
    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });
});
