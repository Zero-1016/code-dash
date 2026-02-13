# Problem Authoring: Modular Rules and Skills

This guide is written for agents.  
Do not run all skills by default. Select only the module needed for the current step.

## Core Schema (Always Enforced)

Every authored problem must satisfy the `Problem` type in `lib/problems.ts`.

Required fields:
- `id`
- `title`
- `category`
- `categoryIcon`
- `difficulty`
- `successRate`
- `description`
- `examples`
- `constraints`
- `starterCode`
- `testCases`
- `functionName`

Hard requirements:
1. `id` must be unique and URL-safe.
2. `functionName` must match the function declared in `starterCode`.
3. `testCases[].input` must follow the exact function argument order.
4. `examples` must be consistent with `testCases`.
5. `expected` values must be JSON-serializable and deterministic.

## Skill Modules (Call Only When Needed)

### Module 1: Problem Modeling
Use when:
- A new problem idea needs to become a formal function contract.

Inputs:
- Natural language prompt
- Intended pattern/topic

Outputs:
- Final function signature
- Unambiguous acceptance criteria
- Draft `description` and `constraints`

Done when:
- Ambiguous words are removed ("maybe", "usually", "if needed").
- Edge behavior is explicit (empty input, duplicates, order, overflow rules).

### Module 2: Test Case Design
Use when:
- `testCases` do not exist yet or are weak.

Inputs:
- Function contract
- Constraints

Outputs:
- `testCases` list with at least:
  - 1 happy path case
  - 1 boundary case
  - 1 trap case (common wrong approach breaker)

Done when:
- Each test has a clear purpose.
- Cases collectively block common incorrect implementations.

### Module 3: Difficulty Calibration
Use when:
- Difficulty (`Easy`/`Medium`/`Hard`) or `successRate` is uncertain.

Inputs:
- Constraints
- Expected optimal time/space complexity
- Test trap severity

Outputs:
- Final `difficulty`
- Initial `successRate` estimate

Done when:
- Difficulty and constraints are aligned.
- `successRate` is plausible for the selected difficulty.

### Module 4: Example Crafting
Use when:
- Problem explanation is hard to understand quickly.

Inputs:
- Final function contract
- Key test cases

Outputs:
- 2-3 examples with `input`, `output`, optional short `explanation`

Done when:
- A first-time reader can infer the core rule from examples alone.
- Example values are not contradictory to constraints.

### Module 5: Localization (EN/KO)
Use when:
- Korean support is required.

Inputs:
- Final English problem text

Outputs:
- `problemTranslations` entry for `ko`

Done when:
- EN and KO semantics are identical.
- Technical terms are consistent and non-contradictory.

## Product-Aware Rules (Current CodeDash Behavior)

1. In the editor test panel, users see each test card values directly.
2. Test data should help learning, but should not directly reveal full implementation logic.
3. Keep test data JSON-friendly for custom test UX compatibility.

## Decision Flow (Minimal Invocation)

1. Start with Module 1 only.
2. If tests are missing/weak, call Module 2.
3. If difficulty is unclear, call Module 3.
4. If readability is weak, call Module 4.
5. If KO is required, call Module 5.

Stop after the smallest sufficient set of modules is complete.

## Final Checklist

- [ ] Type contract matches `Problem` schema
- [ ] `functionName` matches `starterCode`
- [ ] `examples` and `testCases` are consistent
- [ ] Boundary behavior is explicit
- [ ] Difficulty and `successRate` are coherent
- [ ] EN/KO are semantically aligned (if KO exists)
