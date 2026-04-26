'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, FieldLabel } from '@/components/ui/field'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      setMessage(data.message)
      setEmail('')
    } catch (err) {
      setMessage('خطایی رخ داد')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">بازیابی رمز عبور</h1>

        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-800 text-sm">{message}</p>
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/auth/login" className="text-primary hover:underline">
            بازگشت به ورود
          </Link>
        </div>
      </Card>
    </div>
  )
}
