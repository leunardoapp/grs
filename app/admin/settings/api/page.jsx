'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

export default function ApiSettingsPage() {
  const [settings, setSettings] = useState({})
  const [token, setToken] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings(data)
      setToken(data.GRS_TOKEN || '')
      setWebhookUrl(data.WEBHOOK_URL || '')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToken = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'GRS_TOKEN',
          value: token,
        }),
      })
      if (res.ok) {
        setMessage('توکن ذخیره شد')
      }
    } catch (err) {
      setMessage('خطا در ذخیره')
    }
  }

  const handleTestConnection = async () => {
    setTesting(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-connection' }),
      })
      const data = await res.json()
      setMessage(data.message)
    } catch (err) {
      setMessage('خطا در تست')
    } finally {
      setTesting(false)
    }
  }

  const handleRegisterWebhook = async () => {
    setTesting(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register-webhook',
          webhookUrl,
        }),
      })
      const data = await res.json()
      setMessage(data.message)
    } catch (err) {
      setMessage('خطا در ثبت')
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">تنظیمات API</h1>

      {message && (
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <p className="text-blue-800">{message}</p>
        </Card>
      )}

      <div className="grid gap-6">
        {/* GRS Token */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">توکن GRS</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">توکن</label>
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="توکن GRS"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveToken}>ذخیره</Button>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={testing}
              >
                {testing ? 'در حال تست...' : 'تست اتصال'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Webhook Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">تنظیمات Webhook</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">آدرس Webhook</label>
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://example.com/api/webhook/grs"
              />
            </div>
            <Button
              onClick={handleRegisterWebhook}
              disabled={testing}
            >
              {testing ? 'در حال ثبت...' : 'ثبت Webhook'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
