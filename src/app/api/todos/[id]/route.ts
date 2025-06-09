import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Todo from '@/lib/models/Todo';
import mongoose from 'mongoose';
import { TodoUpdateData } from '@/types/todo';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { completed, text } = await request.json() as TodoUpdateData;
    const { id } = await params;
    if (typeof completed !== 'boolean' && !text) {
      return NextResponse.json(
        { error: 'Completed status or text is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    await dbConnect();
    const updateData: TodoUpdateData = {};
    if (typeof completed === 'boolean') updateData.completed = completed;
    if (text) updateData.text = text;

    const todo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      );
    }

    await dbConnect();
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }
} 