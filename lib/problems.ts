export type Difficulty = "Easy" | "Medium" | "Hard"
export type ProblemLanguage = "en" | "ko"

export interface TestCase {
  input: unknown[]
  expected: unknown
}

export interface Problem {
  id: string
  title: string
  category: string
  categoryIcon: string
  difficulty: Difficulty
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  starterCode: string
  testCases: TestCase[]
  functionName: string
}

export interface ProblemTextBundle {
  title: string
  category: string
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
}

const baseProblems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    category: "Hash",
    categoryIcon: "Hash",
    difficulty: "Easy",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation:
          "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation:
          "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
    functionName: "twoSum",
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    category: "Stack",
    categoryIcon: "Layers",
    difficulty: "Easy",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation:
          "The opening parenthesis is closed by the same type in the correct order.",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation:
          "All three bracket pairs are valid and properly ordered.",
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation:
          "The opening '(' is closed by ']', so the bracket types do not match.",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    starterCode: `function isValid(s) {
  // Write your solution here
  
}`,
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false },
    ],
    functionName: "isValid",
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    category: "Linked List",
    categoryIcon: "Link",
    difficulty: "Easy",
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

Implement the solution iteratively.`,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation:
          "Reversing the linked direction changes the node order from left-to-right to right-to-left.",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        explanation:
          "After reversal, node 2 points to node 1, so the array form becomes [2,1].",
      },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    starterCode: `function reverseList(head) {
  // Write your solution here
  
}`,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { input: [[1, 2]], expected: [2, 1] },
    ],
    functionName: "reverseList",
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    category: "Dynamic Programming",
    categoryIcon: "TrendingUp",
    difficulty: "Medium",
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation:
          "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    starterCode: `function maxSubArray(nums) {
  // Write your solution here
  
}`,
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 },
    ],
    functionName: "maxSubArray",
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    category: "Arrays",
    categoryIcon: "LayoutGrid",
    difficulty: "Medium",
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation:
          "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4",
    ],
    starterCode: `function merge(intervals) {
  // Write your solution here
  
}`,
    testCases: [
      {
        input: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]],
      },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
    ],
    functionName: "merge",
  },
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    category: "Sliding Window",
    categoryIcon: "ScanLine",
    difficulty: "Medium",
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation:
          'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation:
          'The answer is "b", with the length of 1.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}`,
    testCases: [
      { input: ["abcabcbb"], expected: 3 },
      { input: ["bbbbb"], expected: 1 },
      { input: ["pwwkew"], expected: 3 },
    ],
    functionName: "lengthOfLongestSubstring",
  },
  {
    id: "binary-tree-level-order",
    title: "Binary Tree Level Order Traversal",
    category: "Trees",
    categoryIcon: "GitBranch",
    difficulty: "Hard",
    description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        explanation:
          "Level 0 is [3], level 1 is [9,20], and level 2 is [15,7].",
      },
      {
        input: "root = [1]",
        output: "[[1]]",
        explanation:
          "There is only one node at depth 0, so the traversal is [[1]].",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000",
    ],
    starterCode: `function levelOrder(root) {
  // Write your solution here
  
}`,
    testCases: [
      {
        input: [[3, 9, 20, null, null, 15, 7]],
        expected: [[3], [9, 20], [15, 7]],
      },
      { input: [[1]], expected: [[1]] },
    ],
    functionName: "levelOrder",
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    category: "Two Pointers",
    categoryIcon: "Droplets",
    difficulty: "Hard",
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation:
          "The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
        explanation:
          "Adding trapped water at each index in this elevation map gives a total of 9.",
      },
    ],
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5",
    ],
    starterCode: `function trap(height) {
  // Write your solution here
  
}`,
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    ],
    functionName: "trap",
  },
  {
    id: "stock-prices",
    title: "Stock Prices",
    category: "Stack",
    categoryIcon: "Layers",
    difficulty: "Medium",
    description: `Given an integer array \`prices\` where \`prices[i]\` is the stock price at second \`i\`, return an array where each element is how many seconds pass before the price drops.

If the price never drops afterward, count until the last second.`,
    examples: [
      {
        input: "prices = [1,2,3,2,3]",
        output: "[4,3,1,1,0]",
        explanation:
          "At index 2 (price 3), the first lower price appears at index 3 (price 2), so its duration is 1.",
      },
      {
        input: "prices = [5,4,3,2,1]",
        output: "[1,1,1,1,0]",
        explanation:
          "Each price drops immediately at the next second, except the last one which has no later price.",
      },
    ],
    constraints: [
      "1 <= prices.length <= 100000",
      "1 <= prices[i] <= 10000",
    ],
    starterCode: `function stockPrices(prices) {
  // Write your solution here
  
}`,
    testCases: [
      { input: [[1, 2, 3, 2, 3]], expected: [4, 3, 1, 1, 0] },
      { input: [[5, 4, 3, 2, 1]], expected: [1, 1, 1, 1, 0] },
      { input: [[1, 2, 3, 4, 5]], expected: [4, 3, 2, 1, 0] },
    ],
    functionName: "stockPrices",
  },
  {
    id: "tower-signal",
    title: "Signal Receiver (Towers)",
    category: "Stack",
    categoryIcon: "Layers",
    difficulty: "Medium",
    description: `Towers are placed from left to right, and each tower sends a signal to the left.

For each tower, find the index (1-based) of the first taller tower to its left that receives the signal. If none exists, return 0 for that tower.`,
    examples: [
      {
        input: "heights = [6,9,5,7,4]",
        output: "[0,0,2,2,4]",
        explanation:
          "Tower 4 (height 7) skips tower 3 (height 5) and is received by tower 2 (height 9).",
      },
      {
        input: "heights = [4,3,2,1]",
        output: "[0,1,2,3]",
        explanation:
          "Each tower (except the first) is received by the immediate left tower because it is taller.",
      },
    ],
    constraints: [
      "1 <= heights.length <= 100000",
      "1 <= heights[i] <= 100000000",
    ],
    starterCode: `function towerSignal(heights) {
  // Write your solution here
  
}`,
    testCases: [
      { input: [[6, 9, 5, 7, 4]], expected: [0, 0, 2, 2, 4] },
      { input: [[4, 3, 2, 1]], expected: [0, 1, 2, 3] },
      { input: [[1, 2, 3, 4]], expected: [0, 0, 0, 0] },
    ],
    functionName: "towerSignal",
  },
  {
    id: "process-scheduler",
    title: "Process Scheduler",
    category: "Queue",
    categoryIcon: "Layers",
    difficulty: "Medium",
    description: `The operating system manages processes with the following rules:

1. Pop one process from the front of the waiting queue.
2. If there is any process in the queue with a higher priority, push the popped process to the back.
3. Otherwise, execute and terminate the popped process.

Given \`priorities\` and \`location\`, return the execution order (1-based) of the process at \`location\`.`,
    examples: [
      {
        input: "priorities = [2,1,3,2], location = 2",
        output: "1",
        explanation:
          "The process at index 2 has the highest priority (3), so it is executed first.",
      },
      {
        input: "priorities = [1,1,9,1,1,1], location = 0",
        output: "5",
        explanation:
          "Priority 9 executes first, and the process at index 0 is executed as the 5th process.",
      },
    ],
    constraints: [
      "1 <= priorities.length <= 100",
      "1 <= priorities[i] <= 9",
      "0 <= location < priorities.length",
    ],
    starterCode: `function processScheduler(priorities, location) {
  // Write your solution here
  
}`,
    testCases: [
      { input: [[2, 1, 3, 2], 2], expected: 1 },
      { input: [[1, 1, 9, 1, 1, 1], 0], expected: 5 },
      { input: [[1, 2, 3, 4], 1], expected: 3 },
    ],
    functionName: "processScheduler",
  },
]

const ADDITIONAL_PROBLEMS_PER_CATEGORY: Record<Problem["id"], number> = {
  "two-sum": 6,
  "valid-parentheses": 4,
  "reverse-linked-list": 7,
  "maximum-subarray": 5,
  "merge-intervals": 8,
  "longest-substring": 4,
  "binary-tree-level-order": 6,
  "trapping-rain-water": 5,
  "stock-prices": 4,
  "tower-signal": 4,
  "process-scheduler": 4,
}
const BASE_PROBLEMS_PER_CATEGORY = 20

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function maxSubArrayValue(nums: number[]): number {
  let best = nums[0]
  let current = nums[0]
  for (let i = 1; i < nums.length; i += 1) {
    current = Math.max(nums[i], current + nums[i])
    best = Math.max(best, current)
  }
  return best
}

function mergeIntervalsValue(intervals: number[][]): number[][] {
  const sorted = intervals
    .map((it) => [it[0], it[1]])
    .sort((a, b) => a[0] - b[0])
  const merged: number[][] = []
  for (const interval of sorted) {
    if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
      merged.push(interval)
      continue
    }
    merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], interval[1])
  }
  return merged
}

