# CodeDash

**CodeDash** is a coding interview practice platform focused on consistent problem-solving habits.
It combines a clean coding workspace, progress tracking, and AI mentor features to support iterative learning.

---

## 한국어 소개

CodeDash는 코딩 테스트 학습을 더 꾸준하고 실전적으로 만들기 위한 웹 플랫폼입니다.

- 문제 풀이 + 실행/제출 + 결과 확인을 한 화면에서 진행
- AI 멘토와 힌트/리뷰/전략 피드백 기반 학습
- 스트릭, 통계, 로컬 진척 저장으로 장기 학습 루틴 지원

정답만 맞히는 데서 끝나지 않고, 사고 과정과 개선 루프를 함께 훈련하는 것을 목표로 합니다.

## English Overview

CodeDash is a web app for coding challenge practice with a strong focus on learning loops.

- Solve, run, submit, and inspect feedback in one workspace
- Learn with AI mentor chat, strategic hints, and code review
- Build consistency through streaks, stats, and local progress storage

The goal is not only getting accepted answers, but improving how you reason and iterate.

---

## Key Features

- Challenge workspace with problem statement + code editor + test panel
- AI mentor chat (`/api/chat`)
- AI code review (`/api/review-code`)
- AI strategic hint after sustained solving (`/api/strategic-hint`)
- Local draft/progress persistence
- Language support: English and Korean

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + Radix UI
- Vercel AI SDK (OpenAI / Anthropic / Gemini providers)

---

## Getting Started

### 1) Install

```bash
pnpm install
```

### 2) Run dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3) Build for production

```bash
pnpm build
pnpm start
```

---

## AI Provider Setup

In **Settings**, configure:

- Provider (`claude`, `gpt`, `gemini`)
- Model name
- API key (stored in browser session storage)
- Max tokens

You can run connection tests before saving.

## Language Behavior

- Manual language selection in the UI is the highest priority.
- If no language is saved yet, CodeDash infers a default from visitor country headers and browser language.

---

## Project Structure (Simplified)

```text
app/                    # App Router pages and API routes
components/             # Reusable UI and feature components
lib/                    # Client/server utilities and configs
public/                 # Static assets
```

## Contributing

Issues and pull requests are welcome.
Please keep changes focused, verified, and documented.

## License

This project currently does not declare a separate license file.
