import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { verifyPassword, signToken } from '../../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password required' 
      }, { status: 400 })
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, admin.password)

    if (!isValidPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 })
    }

    const token = signToken({ adminId: admin.id, email: admin.email })

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}