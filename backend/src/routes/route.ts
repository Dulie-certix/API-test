import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { generatePassword } from "@/utils/generatePassword";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

interface RegisterBody {
  name: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Generate password
    const plainPassword = generatePassword(12);

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Save user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Account Password",
      text: `Hello ${name},

Your account has been created successfully.

Your Password: ${plainPassword}

Please login and change your password immediately.`,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}