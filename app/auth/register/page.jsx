'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, FieldLabel } from '@/components/ui/field'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">ثبت نام</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <FieldLabel>نام</FieldLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>ایمیل</FieldLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>رمز عبور</FieldLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>تکرار رمز عبور</FieldLabel>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            حساب کاربری دارید؟{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              ورود
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
