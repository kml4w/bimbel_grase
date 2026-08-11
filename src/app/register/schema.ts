import { z } from 'zod'

export const StudentSchema = z.object({
  student_name: z.string().min(3, { message: "Nama siswa minimal 3 karakter" }),
  age: z.coerce.number().min(5, { message: "Umur minimal 5 tahun" }),
  program_id: z.string().uuid({ message: "Program tidak valid" })
})

export const RegisterSchema = z.object({
  parentName: z.string().min(3, { message: "Nama orang tua minimal 3 karakter" }),
  phone: z.string().min(10, { message: "Nomor WhatsApp/HP tidak valid" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  students: z.array(StudentSchema).min(1, { message: "Minimal daftarkan 1 anak" })
})
