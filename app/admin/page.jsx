'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { formatCurrency } from '@/lib/persian-utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  const COLORS = ['#0D7A6B', '#F5A623', '#10B981', '#EF4444']

  const statusData = [
    { name: 'در انتظار', value: stats?.pendingReservations || 0 },
    { name: 'تایید شده', value: stats?.confirmedReservations || 0 },
  ]

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">داشبورد مدیریتی</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">کل رزروها</p>
          <p className="text-3xl font-bold">{stats?.totalReservations || 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">درآمد کل</p>
          <p className="text-3xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">در انتظار تایید</p>
          <p className="text-3xl font-bold text-yellow-600">{stats?.pendingReservations || 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">تعداد کاربران</p>
          <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">درآمد ماهانه</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line type="monotone" dataKey="_sum" stroke="#0D7A6B" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">وضعیت رزروها</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/reservations">
            <Button className="w-full">مدیریت رزروها</Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="outline" className="w-full">مدیریت کاربران</Button>
          </Link>
          <Link href="/admin/settings/api">
            <Button variant="outline" className="w-full">تنظیمات API</Button>
          </Link>
          <Link href="/admin/webhook-logs">
            <Button variant="outline" className="w-full">گزارش وبهوک</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