function longestUniqueSubstringValue(s: string): number {
  const map = new Map<string, number>()
  let left = 0
  let best = 0
  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right]
    if (map.has(ch) && (map.get(ch) ?? -1) >= left) {
      left = (map.get(ch) ?? 0) + 1
    }
    map.set(ch, right)
    best = Math.max(best, right - left + 1)
  }
  return best
}

function levelOrderFromArray(root: Array<number | null>): number[][] {
  if (root.length === 0 || root[0] === null) {
    return []
  }
  const levels: number[][] = []
  let level = 0
  while (true) {
    const start = 2 ** level - 1
    if (start >= root.length) {
      break
    }
    const end = Math.min(root.length, 2 ** (level + 1) - 1)
    const values: number[] = []
    for (let i = start; i < end; i += 1) {
      const value = root[i]
      if (value !== null && value !== undefined) {
        values.push(value)
      }
    }
    if (values.length > 0) {
      levels.push(values)
    }
    level += 1
  }
  return levels
}

function trapRainWaterValue(height: number[]): number {
  let left = 0
  let right = height.length - 1
  let leftMax = 0
  let rightMax = 0
  let water = 0

  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left])
      water += leftMax - height[left]
      left += 1
    } else {
      rightMax = Math.max(rightMax, height[right])
      water += rightMax - height[right]
      right -= 1
    }
  }

  return water
}

function stockPriceDurationValue(prices: number[]): number[] {
  const result = Array.from({ length: prices.length }, () => 0)
  const stack: number[] = []

  for (let i = 0; i < prices.length; i += 1) {
    while (stack.length > 0 && prices[i] < prices[stack[stack.length - 1]]) {
      const idx = stack.pop()
      if (idx === undefined) {
        break
      }
      result[idx] = i - idx
    }
    stack.push(i)
  }

  while (stack.length > 0) {
    const idx = stack.pop()
    if (idx === undefined) {
      break
    }
    result[idx] = prices.length - 1 - idx
  }

  return result
}

function towerSignalValue(heights: number[]): number[] {
  const receivers = Array.from({ length: heights.length }, () => 0)
  const stack: Array<{ index: number; height: number }> = []

  for (let i = 0; i < heights.length; i += 1) {
    while (stack.length > 0 && stack[stack.length - 1].height <= heights[i]) {
      stack.pop()
    }
    receivers[i] = stack.length > 0 ? stack[stack.length - 1].index + 1 : 0
    stack.push({ index: i, height: heights[i] })
  }

  return receivers
}

function processSchedulerValue(priorities: number[], location: number): number {
  const queue = priorities.map((priority, index) => ({ priority, index }))
  let order = 0

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      break
    }
    const hasHigher = queue.some((item) => item.priority > current.priority)
    if (hasHigher) {
      queue.push(current)
      continue
    }
    order += 1
    if (current.index === location) {
      return order
    }
  }

  return order
}

function buildTestCases(seedId: Problem["id"], index: number): TestCase[] {
  const n = index + 2
  switch (seedId) {
    case "two-sum": {
      const numsA = [n, n + 5, n + 11, n + 2, n + 20]
      const numsB = [n + 3, n * 2, n + 8, n * 3, n + 9]
      const numsC = [n + 10, n + 1, n + 7, n + 14, n + 4]
      return [
        { input: [numsA, numsA[0] + numsA[3]], expected: [0, 3] },
        { input: [numsB, numsB[1] + numsB[2]], expected: [1, 2] },
        { input: [numsC, numsC[0] + numsC[1]], expected: [0, 1] },
      ]
    }
    case "valid-parentheses": {
      const samples = [
        ["([]{})", true],
        ["([{}])", true],
        ["([)]", false],
        ["(((())))", true],
        ["{[}]", false],
        ["(()", false],
      ] as const
      const a = samples[index % samples.length]
      const b = samples[(index + 2) % samples.length]
      const c = samples[(index + 4) % samples.length]
      return [
        { input: [a[0]], expected: a[1] },
        { input: [b[0]], expected: b[1] },
        { input: [c[0]], expected: c[1] },
      ]
    }
    case "reverse-linked-list": {
      const listA = Array.from({ length: 3 + (index % 4) }, (_, i) => n + i)
      const listB = Array.from({ length: 2 + (index % 3) }, (_, i) => n * 2 + i)
      return [
        { input: [listA], expected: [...listA].reverse() },
        { input: [listB], expected: [...listB].reverse() },
      ]
    }
    case "maximum-subarray": {
      const numsA = [-2, n, -1, n + 1, -3, n + 2]
      const numsB = [n, -1, -2, n + 4, -1, 2]
      const numsC = [-n, -2, -1, -3]
      return [
        { input: [numsA], expected: maxSubArrayValue(numsA) },
        { input: [numsB], expected: maxSubArrayValue(numsB) },
        { input: [numsC], expected: maxSubArrayValue(numsC) },
      ]
    }
    case "merge-intervals": {
      const intervalsA = [[1, 2 + (index % 3)], [2, 5 + (index % 2)], [8, 10], [9, 12]]
      const intervalsB = [[0, 1], [1, 3], [4, 6], [5, 7 + (index % 2)]]
      return [
        { input: [intervalsA], expected: mergeIntervalsValue(intervalsA) },
        { input: [intervalsB], expected: mergeIntervalsValue(intervalsB) },
      ]
    }
    case "longest-substring": {
      const samples = ["abcdeafgh", "pwwkewxyz", "abba", "dvdf", "tmmzuxt", "anviaj"]
      const a = samples[index % samples.length]
      const b = samples[(index + 3) % samples.length]
      return [
        { input: [a], expected: longestUniqueSubstringValue(a) },
        { input: [b], expected: longestUniqueSubstringValue(b) },
      ]
    }
    case "binary-tree-level-order": {
      const rootA: Array<number | null> = [n, n + 1, n + 2, null, n + 3, n + 4, null]
      const rootB: Array<number | null> = [n + 10, n + 11, n + 12, n + 13, null, null, n + 14]
      return [
        { input: [rootA], expected: levelOrderFromArray(rootA) },
        { input: [rootB], expected: levelOrderFromArray(rootB) },
      ]
    }
    case "trapping-rain-water": {
      const heightsA = [0, 2 + (index % 3), 1, 3 + (index % 2), 0, 1, 2]
      const heightsB = [4, 1 + (index % 2), 0, 2, 3, 0, 2]
      return [
        { input: [heightsA], expected: trapRainWaterValue(heightsA) },
        { input: [heightsB], expected: trapRainWaterValue(heightsB) },
      ]
    }
    case "stock-prices": {
      const pricesA = [1, 2 + (index % 2), 3 + (index % 3), 2, 3]
      const pricesB = [5 + (index % 3), 4 + (index % 2), 3, 2, 1]
      return [
        { input: [pricesA], expected: stockPriceDurationValue(pricesA) },
        { input: [pricesB], expected: stockPriceDurationValue(pricesB) },
      ]
    }
    case "tower-signal": {
      const heightsA = [6 + (index % 2), 9 + (index % 3), 5, 7 + (index % 2), 4]
      const heightsB = [4 + (index % 3), 3, 2, 1]
      return [
        { input: [heightsA], expected: towerSignalValue(heightsA) },
        { input: [heightsB], expected: towerSignalValue(heightsB) },
      ]
    }
    case "process-scheduler": {
      const prioritiesA = [2, 1 + (index % 2), 3 + (index % 3), 2]
      const prioritiesB = [1, 1, 9, 1, 1, 1]
      return [
        { input: [prioritiesA, 2], expected: processSchedulerValue(prioritiesA, 2) },
        { input: [prioritiesB, index % prioritiesB.length], expected: processSchedulerValue(prioritiesB, index % prioritiesB.length) },
      ]
    }
    default:
      return []
  }
}

function toKebabCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const generatedTitlePool: Record<Problem["id"], string[]> = {
  "two-sum": [
    "Coupon Pair Match",
    "Delivery Budget Pair",
    "Two Prices, One Receipt",
    "Rally Score Pair",
    "Battery Cell Match",
    "Gift Card Exact Pair",
    "Promotion Bundle Pair",
    "Inventory Sum Check",
    "Auction Target Pair",
    "Transit Fare Pair",
    "Expense Pair Finder",
    "Round Score Pair",
    "Coin Box Pair",
    "Order Pair Validator",
    "Discount Pair Index",
    "Warehouse Pair Search",
    "Meeting Time Pair",
    "Peak Load Pair",
    "Route Cost Pair",
    "Session Token Pair",
  ],
  "valid-parentheses": [
    "Bracket Stream Validator",
    "Template Tag Balance",
    "Macro Parenthesis Check",
    "Expression Safety Filter",
    "Block Scope Validator",
    "Formula Bracket Audit",
    "Config Wrapper Check",
    "Nested Token Validator",
    "Script Delimiter Guard",
    "Query Grouping Validation",
    "Text Parser Brackets",
    "Snippet Pair Verifier",
    "Stack Input Sanity",
    "Bracket Order Review",
    "Command Wrapper Check",
    "Code Fence Validator",
    "Math Input Balance",
    "Log Delimiter Check",
    "Syntax Pair Detector",
    "Program Block Verify",
  ],
  "reverse-linked-list": [
    "Undo Recent Events",
    "Reverse Task Queue",
    "Backtrack Navigation Chain",
    "Reverse Playlist Nodes",
    "Message Chain Flip",
    "Shipment Route Reversal",
    "Access History Reverse",
    "Rollback Commit Chain",
    "Reverse Sensor Stream",
    "Flip Service Linked Path",
    "Call Log Rewind",
    "Node Direction Swap",
    "Emergency Route Reverse",
    "Reverse Job Pipeline",
    "Backorder Chain Flip",
    "Reverse Ticket Chain",
    "Customer Path Reversal",
    "Reverse Audit Trail",
    "Inbound Link Reversal",
    "Node Rewind Operation",
  ],
  "maximum-subarray": [
    "Best Sales Streak",
    "Peak Energy Window",
    "Maximum Profit Span",
    "Campaign Gain Segment",
    "Signal Strength Burst",
    "Top Momentum Slice",
    "Revenue Boost Interval",
    "Player Combo Maximum",
    "Heatmap High Segment",
    "Best Growth Range",
    "Market Surge Sequence",
    "Maximum Lift Interval",
    "Season Score Streak",
    "Prime Window Gain",
    "Cost Benefit Segment",
    "Pulse Peak Subarray",
    "Ad Trend Maximum",
    "Traffic Spike Span",
    "Value Run Optimizer",
    "Top Segment Finder",
  ],
  "merge-intervals": [
    "Meeting Room Merge",
    "Reservation Time Consolidation",
    "Maintenance Window Merge",
    "Delivery Slot Merge",
    "Sensor Active Range Merge",
    "Schedule Overlap Compression",
    "Campaign Time Merge",
    "Service Downtime Merge",
    "Clinic Appointment Merge",
    "Shift Interval Consolidation",
    "Broadcast Window Merge",
    "Route Closure Merge",
    "Booking Interval Cleanup",
    "Trip Segment Merge",
    "Training Session Merge",
    "Alert Time Merge",
    "Office Access Merge",
    "Ticketing Window Merge",
    "Machine Runtime Merge",
    "Classroom Block Merge",
  ],
  "longest-substring": [
    "Unique Chat Window",
    "Longest Unique Access Key",
    "No-Duplicate Signal Span",
    "Password Segment Scanner",
    "Distinct Character Window",
    "Longest Clean Token Span",
    "Unique Event Burst",
    "Distinct Input Detector",
    "Key Stream Unique Range",
    "Unique Session Slice",
    "Longest Marker Sequence",
    "Distinct Path Segment",
    "No-Repeat Window Size",
    "Unique Word Stream",
    "Packet ID Window",
    "Distinct Tag Tracker",
    "Unique Cursor Span",
    "Longest Fresh Segment",
    "Message Diversity Window",
    "Unique Fragment Search",
  ],
  "binary-tree-level-order": [
    "Organization Level Walk",
    "Server Rack Level Scan",
    "Family Tree Layer Output",
    "Route Tree Breadth Read",
    "Menu Tree Level Listing",
    "Cluster Node Level Trace",
    "Decision Tree Layer Walk",
    "Branch Depth Snapshot",
    "Site Map Level Order",
    "Hierarchy Level Collect",
    "Binary Layer Collector",
    "Breadth Queue Traversal",
    "Level Grouping of Nodes",
    "Tree Floor Enumeration",
    "Wavefront Tree Scan",
    "Node Level Aggregation",
    "Layered Branch Output",
    "Team Hierarchy Traversal",
    "Grid Command Tree Levels",
    "System Tree Breadth Pass",
  ],
  "trapping-rain-water": [
    "Rooftop Water Capture",
    "Street Basin Calculator",
    "Terrain Pool Estimator",
    "Flood Pocket Counter",
    "Rain Bucket Layout",
    "City Drainage Estimator",
    "Barrier Water Volume",
    "Canal Wall Water Count",
    "Stormwater Retention",
    "Valley Fill Measurement",
    "Blocked Drain Accumulation",
    "Water Between Towers",
    "Dam Segment Capacity",
    "Urban Rain Catchment",
    "Pit Volume Finder",
    "Rainfall Hold Calculator",
    "Gutter Water Counter",
    "Reservoir Gap Estimator",
    "Platform Water Storage",
    "Puddle Capacity Scan",
  ],
  "stock-prices": [
    "Stock Price Duration",
    "Price Drop Timer",
    "Quote Stability Window",
    "Market Tick Duration",
    "Price Hold Counter",
    "Second-by-Second Price Guard",
    "Price Fall Watcher",
    "Trade Price Lifespan",
  ],
  "tower-signal": [
    "Left Signal Receiver",
    "Tower Laser Receiver",
    "Skyline Signal Match",
    "Antenna Left Catch",
    "Receiver Tower Index",
    "Signal Block and Receive",
    "Taller Left Tower Search",
    "Line of Towers Signal",
  ],
  "process-scheduler": [
    "Printer Queue Scheduler",
    "CPU Priority Dispatch",
    "Task Queue Execution Order",
    "Priority Rotation Queue",
    "Job Dispatch Sequence",
    "Execution Rank by Priority",
    "Process Queue Simulator",
    "High Priority First Run",
  ],
}

const generatedTitlePoolKo: Record<Problem["id"], string[]> = {
  "two-sum": [
    "쿠폰 짝 매칭",
    "배달 예산 페어",
    "영수증 두 가격 찾기",
    "랠리 점수 페어",
    "배터리 셀 매칭",
    "기프트카드 정확한 합",
    "프로모션 묶음 페어",
    "재고 합계 점검",
    "경매 목표값 페어",
    "교통 요금 페어",
    "지출 페어 탐색",
    "라운드 점수 페어",
    "코인박스 페어",
    "주문 페어 검증",
    "할인 페어 인덱스",
    "창고 페어 검색",
    "미팅 시간 페어",
    "피크 부하 페어",
    "경로 비용 페어",
    "세션 토큰 페어",
  ],
  "valid-parentheses": [
    "괄호 스트림 검증",
    "템플릿 태그 균형",
    "매크로 괄호 점검",
    "표현식 안전 필터",
    "블록 스코프 검증",
    "수식 괄호 감사",
    "설정 래퍼 점검",
    "중첩 토큰 검증",
    "스크립트 구분자 보호",
    "쿼리 그룹 검증",
    "텍스트 파서 괄호",
    "스니펫 페어 확인",
    "스택 입력 유효성",
    "괄호 순서 점검",
    "명령 래퍼 검증",
    "코드 펜스 검증",
    "수학 입력 균형",
    "로그 구분자 점검",
    "문법 페어 탐지",
    "프로그램 블록 검증",
  ],
  "reverse-linked-list": [
    "최근 이벤트 되감기",
    "작업 큐 뒤집기",
    "내비게이션 체인 반전",
    "재생목록 노드 반전",
    "메시지 체인 뒤집기",
    "배송 경로 역순",
    "접속 기록 반전",
    "커밋 체인 롤백",
    "센서 스트림 반전",
    "서비스 링크 경로 반전",
    "통화 기록 되돌리기",
    "노드 방향 전환",
    "긴급 경로 반전",
    "작업 파이프라인 반전",
    "백오더 체인 반전",
    "티켓 체인 반전",
    "고객 경로 역방향",
    "감사 추적 반전",
    "인바운드 링크 반전",
    "노드 되감기 연산",
  ],
  "maximum-subarray": [
    "최고 매출 구간",
    "에너지 피크 구간",
    "최대 이익 연속 구간",
    "캠페인 성과 구간",
    "신호 강도 버스트",
    "최고 모멘텀 슬라이스",
    "매출 상승 구간",
    "플레이어 콤보 최대",
    "히트맵 최고 구간",
    "성장률 최고 범위",
    "시장 급등 시퀀스",
    "최대 상승 구간",
    "시즌 점수 연속 구간",
    "핵심 윈도우 이득",
    "비용 대비 이득 구간",
    "펄스 피크 부분배열",
    "광고 트렌드 최대",
    "트래픽 급증 구간",
    "가치 연속 구간 최적화",
    "최상위 구간 찾기",
  ],
  "merge-intervals": [
    "회의실 시간 병합",
    "예약 시간 통합",
    "점검 윈도우 병합",
    "배송 슬롯 병합",
    "센서 활성 구간 병합",
    "일정 겹침 압축",
    "캠페인 시간 병합",
    "서비스 중단 구간 병합",
    "진료 예약 병합",
    "근무 시간 통합",
    "방송 시간 병합",
    "경로 통제 구간 병합",
    "예매 구간 정리",
    "여행 구간 병합",
    "교육 세션 병합",
    "알림 시간 병합",
    "오피스 출입 시간 병합",
    "티켓 윈도우 병합",
    "장비 가동 구간 병합",
    "강의실 블록 병합",
  ],
  "longest-substring": [
    "고유 채팅 구간",
    "최장 고유 키 구간",
    "중복 없는 신호 길이",
    "패스워드 구간 스캔",
    "중복 없는 문자 윈도우",
    "클린 토큰 최장 구간",
    "고유 이벤트 버스트",
    "입력 고유 구간 탐지",
    "키 스트림 고유 범위",
    "세션 고유 구간",
    "마커 최장 시퀀스",
    "경로 고유 구간",
    "무중복 윈도우 길이",
    "고유 단어 스트림",
    "패킷 ID 윈도우",
    "태그 고유 추적",
    "커서 고유 구간",
    "신규 문자 최장 구간",
    "메시지 다양성 윈도우",
    "고유 조각 탐색",
  ],
  "binary-tree-level-order": [
    "조직도 레벨 순회",
    "서버 랙 레벨 스캔",
    "가계도 레이어 출력",
    "경로 트리 너비 순회",
    "메뉴 트리 레벨 목록",
    "클러스터 노드 레벨 추적",
    "의사결정 트리 레이어 순회",
    "브랜치 깊이 스냅샷",
    "사이트맵 레벨 순회",
    "계층 레벨 수집",
    "이진 레이어 수집기",
    "너비 우선 큐 순회",
    "노드 레벨 그룹화",
    "트리 층별 열거",
    "웨이브프론트 트리 스캔",
    "노드 레벨 집계",
    "레이어 브랜치 출력",
    "팀 계층 순회",
    "명령 트리 레벨",
    "시스템 트리 너비 탐색",
  ],
  "trapping-rain-water": [
    "옥상 물 고임 계산",
    "도로 웅덩이 계산기",
    "지형 물웅덩이 추정",
    "침수 포켓 카운터",
    "빗물 버킷 배치",
    "도시 배수량 추정",
    "장벽 사이 물의 양",
    "수로 벽 물 저장량",
    "우수 저류량 계산",
    "골짜기 채움 측정",
    "막힌 배수로 누적량",
    "타워 사이 물의 양",
    "댐 구간 수용량",
    "도심 빗물 포집량",
    "함몰 구간 부피 계산",
    "강우 보유량 계산기",
    "홈통 물의 양 계산",
    "저수 구간 추정",
    "플랫폼 물 저장량",
    "웅덩이 용량 스캔",
  ],
  "stock-prices": [
    "주식 가격 유지시간",
    "가격 하락 타이머",
    "시세 안정 구간",
    "시장 틱 지속시간",
    "가격 유지 카운터",
    "초 단위 가격 감시",
    "가격 하락 감지기",
    "거래가 지속시간",
  ],
  "tower-signal": [
    "왼쪽 신호 수신",
    "탑 레이저 수신",
    "스카이라인 신호 매칭",
    "안테나 왼쪽 수신",
    "수신 탑 인덱스",
    "신호 차단과 수신",
    "왼쪽 높은 탑 탐색",
    "일렬 탑 신호",
  ],
  "process-scheduler": [
    "프린터 큐 스케줄러",
    "CPU 우선순위 디스패치",
    "작업 큐 실행 순서",
    "우선순위 회전 큐",
    "작업 디스패치 순서",
    "우선순위 실행 순번",
    "프로세스 큐 시뮬레이터",
    "높은 우선순위 선실행",
  ],
}

