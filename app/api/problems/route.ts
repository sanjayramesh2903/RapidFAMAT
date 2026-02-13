import { NextRequest, NextResponse } from 'next/server';
import { pickProblem, rounds } from '@/lib/problems';
import { Round } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const exclude = new Set((searchParams.get('exclude') ?? '').split(',').filter(Boolean));
  const rating = Number(searchParams.get('rating') ?? 1200);
  const roundParam = searchParams.get('round') ?? 'All';

  const round = roundParam === 'All' || rounds.includes(roundParam as Round) ? (roundParam as 'All' | Round) : 'All';
  const problem = pickProblem({ exclude, rating, round });
  return NextResponse.json({ problem });
}
