import { Problem, Round } from '@/lib/types';

export const rounds: Round[] = [
  'Algebra 1',
  'Algebra 2',
  'Statistics',
  'Geometry',
  'Calculus',
  'Pre-Calculus'
];

export const problemBank: Problem[] = [
  { id: 'A1-2022-1', year: 2022, round: 'Algebra 1', number: 1, statement: 'Solve for \\(x\\): \\(3x+5=20\\).', answer: '5', shortSolution: 'Subtract 5, then divide by 3.', estimatedSolveTimeSec: 20, difficulty: 1, topics: ['linear equations'] },
  { id: 'A1-2023-4', year: 2023, round: 'Algebra 1', number: 4, statement: 'If \\(2x-7=11\\), find \\(x\\).', answer: '9', shortSolution: 'Add 7 to get 18, divide by 2.', estimatedSolveTimeSec: 20, difficulty: 1, topics: ['linear equations'] },
  { id: 'A1-2021-9', year: 2021, round: 'Algebra 1', number: 9, statement: 'Factor: \\(x^2-9\\). Enter as \\((x-a)(x+b)\\) format.', answer: '(x-3)(x+3)', shortSolution: 'Difference of squares.', estimatedSolveTimeSec: 35, difficulty: 3, topics: ['factoring'] },
  { id: 'A2-2023-3', year: 2023, round: 'Algebra 2', number: 3, statement: 'If \\(x^2-5x+6=0\\), what is the larger root?', answer: '3', shortSolution: 'Factor into \\((x-2)(x-3)=0\\).', estimatedSolveTimeSec: 40, difficulty: 2, topics: ['quadratics'] },
  { id: 'A2-2022-8', year: 2022, round: 'Algebra 2', number: 8, statement: 'Compute \\(\n\\sum_{k=1}^{5} k\\).', answer: '15', shortSolution: '1+2+3+4+5=15.', estimatedSolveTimeSec: 15, difficulty: 1, topics: ['series'] },
  { id: 'A2-2021-14', year: 2021, round: 'Algebra 2', number: 14, statement: 'If \\(\log_2 x=5\\), find \\(x\\).', answer: '32', shortSolution: 'Rewrite as \\(x=2^5\\).', estimatedSolveTimeSec: 25, difficulty: 3, topics: ['logarithms'] },
  { id: 'S-2022-2', year: 2022, round: 'Statistics', number: 2, statement: 'Find the mean of 2, 4, 6, 8.', answer: '5', shortSolution: 'Sum is 20 over 4 values.', estimatedSolveTimeSec: 20, difficulty: 1, topics: ['mean'] },
  { id: 'S-2023-10', year: 2023, round: 'Statistics', number: 10, statement: 'Data set: 1, 2, 2, 3, 10. Median?', answer: '2', shortSolution: 'Middle value is 2.', estimatedSolveTimeSec: 20, difficulty: 2, topics: ['median'] },
  { id: 'S-2021-13', year: 2021, round: 'Statistics', number: 13, statement: 'A fair die is rolled once. Probability of getting at most 4?', answer: '2/3', shortSolution: 'Outcomes 1,2,3,4 are 4 of 6.', estimatedSolveTimeSec: 30, difficulty: 3, topics: ['probability'] },
  { id: 'G-2023-1', year: 2023, round: 'Geometry', number: 1, statement: 'Area of a triangle with base 10 and height 6?', answer: '30', shortSolution: '\\(\n\\tfrac12 bh=30\\).', estimatedSolveTimeSec: 20, difficulty: 1, topics: ['area'] },
  { id: 'G-2022-7', year: 2022, round: 'Geometry', number: 7, statement: 'Circumference of a circle with radius 4. Use \\(\pi\\).', answer: '8pi', shortSolution: '\\(C=2\\pi r=8\\pi\\).', estimatedSolveTimeSec: 20, difficulty: 2, topics: ['circle'] },
  { id: 'G-2021-16', year: 2021, round: 'Geometry', number: 16, statement: 'A right triangle has legs 5 and 12. Hypotenuse?', answer: '13', shortSolution: 'Use Pythagorean triple 5-12-13.', estimatedSolveTimeSec: 30, difficulty: 3, topics: ['pythagorean theorem'] },
  { id: 'C-2023-2', year: 2023, round: 'Calculus', number: 2, statement: 'Compute \\(\n\\frac{d}{dx}(x^3)\\).', answer: '3x^2', shortSolution: 'Power rule.', estimatedSolveTimeSec: 20, difficulty: 2, topics: ['derivative'] },
  { id: 'C-2022-11', year: 2022, round: 'Calculus', number: 11, statement: 'Compute \\(\int 2x\,dx\\).', answer: 'x^2+C', shortSolution: 'Antiderivative of \\(2x\\) is \\(x^2\\).', estimatedSolveTimeSec: 25, difficulty: 3, topics: ['integral'] },
  { id: 'C-2021-18', year: 2021, round: 'Calculus', number: 18, statement: 'If \\(f(x)=x^2\\), find \\(f\'(3)\\).', answer: '6', shortSolution: '\\(f\'(x)=2x\\), then evaluate at 3.', estimatedSolveTimeSec: 25, difficulty: 3, topics: ['derivative'] },
  { id: 'PC-2023-5', year: 2023, round: 'Pre-Calculus', number: 5, statement: 'Find \\(\sin(30^\circ)\\).', answer: '1/2', shortSolution: 'Special angle value.', estimatedSolveTimeSec: 15, difficulty: 1, topics: ['trigonometry'] },
  { id: 'PC-2022-12', year: 2022, round: 'Pre-Calculus', number: 12, statement: 'Find \\(\cos(60^\circ)\\).', answer: '1/2', shortSolution: 'Special angle value.', estimatedSolveTimeSec: 15, difficulty: 1, topics: ['trigonometry'] },
  { id: 'PC-2021-20', year: 2021, round: 'Pre-Calculus', number: 20, statement: 'Solve \\(2^x=16\\).', answer: '4', shortSolution: '\\(16=2^4\\).', estimatedSolveTimeSec: 20, difficulty: 2, topics: ['exponential'] }
];

const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();

export function isCorrectAnswer(input: string, answer: string): boolean {
  return normalize(input) === normalize(answer);
}

export function pickProblem(options: {
  exclude: Set<string>;
  round: 'All' | Round;
  rating: number;
  contestUsed?: Set<string>;
}): Problem {
  const desiredDifficulty = Math.max(1, Math.min(10, Math.round((options.rating - 1000) / 120) + 2));
  const filtered = problemBank.filter((p) => {
    const roundOk = options.round === 'All' || p.round === options.round;
    const excludeOk = !options.exclude.has(p.id);
    const contestOk = !options.contestUsed || !options.contestUsed.has(p.id);
    return roundOk && excludeOk && contestOk;
  });

  const pool = filtered.length > 0 ? filtered : problemBank.filter((p) => options.round === 'All' || p.round === options.round);
  pool.sort((a, b) => Math.abs(a.difficulty - desiredDifficulty) - Math.abs(b.difficulty - desiredDifficulty));

  const top = pool.slice(0, Math.min(6, pool.length));
  return top[Math.floor(Math.random() * top.length)];
}