const generatedTitleSuffixPool: Record<Problem["id"], string[]> = {
  "two-sum": [
    "Cafe Receipt Edition",
    "Campus Festival Edition",
    "Server Cost Edition",
    "Travel Budget Edition",
    "Night Shift Edition",
    "Scoreboard Edition",
    "Marketplace Edition",
    "Warehouse Edition",
  ],
  "valid-parentheses": [
    "Template Parser Edition",
    "Log Format Edition",
    "Compiler Input Edition",
    "Script Checker Edition",
    "Query Sanitizer Edition",
    "Report Validator Edition",
    "Config Guard Edition",
    "Batch Job Edition",
  ],
  "reverse-linked-list": [
    "History Undo Edition",
    "Playlist Recovery Edition",
    "Navigation Rollback Edition",
    "Signal Replay Edition",
    "Service Chain Edition",
    "Queue Restore Edition",
    "Archive Trace Edition",
    "Data Sync Edition",
  ],
  "maximum-subarray": [
    "Quarterly Revenue Edition",
    "Sensor Peak Edition",
    "Ad Campaign Edition",
    "Trading Session Edition",
    "Training Week Edition",
    "Traffic Burst Edition",
    "Energy Cycle Edition",
    "KPI Analysis Edition",
  ],
  "merge-intervals": [
    "Meeting Calendar Edition",
    "Clinic Booking Edition",
    "Downtime Window Edition",
    "Airport Slot Edition",
    "Library Room Edition",
    "Exam Schedule Edition",
    "Streaming Program Edition",
    "Parking Reservation Edition",
  ],
  "longest-substring": [
    "User Handle Edition",
    "Access Token Edition",
    "Packet Stream Edition",
    "Chat Filter Edition",
    "Session Key Edition",
    "Serial Code Edition",
    "Device Name Edition",
    "Input Buffer Edition",
  ],
  "binary-tree-level-order": [
    "Department Chart Edition",
    "Game Skill Tree Edition",
    "Building Map Edition",
    "Routing Table Edition",
    "Family Registry Edition",
    "Menu Category Edition",
    "Warehouse Zone Edition",
    "School Org Chart Edition",
  ],
  "trapping-rain-water": [
    "Storm Drain Edition",
    "Rooftop Valley Edition",
    "City Flood Edition",
    "Canal Barrier Edition",
    "Farm Irrigation Edition",
    "Subway Tunnel Edition",
    "Dam Safety Edition",
    "Bridge Deck Edition",
  ],
  "stock-prices": [
    "Volatility Edition",
    "Real-Time Quote Edition",
    "Trading Floor Edition",
    "Risk Monitor Edition",
  ],
  "tower-signal": [
    "Radio Tower Edition",
    "City Skyline Edition",
    "Antenna Network Edition",
    "Control Center Edition",
  ],
  "process-scheduler": [
    "Printer Center Edition",
    "Operating System Edition",
    "Dispatch Queue Edition",
    "Task Manager Edition",
  ],
}

const generatedTitleSuffixPoolKo: Record<Problem["id"], string[]> = {
  "two-sum": [
    "카페 영수증 편",
    "축제 정산 편",
    "서버 비용 편",
    "여행 예산 편",
    "야간 근무 편",
    "전광판 점수 편",
    "마켓 정산 편",
    "창고 재고 편",
  ],
  "valid-parentheses": [
    "템플릿 파서 편",
    "로그 포맷 편",
    "컴파일러 입력 편",
    "스크립트 점검 편",
    "쿼리 검증 편",
    "리포트 검사 편",
    "설정 보호 편",
    "배치 작업 편",
  ],
  "reverse-linked-list": [
    "기록 되돌리기 편",
    "재생목록 복구 편",
    "경로 롤백 편",
    "신호 재생 편",
    "서비스 체인 편",
    "큐 복원 편",
    "추적 로그 편",
    "동기화 복구 편",
  ],
  "maximum-subarray": [
    "분기 매출 편",
    "센서 피크 편",
    "광고 성과 편",
    "거래 세션 편",
    "훈련 주간 편",
    "트래픽 급증 편",
    "에너지 사이클 편",
    "지표 분석 편",
  ],
  "merge-intervals": [
    "회의 캘린더 편",
    "진료 예약 편",
    "점검 시간 편",
    "공항 슬롯 편",
    "열람실 예약 편",
    "시험 시간표 편",
    "방송 편성 편",
    "주차 예약 편",
  ],
  "longest-substring": [
    "사용자 핸들 편",
    "접근 토큰 편",
    "패킷 스트림 편",
    "채팅 필터 편",
    "세션 키 편",
    "일련번호 편",
    "장치 이름 편",
    "입력 버퍼 편",
  ],
  "binary-tree-level-order": [
    "조직도 편",
    "스킬 트리 편",
    "건물 안내 편",
    "라우팅 표 편",
    "가계도 편",
    "메뉴 분류 편",
    "창고 구역 편",
    "학교 체계도 편",
  ],
  "trapping-rain-water": [
    "폭우 배수 편",
    "옥상 골짜기 편",
    "도시 침수 편",
    "수로 장벽 편",
    "농지 관개 편",
    "지하 터널 편",
    "댐 안전 편",
    "교량 상판 편",
  ],
  "stock-prices": [
    "변동성 편",
    "실시간 시세 편",
    "트레이딩 플로어 편",
    "리스크 모니터 편",
  ],
  "tower-signal": [
    "무선 타워 편",
    "도시 스카이라인 편",
    "안테나 네트워크 편",
    "관제센터 편",
  ],
  "process-scheduler": [
    "프린터 센터 편",
    "운영체제 편",
    "디스패치 큐 편",
    "태스크 매니저 편",
  ],
}

