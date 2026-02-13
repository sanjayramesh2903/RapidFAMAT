export type Round =
  | 'Algebra 1'
  | 'Algebra 2'
  | 'Statistics'
  | 'Geometry'
  | 'Calculus'
  | 'Pre-Calculus';

export type Mode = 'infinite' | 'timed' | 'contest';

export type Problem = {
  id: string;
  year: number;
  round: Round;
  number: number;
  statement: string;
  answer: string;
  shortSolution: string;
  estimatedSolveTimeSec: number;
  difficulty: number;
  topics: string[];
};
