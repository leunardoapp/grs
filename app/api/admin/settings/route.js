import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { grsClient } from '@/lib/grs-client'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    const settingsObj = {}
    settings.forEach(s => {
      settingsObj[s.key] = s.value
    })
    return NextResponse.json(settingsObj)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({})
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { key, value } = body

    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  try {
    const body = await req.json()
    const { action } = body

    if (action === 'test-connection') {
      // Test GRS connection
      try {
        const result = await grsClient.getCities()
        if (grsClient.isGrsSuccess(result)) {
          return NextResponse.json({
            success: true,
            message: 'اتصال موفق',
          })
        } else {
          return NextResponse.json({
            success: false,
            message: grsClient.getGrsErrorMessage(result),
          })
        }
      } catch (err) {
        return NextResponse.json({
          success: false,
          message: err.message,
        })
      }
    }

    if (action === 'register-webhook') {
      const webhookUrl = body.webhookUrl
      const result = await grsClient.setWebhook(webhookUrl)
      
      if (grsClient.isGrsSuccess(result)) {
        await prisma.setting.upsert({
          where: { key: 'WEBHOOK_URL' },
          update: { value: webhookUrl },
          create: { key: 'WEBHOOK_URL', value: webhookUrl },
        })
        return NextResponse.json({
          success: true,
          message: 'وبهوک ثبت شد',
        })
      } else {
        return NextResponse.json({
          success: false,
          message: grsClient.getGrsErrorMessage(result),
        })
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