function buildGeneratedDescription(seed: Problem["id"], title: string): string {
  switch (seed) {
    case "two-sum":
      return `In "${title}", you are given a list of integer values and a target total. Find the two different positions whose values add up to the target.

Return the two indices in any order. You may assume there is exactly one valid answer.`
    case "valid-parentheses":
      return `In "${title}", you receive a string containing only bracket characters.

Determine whether every opening bracket is closed by the correct type and in the correct order.`
    case "reverse-linked-list":
      return `In "${title}", a singly linked sequence is represented as an array in input order.

Return the sequence in reversed order as if the linked list pointers were fully reversed.`
    case "maximum-subarray":
      return `In "${title}", each integer represents gain or loss at each time step.

Find the maximum possible sum of a contiguous non-empty segment.`
    case "merge-intervals":
      return `In "${title}", each entry is a time interval \`[start, end]\`.

Merge every overlapping interval and return the minimal list of non-overlapping intervals.`
    case "longest-substring":
      return `In "${title}", given a string \`s\`, find the maximum length of a contiguous substring with all unique characters.`
    case "binary-tree-level-order":
      return `In "${title}", the binary tree is provided in array form (level-order with \`null\` gaps).

Return node values grouped by depth from top to bottom and left to right.`
    case "trapping-rain-water":
      return `In "${title}", each number is the height of a wall with width 1.

Compute how many total units of rainwater are trapped after rainfall.`
    case "process-scheduler":
      return `In "${title}", processes are executed from a queue with priority rules.

At each step, if a higher-priority process exists, move the current process to the back; otherwise execute it.
Return when the target process is executed.`
    case "stock-prices":
      return `In "${title}", each index is a timestamp and each value is the stock price at that time.

For each timestamp, compute how many seconds pass before the price becomes lower.`
    case "tower-signal":
      return `In "${title}", towers are arranged left to right and each tower sends a signal to the left.

Return the 1-based index of the first taller tower to the left that receives each signal, or 0 if none exists.`
    default:
      return "Solve the problem using an efficient algorithm."
  }
}

function buildGeneratedDescriptionKo(seed: Problem["id"], title: string): string {
  switch (seed) {
    case "two-sum":
      return `"${title}" 문제입니다. 정수 배열과 목표값 \`target\`이 주어집니다.

배열에서 서로 다른 두 수를 골라 합이 \`target\`이 되도록 하는 두 인덱스를 반환하세요.
정답은 정확히 하나이며, 인덱스 순서는 자유입니다.`
    case "valid-parentheses":
      return `"${title}" 문제입니다. 괄호 문자만으로 이루어진 문자열이 입력됩니다.

모든 열린 괄호가 올바른 종류의 닫는 괄호로 짝지어지고, 순서도 올바른지 \`true/false\`로 판별하세요.`
    case "reverse-linked-list":
      return `"${title}" 문제입니다. 단일 연결 리스트가 배열 형태(\`head\`)로 주어집니다.

연결 방향을 완전히 뒤집었다고 가정했을 때의 결과를 배열로 반환하세요.
예: \`head = [19,20,21,22]\` 이면 \`[22,21,20,19]\` 입니다.`
    case "maximum-subarray":
      return `"${title}" 문제입니다. 배열의 각 값은 해당 위치의 손익(또는 점수 변화)을 의미합니다.

비어 있지 않은 연속 부분배열 중 합이 최대가 되는 값(최대 부분합)을 구하세요.`
    case "merge-intervals":
      return `"${title}" 문제입니다. \`[start, end]\` 형태의 구간 목록이 주어집니다.

겹치는 구간을 모두 합쳐, 겹치지 않는 구간들만 남도록 병합 결과를 반환하세요.`
    case "longest-substring":
      return `"${title}" 문제입니다. 문자열 \`s\`가 주어집니다.

중복 문자가 하나도 없는 연속 부분 문자열 중, 가능한 최대 길이를 구하세요.`
    case "binary-tree-level-order":
      return `"${title}" 문제입니다. 이진 트리가 레벨 순서 배열(없는 노드는 \`null\`)로 주어집니다.

루트부터 아래로 내려가며, 같은 깊이의 노드 값끼리 묶어 2차원 배열로 반환하세요.`
    case "trapping-rain-water":
      return `"${title}" 문제입니다. 각 칸의 막대 높이를 나타내는 배열이 주어집니다.

비가 온 뒤 막대 사이에 고일 수 있는 빗물의 총량을 계산해 반환하세요.`
    case "process-scheduler":
      return `"${title}" 문제입니다. 프로세스가 우선순위 규칙에 따라 큐에서 실행됩니다.

매 단계마다 현재 프로세스보다 우선순위가 높은 프로세스가 남아 있으면 뒤로 보내고, 그렇지 않으면 실행합니다.
target 위치의 프로세스가 몇 번째로 실행되는지 반환하세요.`
    case "stock-prices":
      return `"${title}" 문제입니다. 배열의 각 원소는 해당 초의 주식 가격을 의미합니다.

각 시점마다 가격이 처음으로 하락하기 전까지 몇 초가 유지되는지 배열로 반환하세요.`
    case "tower-signal":
      return `"${title}" 문제입니다. 탑이 왼쪽에서 오른쪽으로 배치되어 있고, 각 탑은 왼쪽으로 신호를 보냅니다.

각 탑마다 왼쪽에서 처음 만나는 더 높은 탑의 1-based 인덱스를 반환하고, 없으면 0을 반환하세요.`
    default:
      return "효율적인 알고리즘으로 문제를 해결하세요."
  }
}

function buildGeneratedConstraints(seed: Problem["id"]): string[] {
  switch (seed) {
    case "two-sum":
      return [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Exactly one valid pair exists.",
      ]
    case "valid-parentheses":
      return [
        "1 <= s.length <= 10^4",
        "s contains only ()[]{} characters.",
      ]
    case "reverse-linked-list":
      return [
        "0 <= head.length <= 5000",
        "-5000 <= head[i] <= 5000",
      ]
    case "maximum-subarray":
      return [
        "1 <= nums.length <= 10^5",
        "-10^4 <= nums[i] <= 10^4",
      ]
    case "merge-intervals":
      return [
        "1 <= intervals.length <= 10^4",
        "intervals[i].length == 2",
        "0 <= start <= end <= 10^5",
      ]
    case "longest-substring":
      return [
        "0 <= s.length <= 5 * 10^4",
        "s may contain letters, digits, symbols, and spaces.",
      ]
    case "binary-tree-level-order":
      return [
        "0 <= number of nodes <= 2000",
        "-1000 <= Node.val <= 1000",
      ]
    case "trapping-rain-water":
      return [
        "1 <= height.length <= 2 * 10^4",
        "0 <= height[i] <= 10^5",
      ]
    case "process-scheduler":
      return [
        "1 <= priorities.length <= 100",
        "1 <= priorities[i] <= 9",
        "0 <= location < priorities.length",
      ]
    case "stock-prices":
      return [
        "1 <= prices.length <= 10^5",
        "1 <= prices[i] <= 10^4",
      ]
    case "tower-signal":
      return [
        "1 <= heights.length <= 10^5",
        "1 <= heights[i] <= 10^8",
      ]
    default:
      return []
  }
}

function buildGeneratedConstraintsKo(seed: Problem["id"]): string[] {
  switch (seed) {
    case "two-sum":
      return [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "정답이 되는 인덱스 쌍은 정확히 하나입니다.",
      ]
    case "valid-parentheses":
      return [
        "1 <= s.length <= 10^4",
        "s는 ()[]{} 문자로만 구성됩니다.",
      ]
    case "reverse-linked-list":
      return [
        "0 <= head.length <= 5000",
        "-5000 <= head[i] <= 5000",
      ]
    case "maximum-subarray":
      return [
        "1 <= nums.length <= 10^5",
        "-10^4 <= nums[i] <= 10^4",
      ]
    case "merge-intervals":
      return [
        "1 <= intervals.length <= 10^4",
        "intervals[i].length == 2",
        "0 <= start <= end <= 10^5",
      ]
    case "longest-substring":
      return [
        "0 <= s.length <= 5 * 10^4",
        "s는 영문자, 숫자, 기호, 공백을 포함할 수 있습니다.",
      ]
    case "binary-tree-level-order":
      return [
        "노드 수는 0 이상 2000 이하입니다.",
        "-1000 <= Node.val <= 1000",
      ]
    case "trapping-rain-water":
      return [
        "1 <= height.length <= 2 * 10^4",
        "0 <= height[i] <= 10^5",
      ]
    case "process-scheduler":
      return [
        "1 <= priorities.length <= 100",
        "1 <= priorities[i] <= 9",
        "0 <= location < priorities.length",
      ]
    case "stock-prices":
      return [
        "1 <= prices.length <= 10^5",
        "1 <= prices[i] <= 10^4",
      ]
    case "tower-signal":
      return [
        "1 <= heights.length <= 10^5",
        "1 <= heights[i] <= 10^8",
      ]
    default:
      return []
  }
}

