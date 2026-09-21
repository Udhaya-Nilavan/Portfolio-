/**
 * Authentic achievements grounded in verified profile data.
 * No fabricated rankings, ratings, or contest results.
 */
export interface Achievement {
  id: string;
  platform: 'hackerrank' | 'leetcode';
  platformLabel: string;
  title: string;
  statement: string;
  metadata: string;
  verifyUrl: string;
}

export const achievementsData: Achievement[] = [
  {
    id: 'hackerrank-python',
    platform: 'hackerrank',
    platformLabel: 'HackerRank',
    title: 'Python (Basic) \u2014 Verified Badge',
    statement: "Earned the Python (Basic) skill badge through HackerRank's verified assessment, demonstrating foundational Python programming ability.",
    metadata: 'Verified skill badge \u00b7 Python fundamentals',
    verifyUrl: 'https://www.hackerrank.com/profile/nilavanprithesh',
  },
  {
    id: 'hackerrank-problem-solving',
    platform: 'hackerrank',
    platformLabel: 'HackerRank',
    title: 'Problem Solving (Basic) \u2014 Verified Badge',
    statement: "Earned the Problem Solving (Basic) skill badge through HackerRank's verified assessment, covering algorithmic thinking and data structures.",
    metadata: 'Verified skill badge \u00b7 Algorithms & data structures',
    verifyUrl: 'https://www.hackerrank.com/profile/nilavanprithesh',
  },
  {
    id: 'leetcode-dsa',
    platform: 'leetcode',
    platformLabel: 'LeetCode',
    title: '50+ Problems Solved',
    statement: 'Solved 50+ Data Structures & Algorithms problems on LeetCode, practicing in Python and C++.',
    metadata: 'DSA practice · Python & C++ · Ongoing',
    verifyUrl: 'https://leetcode.com/u/UdhayaNilavan/',
  },
];
