import { describe, it, expect } from 'vitest'
import { ForgotPasswordSchema, UpdatePasswordSchema } from './actions'

describe('Password Reset Schemas Validation', () => {
  describe('ForgotPasswordSchema', () => {
    it('should validate correct email', () => {
      const result = ForgotPasswordSchema.safeParse({ email: "user@example.com" })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = ForgotPasswordSchema.safeParse({ email: "not-an-email" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toContain("Format email tidak valid")
      }
    })
  })

  describe('UpdatePasswordSchema', () => {
    it('should validate correct password', () => {
      const result = UpdatePasswordSchema.safeParse({ password: "newsecurepassword123" })
      expect(result.success).toBe(true)
    })

    it('should reject short password', () => {
      const result = UpdatePasswordSchema.safeParse({ password: "12345" })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain("Password minimal 6 karakter")
      }
    })
  })
})