function buildExamplesForSeed(seed: Problem["id"], testCases: TestCase[]): Problem["examples"] {
  // Example explanation rule:
  // Always explain "why this output is correct for this input" in one concrete sentence.
  const buildExplanationEn = (testCase: TestCase): string => {
    if (seed === "two-sum") {
      const nums = Array.isArray(testCase.input[0]) ? (testCase.input[0] as number[]) : []
      const target = testCase.input[1]
      const pair = Array.isArray(testCase.expected) ? (testCase.expected as number[]) : []
      const [i, j] = pair
      if (
        typeof i === "number" &&
        typeof j === "number" &&
        typeof nums[i] === "number" &&
        typeof nums[j] === "number"
      ) {
        return `Indices [${i},${j}] are correct because nums[${i}] + nums[${j}] = ${nums[i]} + ${nums[j]} = ${target}.`
      }
      return "The returned two indices point to values whose sum equals target."
    }
    if (seed === "valid-parentheses") {
      return testCase.expected === true
        ? "Each opening bracket is closed by the correct type in the correct order, so the result is true."
        : "A bracket type or closing order mismatch occurs, so the result is false."
    }
    if (seed === "reverse-linked-list") {
      return `reversing the node direction makes the values appear in reverse order, so the output is ${JSON.stringify(testCase.expected)}.`
    }
    if (seed === "maximum-subarray") {
      const nums = Array.isArray(testCase.input[0]) ? (testCase.input[0] as number[]) : []
      let bestSum = -Infinity
      let bestStart = 0
      let bestEnd = 0
      let currentSum = 0
      let currentStart = 0
      for (let i = 0; i < nums.length; i += 1) {
        if (currentSum <= 0) {
          currentSum = nums[i]
          currentStart = i
        } else {
          currentSum += nums[i]
        }
        if (currentSum > bestSum) {
          bestSum = currentSum
          bestStart = currentStart
          bestEnd = i
        }
      }
      const bestSlice = nums.slice(bestStart, bestEnd + 1)
      return `the contiguous subarray ${JSON.stringify(bestSlice)} gives the maximum sum ${JSON.stringify(testCase.expected)}.`
    }
    if (seed === "merge-intervals") {
      return `overlapping ranges are combined, which produces the merged result ${JSON.stringify(testCase.expected)}.`
    }
    if (seed === "longest-substring") {
      const s = typeof testCase.input[0] === "string" ? testCase.input[0] : ""
      const seen = new Map<string, number>()
      let left = 0
      let bestStart = 0
      let bestLen = 0
      for (let right = 0; right < s.length; right += 1) {
        const ch = s[right]
        const last = seen.get(ch)
        if (last !== undefined && last >= left) {
          left = last + 1
        }
        seen.set(ch, right)
        const len = right - left + 1
        if (len > bestLen) {
          bestLen = len
          bestStart = left
        }
      }
      const example = s.slice(bestStart, bestStart + bestLen)
      return `a longest substring without duplicate characters is ${JSON.stringify(example)}, so the length is ${JSON.stringify(testCase.expected)}.`
    }
    if (seed === "binary-tree-level-order") {
      return `nodes are grouped by depth from top to bottom, yielding ${JSON.stringify(testCase.expected)}.`
    }
    if (seed === "process-scheduler") {
      return `processes are executed by priority rotation, and the target process completes at order ${JSON.stringify(testCase.expected)}.`
    }
    if (seed === "stock-prices") {
      return `for each timestamp, count seconds until the first lower price appears, which gives ${JSON.stringify(testCase.expected)}.`
    }
    if (seed === "tower-signal") {
      return `each tower is received by the first taller tower to its left, so the result is ${JSON.stringify(testCase.expected)}.`
    }
    return `summing trapped water over each position gives ${JSON.stringify(testCase.expected)}.`
  }

  return testCases.slice(0, 2).map((testCase) => {
    if (seed === "two-sum") {
      const inputText = `nums = ${JSON.stringify(testCase.input[0])}, target = ${JSON.stringify(testCase.input[1])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "valid-parentheses") {
      const inputText = `s = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "reverse-linked-list") {
      const inputText = `head = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "maximum-subarray") {
      const inputText = `nums = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "merge-intervals") {
      const inputText = `intervals = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "longest-substring") {
      const inputText = `s = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "binary-tree-level-order") {
      const inputText = `root = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "process-scheduler") {
      const inputText = `priorities = ${JSON.stringify(testCase.input[0])}, location = ${JSON.stringify(testCase.input[1])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "stock-prices") {
      const inputText = `prices = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    if (seed === "tower-signal") {
      const inputText = `heights = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
      }
    }
    const inputText = `height = ${JSON.stringify(testCase.input[0])}`
    const outputText = JSON.stringify(testCase.expected)
    return {
      input: inputText,
      output: outputText,
      explanation: `For input ${inputText}, ${buildExplanationEn(testCase)} Therefore, return ${outputText}.`,
    }
  })
}

