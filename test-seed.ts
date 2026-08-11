import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedAssignments() {
  const { data: programs, error: progErr } = await supabase.from('programs').select('id, name')
  if (progErr) {
    console.error("Error fetching programs:", progErr)
    return
  }

  for (const prog of programs) {
    const { error } = await supabase.from('assignments').insert({
      program_id: prog.id,
      title: 'Tugas Pemahaman - ' + prog.name,
      pdf_title: 'Modul_Materi_Bab_1.pdf',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      highlight_text: 'Silakan pelajari materi PDF yang dilampirkan dan kerjakan latihan soal pada halaman terakhir.',
      instructions: {
        steps: [
          "Download modul PDF",
          "Kerjakan soal latihan 1-5 di buku tulis",
          "Foto atau scan hasil pekerjaan",
          "Unggah (upload) pada form di bawah ini"
        ]
      }
    })
    if (error) console.error("Error inserting assignment for", prog.name, error)
    else console.log("Seeded assignment for", prog.name)
  }
}

seedAssignments()
