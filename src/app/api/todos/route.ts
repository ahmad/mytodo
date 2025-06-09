import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/lib/models/Todo';
import { TodoFormData } from '@/types/todo';

export async function GET() {
  try {
    await dbConnect();
    const todos = await Todo.find().sort({ createdAt: -1 });
    return NextResponse.json(todos);
  } catch {
    return NextResponse.json({ message: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json() as TodoFormData;

    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Todo text is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const todo = await Todo.create({ text: text.trim() });
    return NextResponse.json(todo);
  } catch {
    return NextResponse.json({ message: 'Failed to create todo' }, { status: 500 });
  }
} 