function buildExamplesForSeedKo(seed: Problem["id"], testCases: TestCase[]): Problem["examples"] {
  // 예시 설명 규칙:
  // 항상 "이 입력에서 왜 이 출력이 되는지"를 한 문장으로 설명합니다.
  const buildExplanationKo = (testCase: TestCase): string => {
    if (seed === "two-sum") {
      const nums = Array.isArray(testCase.input[0]) ? (testCase.input[0] as number[]) : []
      const target = testCase.input[1]
      const pair = Array.isArray(testCase.expected) ? (testCase.expected as number[]) : []
      const [i, j] = pair
      if (
        typeof i === "number" &&
        typeof j === "number" &&
        typeof nums[i] === "number" &&
        typeof nums[j] === "number"
      ) {
        return `인덱스 [${i},${j}]를 고르면 nums[${i}] + nums[${j}] = ${nums[i]} + ${nums[j]} = ${target} 이므로 정답입니다.`
      }
      return "반환된 두 인덱스가 가리키는 값의 합이 target과 같습니다."
    }
    if (seed === "valid-parentheses") {
      return testCase.expected === true
        ? "모든 열린 괄호가 올바른 종류의 닫는 괄호와 순서로 짝지어지므로 결과는 true입니다."
        : "괄호 종류가 맞지 않거나 닫히는 순서가 잘못된 구간이 있어 결과는 false입니다."
    }
    if (seed === "reverse-linked-list") {
      return `노드 연결 방향을 뒤집으면 값의 순서가 반대로 바뀝니다.`
    }
    if (seed === "maximum-subarray") {
      const nums = Array.isArray(testCase.input[0]) ? (testCase.input[0] as number[]) : []
      let bestSum = -Infinity
      let bestStart = 0
      let bestEnd = 0
      let currentSum = 0
      let currentStart = 0
      for (let i = 0; i < nums.length; i += 1) {
        if (currentSum <= 0) {
          currentSum = nums[i]
          currentStart = i
        } else {
          currentSum += nums[i]
        }
        if (currentSum > bestSum) {
          bestSum = currentSum
          bestStart = currentStart
          bestEnd = i
        }
      }
      const bestSlice = nums.slice(bestStart, bestEnd + 1)
      return `연속 부분배열 ${JSON.stringify(bestSlice)} 의 합이 최대입니다.`
    }
    if (seed === "merge-intervals") {
      return "서로 겹치는 구간들을 하나로 합칠 수 있습니다."
    }
    if (seed === "longest-substring") {
      const s = typeof testCase.input[0] === "string" ? testCase.input[0] : ""
      const seen = new Map<string, number>()
      let left = 0
      let bestStart = 0
      let bestLen = 0
      for (let right = 0; right < s.length; right += 1) {
        const ch = s[right]
        const last = seen.get(ch)
        if (last !== undefined && last >= left) {
          left = last + 1
        }
        seen.set(ch, right)
        const len = right - left + 1
        if (len > bestLen) {
          bestLen = len
          bestStart = left
        }
      }
      const example = s.slice(bestStart, bestStart + bestLen)
      return `중복이 없는 최장 부분 문자열의 한 예는 ${JSON.stringify(example)} 입니다.`
    }
    if (seed === "binary-tree-level-order") {
      return "노드를 깊이(레벨)별로 묶어 순서대로 나열할 수 있습니다."
    }
    if (seed === "process-scheduler") {
      return `우선순위 규칙으로 큐를 회전시키며 실행할 때, 대상 프로세스의 실행 순번을 계산할 수 있습니다.`
    }
    if (seed === "stock-prices") {
      return `각 시점에서 처음 가격이 하락하는 시점까지의 초를 계산할 수 있습니다.`
    }
    if (seed === "tower-signal") {
      return `각 탑은 왼쪽에서 처음 만나는 더 높은 탑이 신호를 수신합니다.`
    }
    return "각 위치에 고이는 물의 양을 모두 합산할 수 있습니다."
  }

  return testCases.slice(0, 2).map((testCase) => {
    if (seed === "two-sum") {
      const inputText = `nums = ${JSON.stringify(testCase.input[0])}, target = ${JSON.stringify(testCase.input[1])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "valid-parentheses") {
      const inputText = `s = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "reverse-linked-list") {
      const inputText = `head = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "maximum-subarray") {
      const inputText = `nums = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "merge-intervals") {
      const inputText = `intervals = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "longest-substring") {
      const inputText = `s = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "binary-tree-level-order") {
      const inputText = `root = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "process-scheduler") {
      const inputText = `priorities = ${JSON.stringify(testCase.input[0])}, location = ${JSON.stringify(testCase.input[1])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "stock-prices") {
      const inputText = `prices = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    if (seed === "tower-signal") {
      const inputText = `heights = ${JSON.stringify(testCase.input[0])}`
      const outputText = JSON.stringify(testCase.expected)
      return {
        input: inputText,
        output: outputText,
        explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
      }
    }
    const inputText = `height = ${JSON.stringify(testCase.input[0])}`
    const outputText = JSON.stringify(testCase.expected)
    return {
      input: inputText,
      output: outputText,
      explanation: `입력 ${inputText} 에서 ${buildExplanationKo(testCase)} 따라서 결과는 ${outputText} 입니다.`,
    }
  })
}

function buildGeneratedTitleByIndex(seedId: Problem["id"], index: number): string {
  const pool = generatedTitlePool[seedId]
  const base = pool[index % pool.length]
  if (index < pool.length) {
    return base
  }
  const suffixPool = generatedTitleSuffixPool[seedId]
  const suffix = suffixPool[(index - pool.length) % suffixPool.length]
  return `${base}: ${suffix}`
}

function buildGeneratedTitleByIndexKo(seedId: Problem["id"], index: number): string {
  const pool = generatedTitlePoolKo[seedId]
  const base = pool[index % pool.length]
  if (index < pool.length) {
    return base
  }
  const suffixPool = generatedTitleSuffixPoolKo[seedId]
  const suffix = suffixPool[(index - pool.length) % suffixPool.length]
  return `${base} (${suffix})`
}

function buildGeneratedDifficulty(seedId: Problem["id"], index: number, fallback: Difficulty): Difficulty {
  const difficultyCycles: Record<Problem["id"], Difficulty[]> = {
    "two-sum": ["Easy", "Medium", "Easy", "Hard", "Medium"],
    "valid-parentheses": ["Easy", "Medium", "Hard", "Easy", "Medium"],
    "reverse-linked-list": ["Easy", "Medium", "Easy", "Hard", "Medium"],
    "maximum-subarray": ["Medium", "Hard", "Medium", "Easy", "Hard"],
    "merge-intervals": ["Medium", "Hard", "Easy", "Medium", "Hard"],
    "longest-substring": ["Medium", "Hard", "Easy", "Medium", "Hard"],
    "binary-tree-level-order": ["Medium", "Hard", "Medium", "Easy", "Hard"],
    "trapping-rain-water": ["Medium", "Hard", "Easy", "Medium", "Hard"],
    "process-scheduler": ["Medium", "Hard", "Easy", "Medium", "Hard"],
  }
  const cycle = difficultyCycles[seedId]
  if (!cycle || cycle.length === 0) {
    return fallback
  }
  return cycle[index % cycle.length]
}

function createGeneratedProblem(seed: Problem, index: number): Problem {
  const generatedTitle = buildGeneratedTitleByIndex(seed.id, index)
  const generatedId = `${toKebabCase(generatedTitle)}-${index + 2}`
  const generatedFunctionName = `${seed.functionName}Set${index + 2}`
  const functionNameRegex = new RegExp(`\\b${escapeRegExp(seed.functionName)}\\b`)
  const testCases = buildTestCases(seed.id, index)
  const generatedDifficulty = buildGeneratedDifficulty(seed.id, index, seed.difficulty)

  return {
    ...seed,
    id: generatedId,
    title: generatedTitle,
    difficulty: generatedDifficulty,
    description: buildGeneratedDescription(seed.id, generatedTitle),
    constraints: buildGeneratedConstraints(seed.id),
    starterCode: seed.starterCode.replace(functionNameRegex, generatedFunctionName),
    functionName: generatedFunctionName,
    testCases,
    examples: buildExamplesForSeed(seed.id, testCases),
  }
}

function getGeneratedSeedId(problem: Problem): Problem["id"] | null {
  for (const seed of baseProblems) {
    if (problem.functionName.startsWith(`${seed.functionName}Set`)) {
      return seed.id
    }
  }
  return null
}

function getGeneratedIndex(problem: Problem): number {
  const match = problem.functionName.match(/Set(\d+)$/)
  if (!match) {
    return 0
  }
  const index = Number(match[1]) - 2
  return Number.isNaN(index) || index < 0 ? 0 : index
}

function buildAutoKoreanText(problem: Problem): ProblemTextBundle | null {
  const seedId = getGeneratedSeedId(problem)
  if (!seedId) {
    return null
  }
  const index = getGeneratedIndex(problem)
  const title = buildGeneratedTitleByIndexKo(seedId, index)
  return {
    title,
    category: localizeCategory(problem.category, "ko"),
    description: buildGeneratedDescriptionKo(seedId, title),
    examples: buildExamplesForSeedKo(seedId, problem.testCases),
    constraints: buildGeneratedConstraintsKo(seedId),
  }
}

export const problems: Problem[] = (() => {
  const grouped = baseProblems.map((seed) => {
    const count = BASE_PROBLEMS_PER_CATEGORY - 1 + ADDITIONAL_PROBLEMS_PER_CATEGORY[seed.id]
    const list: Problem[] = [seed]
    for (let i = 0; i < count; i += 1) {
      list.push(createGeneratedProblem(seed, i))
    }
    return list
  })

  // Deterministic interleave to avoid category blocks on the home feed.
  const mixed: Problem[] = []
  let cursor = 0
  while (mixed.length < grouped.reduce((sum, list) => sum + list.length, 0)) {
    for (let i = 0; i < grouped.length; i += 1) {
      const shifted = (i + cursor) % grouped.length
      if (cursor < grouped[shifted].length) {
        mixed.push(grouped[shifted][cursor])
      }
    }
    cursor += 1
  }

  return mixed
})()

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id)
}

const problemTranslations: Partial<Record<Problem["id"], Partial<Record<ProblemLanguage, ProblemTextBundle>>>> = {
  "two-sum": {
    ko: {
      title: "두 수의 합",
      category: "해시",
      description: `정수 배열 nums와 정수 target이 주어질 때, 두 수의 합이 target이 되는 인덱스를 반환하세요.

각 입력에는 정확히 하나의 정답이 있으며, 같은 원소를 두 번 사용할 수 없습니다.

정답의 순서는 상관없습니다.`,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "nums[0] + nums[1] == 9 이므로 [0, 1]을 반환합니다.",
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]",
          explanation: "nums[1] + nums[2] == 6 이므로 [1, 2]를 반환합니다.",
        },
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "정답은 하나만 존재합니다.",
      ],
    },
  },
  "valid-parentheses": {
    ko: {
      title: "올바른 괄호",
      category: "스택",
      description: `문자열 \`s\`가 \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\`, \`']'\` 문자로만 이루어질 때, 문자열이 올바른지 판단하세요.

문자열이 올바르려면:

1. 열린 괄호는 같은 종류의 닫힌 괄호로 닫혀야 합니다.
2. 괄호는 올바른 순서로 닫혀야 합니다.
3. 모든 닫힌 괄호는 대응되는 열린 괄호가 있어야 합니다.`,
      examples: [
        {
          input: 's = "()"',
          output: "true",
          explanation: "열린 괄호 '('가 올바른 닫는 괄호 ')'로 닫혀 true입니다.",
        },
        {
          input: 's = "()[]{}"',
          output: "true",
          explanation: "모든 괄호 쌍이 종류와 순서 모두 올바르므로 true입니다.",
        },
        {
          input: 's = "(]"',
          output: "false",
          explanation: "'(' 다음에 ']'가 닫히므로 괄호 종류가 맞지 않아 false입니다.",
        },
      ],
      constraints: [
        "1 <= s.length <= 10^4",
        "s는 괄호 문자 '()[]{}'로만 구성됩니다.",
      ],
    },
  },
  "reverse-linked-list": {
    ko: {
      title: "연결 리스트 뒤집기",
      category: "연결 리스트",
      description: `단일 연결 리스트의 \`head\`가 주어질 때, 리스트를 뒤집어 반환하세요.

반복문(Iterative) 방식으로 구현하세요.`,
      examples: [
        {
          input: "head = [1,2,3,4,5]",
          output: "[5,4,3,2,1]",
          explanation: "연결 방향을 뒤집으면 노드 순서가 역순이 되어 [5,4,3,2,1]이 됩니다.",
        },
        {
          input: "head = [1,2]",
          output: "[2,1]",
          explanation: "2 -> 1 형태로 반전되므로 배열 표현은 [2,1]입니다.",
        },
      ],
      constraints: [
        "노드 수 범위는 [0, 5000]입니다.",
        "-5000 <= Node.val <= 5000",
      ],
    },
  },
  "maximum-subarray": {
    ko: {
      title: "최대 부분 배열",
      category: "동적 계획법",
      description: `정수 배열 \`nums\`가 주어질 때, 합이 가장 큰 부분 배열의 합을 반환하세요.

**부분 배열(subarray)** 은 배열 내의 연속된 비어있지 않은 원소 시퀀스입니다.`,
      examples: [
        {
          input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
          output: "6",
          explanation: "부분 배열 [4,-1,2,1]의 합이 최대이며 6입니다.",
        },
        {
          input: "nums = [1]",
          output: "1",
          explanation: "부분 배열 [1]의 합이 1입니다.",
        },
      ],
      constraints: [
        "1 <= nums.length <= 10^5",
        "-10^4 <= nums[i] <= 10^4",
      ],
    },
  },
  "merge-intervals": {
    ko: {
      title: "구간 병합",
      category: "배열",
      description: `\`intervals[i] = [start_i, end_i]\` 형태의 배열이 주어질 때, 겹치는 구간을 모두 병합하여 겹치지 않는 구간 배열을 반환하세요.`,
      examples: [
        {
          input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
          output: "[[1,6],[8,10],[15,18]]",
          explanation: "[1,3]과 [2,6]이 겹치므로 [1,6]으로 병합합니다.",
        },
        {
          input: "intervals = [[1,4],[4,5]]",
          output: "[[1,5]]",
          explanation: "[1,4]와 [4,5]는 겹치는 것으로 간주합니다.",
        },
      ],
      constraints: [
        "1 <= intervals.length <= 10^4",
        "intervals[i].length == 2",
        "0 <= start_i <= end_i <= 10^4",
      ],
    },
  },
  "longest-substring": {
    ko: {
      title: "중복 없는 가장 긴 부분 문자열",
      category: "슬라이딩 윈도우",
      description: `문자열 \`s\`가 주어질 때, 중복 문자가 없는 **가장 긴 부분 문자열**의 길이를 구하세요.`,
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: '정답은 "abc"이며 길이는 3입니다.',
        },
        {
          input: 's = "bbbbb"',
          output: "1",
          explanation: '정답은 "b"이며 길이는 1입니다.',
        },
      ],
      constraints: [
        "0 <= s.length <= 5 * 10^4",
        "s는 영문자, 숫자, 기호, 공백으로 구성됩니다.",
      ],
    },
  },
  "binary-tree-level-order": {
    ko: {
      title: "이진 트리 레벨 순회",
      category: "트리",
      description: `이진 트리의 \`root\`가 주어질 때, 노드 값을 레벨 순서(왼쪽에서 오른쪽, 위에서 아래)로 반환하세요.`,
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "[[3],[9,20],[15,7]]",
          explanation: "깊이별로 묶으면 0레벨 [3], 1레벨 [9,20], 2레벨 [15,7]입니다.",
        },
        {
          input: "root = [1]",
          output: "[[1]]",
          explanation: "루트 노드 하나만 있으므로 레벨 순회 결과는 [[1]]입니다.",
        },
      ],
      constraints: [
        "트리의 노드 수 범위는 [0, 2000]입니다.",
        "-1000 <= Node.val <= 1000",
      ],
    },
  },
  "trapping-rain-water": {
    ko: {
      title: "빗물 트래핑",
      category: "투 포인터",
      description: `너비가 1인 막대의 높이를 나타내는 \`n\`개의 음이 아닌 정수 배열이 주어질 때, 비가 온 뒤 고일 수 있는 물의 양을 구하세요.`,
      examples: [
        {
          input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
          output: "6",
          explanation: "해당 지형에서는 총 6만큼의 빗물이 고입니다.",
        },
        {
          input: "height = [4,2,0,3,2,5]",
          output: "9",
          explanation: "각 칸에 고이는 물의 양을 합치면 총 9입니다.",
        },
      ],
      constraints: [
        "n == height.length",
        "1 <= n <= 2 * 10^4",
        "0 <= height[i] <= 10^5",
      ],
    },
  },
  "stock-prices": {
    ko: {
      title: "주식 가격",
      category: "스택",
      description: `배열 \`prices\`가 주어질 때, \`prices[i]\`는 i초 시점의 주식 가격을 의미합니다.

각 시점마다 가격이 처음으로 떨어지기 전까지 몇 초 동안 유지되는지 배열로 반환하세요.
끝까지 떨어지지 않으면 마지막 시점까지의 시간을 계산합니다.`,
      examples: [
        {
          input: "prices = [1,2,3,2,3]",
          output: "[4,3,1,1,0]",
          explanation: "3초 시점의 가격 3은 다음 시점에 2로 하락하므로 유지 시간은 1초입니다.",
        },
        {
          input: "prices = [5,4,3,2,1]",
          output: "[1,1,1,1,0]",
          explanation: "마지막 원소를 제외한 모든 시점에서 다음 초에 바로 가격이 하락합니다.",
        },
      ],
      constraints: [
        "1 <= prices.length <= 100000",
        "1 <= prices[i] <= 10000",
      ],
    },
  },
  "tower-signal": {
    ko: {
      title: "신호 수신 (탑)",
      category: "스택",
      description: `탑들이 왼쪽에서 오른쪽으로 일렬로 배치되어 있습니다. 각 탑은 왼쪽으로 신호를 발사합니다.

각 탑에 대해 왼쪽에서 처음 만나는 더 높은 탑(엄격히 큼)의 1-based 인덱스를 반환하세요.
수신 탑이 없으면 0을 반환합니다.`,
      examples: [
        {
          input: "heights = [6,9,5,7,4]",
          output: "[0,0,2,2,4]",
          explanation: "4번 탑(7)은 3번 탑(5)을 지나 2번 탑(9)에서 신호가 수신됩니다.",
        },
        {
          input: "heights = [4,3,2,1]",
          output: "[0,1,2,3]",
          explanation: "첫 탑을 제외하고는 바로 왼쪽 탑이 항상 더 높아 신호를 수신합니다.",
        },
      ],
      constraints: [
        "1 <= heights.length <= 100000",
        "1 <= heights[i] <= 100000000",
      ],
    },
  },
  "process-scheduler": {
    ko: {
      title: "프로세스 스케줄러",
      category: "큐",
      description: `운영체제가 프로세스를 다음 규칙으로 실행합니다.

1) 큐의 앞에서 프로세스를 꺼냅니다.
2) 큐 안에 더 높은 우선순위가 하나라도 있으면, 꺼낸 프로세스를 큐 뒤로 보냅니다.
3) 그렇지 않으면 해당 프로세스를 실행하고 종료합니다.

\`priorities\`와 \`location\`이 주어질 때, \`location\`의 프로세스가 몇 번째로 실행되는지 반환하세요.`,
      examples: [
        {
          input: "priorities = [2,1,3,2], location = 2",
          output: "1",
          explanation: "인덱스 2의 우선순위 3이 가장 높으므로 첫 번째로 실행됩니다.",
        },
        {
          input: "priorities = [1,1,9,1,1,1], location = 0",
          output: "5",
          explanation: "우선순위 9가 먼저 실행된 뒤, 인덱스 0 프로세스는 다섯 번째에 실행됩니다.",
        },
      ],
      constraints: [
        "1 <= priorities.length <= 100",
        "1 <= priorities[i] <= 9",
        "0 <= location < priorities.length",
      ],
    },
  },
}

