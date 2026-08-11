import { describe, it, expect } from 'vitest'
import { RegisterSchema } from './schema'

describe('RegisterSchema Validation', () => {
  it('should validate correct data', () => {
    const validData = {
      parentName: "John Doe",
      phone: "081234567890",
      email: "john@example.com",
      password: "securepassword123",
      students: [{
        student_name: "Johnny",
        age: 10,
        program_id: "123e4567-e89b-12d3-a456-426614174000"
      }]
    }
    
    const result = RegisterSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject short parentName', () => {
    const invalidData = {
      parentName: "Jo", // < 3 chars
      phone: "081234567890",
      email: "john@example.com",
      password: "securepassword123",
      students: [{ student_name: "Johnny", age: 10, program_id: "123e4567-e89b-12d3-a456-426614174000" }]
    }
    
    const result = RegisterSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.parentName).toContain("Nama orang tua minimal 3 karakter")
    }
  })

  it('should reject empty students', () => {
    const invalidData = {
      parentName: "John Doe",
      phone: "081234567890",
      email: "john@example.com",
      password: "securepassword123",
      students: []
    }
    
    const result = RegisterSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.students).toContain("Minimal daftarkan 1 anak")
    }
  })
})
