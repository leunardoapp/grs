'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, FieldLabel } from '@/components/ui/field'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
        <h1 className="text-2xl font-bold mb-6 text-center">ورود</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <FieldLabel>ایمیل</FieldLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>رمز عبور</FieldLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'در حال ورود...' : 'ورود'}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            حساب کاربری ندارید؟{' '}
            <Link href="/auth/register" className="text-primary hover:underline">
              ثبت نام
            </Link>
          </p>
          <p>
            <Link href="/auth/forgot-password" className="text-primary hover:underline">
              فراموشی رمز عبور
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
