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
  successRate: number
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
    successRate: 72,
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
    successRate: 65,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
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
    successRate: 78,
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

Implement the solution iteratively.`,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
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
    successRate: 49,
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
    successRate: 45,
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
    successRate: 38,
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
    successRate: 32,
    description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
      {
        input: "root = [1]",
        output: "[[1]]",
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
    successRate: 28,
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
]

const TARGET_PROBLEMS_PER_CATEGORY = 20

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
    default:
      return "Solve the problem using an efficient algorithm."
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
    default:
      return []
  }
}

function buildExamplesForSeed(seed: Problem["id"], testCases: TestCase[]): Problem["examples"] {
  return testCases.slice(0, 2).map((testCase) => {
    if (seed === "two-sum") {
      return {
        input: `nums = ${JSON.stringify(testCase.input[0])}, target = ${JSON.stringify(testCase.input[1])}`,
        output: JSON.stringify(testCase.expected),
      }
    }
    if (seed === "valid-parentheses") {
      return {
        input: `s = ${JSON.stringify(testCase.input[0])}`,
        output: JSON.stringify(testCase.expected),
      }
    }
    if (seed === "reverse-linked-list") {
      return {
        input: `head = ${JSON.stringify(testCase.input[0])}`,
        output: JSON.stringify(testCase.expected),
      }
    }
    if (seed === "maximum-subarray") {
      return {
        input: `nums = ${JSON.stringify(testCase.input[0])}`,
        output: JSON.stringify(testCase.expected),
      }
    }
    if (seed === "merge-intervals") {
      return {
        input: `intervals = ${JSON.stringify(testCase.input[0])}`,
        output: JSON.stringify(testCase.expected),
      }
    }
    if (seed === "longest-substring") {
      return {
        input: `s = ${JSON.stringify(testCase.input[0])}`,
        output: JSON.stringify(testCase.expected),
      }
    }
    if (seed === "binary-tree-level-order") {
      return {
        input: `root = ${JSON.stringify(testCase.input[0])}`,
        output: JSON.stringify(testCase.expected),
      }
    }
    return {
      input: `height = ${JSON.stringify(testCase.input[0])}`,
      output: JSON.stringify(testCase.expected),
    }
  })
}

function createGeneratedProblem(seed: Problem, index: number): Problem {
  const generatedTitle = generatedTitlePool[seed.id][index % generatedTitlePool[seed.id].length]
  const generatedId = `${toKebabCase(generatedTitle)}-${index + 2}`
  const generatedFunctionName = `${seed.functionName}Set${index + 2}`
  const functionNameRegex = new RegExp(`\\b${escapeRegExp(seed.functionName)}\\b`)
  const testCases = buildTestCases(seed.id, index)

  return {
    ...seed,
    id: generatedId,
    title: generatedTitle,
    successRate: Math.max(20, seed.successRate - ((index * 3) % 20)),
    description: buildGeneratedDescription(seed.id, generatedTitle),
    constraints: buildGeneratedConstraints(seed.id),
    starterCode: seed.starterCode.replace(functionNameRegex, generatedFunctionName),
    functionName: generatedFunctionName,
    testCases,
    examples: buildExamplesForSeed(seed.id, testCases),
  }
}

export const problems: Problem[] = (() => {
  const expanded: Problem[] = [...baseProblems]
  for (const seed of baseProblems) {
    const sameCategoryCount = expanded.filter((problem) => problem.category === seed.category).length
    for (let i = sameCategoryCount; i < TARGET_PROBLEMS_PER_CATEGORY; i += 1) {
      expanded.push(createGeneratedProblem(seed, i - 1))
    }
  }
  return expanded
})()

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id)
}

const problemTranslations: Partial<Record<Problem["id"], Partial<Record<ProblemLanguage, ProblemTextBundle>>>> = {
  "two-sum": {
    ko: {
      title: "두 수의 합",
      category: "해시",
      description: `정수 배열 \`nums\`와 정수 \`target\`이 주어질 때, 두 수의 합이 \`target\`이 되는 인덱스를 반환하세요.

각 입력에는 **정확히 하나의 정답**이 있으며, 같은 원소를 두 번 사용할 수 없습니다.

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
        { input: 's = "()"', output: "true" },
        { input: 's = "()[]{}"', output: "true" },
        { input: 's = "(]"', output: "false" },
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
        { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
        { input: "head = [1,2]", output: "[2,1]" },
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
        { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
        { input: "root = [1]", output: "[[1]]" },
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
        { input: "height = [4,2,0,3,2,5]", output: "9" },
      ],
      constraints: [
        "n == height.length",
        "1 <= n <= 2 * 10^4",
        "0 <= height[i] <= 10^5",
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
}

export function localizeCategory(category: string, language: ProblemLanguage): string {
  if (language === "en") {
    return category
  }
  return localizedCategories[category]?.[language] ?? category
}

export function getAvailableProblemLanguages(problem: Problem): ProblemLanguage[] {
  const available: ProblemLanguage[] = ["en"]
  if (problemTranslations[problem.id]?.ko) {
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

  return { text: base, isFallback: true, availableLanguages }
}