const localizedCategories: Record<string, Partial<Record<ProblemLanguage, string>>> = {
  Hash: { ko: "해시" },
  Stack: { ko: "스택" },
  "Linked List": { ko: "연결 리스트" },
  "Dynamic Programming": { ko: "동적 계획법" },
  Arrays: { ko: "배열" },
  "Sliding Window": { ko: "슬라이딩 윈도우" },
  Trees: { ko: "트리" },
  "Two Pointers": { ko: "투 포인터" },
  Queue: { ko: "큐" },
}

export function localizeCategory(category: string, language: ProblemLanguage): string {
  if (language === "en") {
    return category
  }
  return localizedCategories[category]?.[language] ?? category
}

export function getAvailableProblemLanguages(problem: Problem): ProblemLanguage[] {
  const available: ProblemLanguage[] = ["en"]
  if (problemTranslations[problem.id]?.ko || buildAutoKoreanText(problem)) {
    available.push("ko")
  }
  return available
}

export function getLocalizedProblemText(problem: Problem, language: ProblemLanguage): {
  text: ProblemTextBundle
  isFallback: boolean
  availableLanguages: ProblemLanguage[]
} {
  const availableLanguages = getAvailableProblemLanguages(problem)
  const base: ProblemTextBundle = {
    title: problem.title,
    category: problem.category,
    description: problem.description,
    examples: problem.examples,
    constraints: problem.constraints,
  }

  if (language === "en") {
    return { text: base, isFallback: false, availableLanguages }
  }

  const translated = problemTranslations[problem.id]?.[language]
  if (translated) {
    return { text: translated, isFallback: false, availableLanguages }
  }

  if (language === "ko") {
    const autoTranslated = buildAutoKoreanText(problem)
    if (autoTranslated) {
      return { text: autoTranslated, isFallback: false, availableLanguages }
    }
  }

  return { text: base, isFallback: true, availableLanguages }
}
