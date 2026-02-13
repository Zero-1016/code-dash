# CodeDash

[English](#english) | [한국어](#korean)

---

<a name="english"></a>
## English

### Overview

**CodeDash** is an AI-powered algorithm learning platform that makes coding practice accessible to everyone. Instead of expensive subscription-based platforms, CodeDash leverages modern AI models (Claude, GPT, Gemini, etc.) to provide intelligent code analysis and feedback.

### Features

- **Interactive Code Editor**: Built-in Monaco Editor with JavaScript support
- **Algorithm Challenges**: Curated collection of problems covering various data structures and algorithms
- **Real-time Code Execution**: Test your solutions instantly with predefined test cases
- **AI Assistant Chat**: Get help while coding with an interactive AI mentor
  - Ask for hints without spoiling the solution
  - Get code review and suggestions
  - Explain concepts and algorithms
  - Debug errors and issues
- **AI-Powered Analysis**: Get detailed feedback on submission:
  - Correctness (based on test results)
  - Time Complexity (Big O notation)
  - Code Readability
  - Optimization Suggestions
- **Progress Tracking**: Monitor your streak and statistics
- **Beautiful UI**: Modern, responsive design with smooth animations

### Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Animations**: Framer Motion
- **Package Manager**: pnpm

### Getting Started

#### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/code-dash.git
cd code-dash
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables for AI-powered code analysis:

Copy the example file and add your API keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add **at least one** API key:

```env
# Choose your preferred AI provider (or use "auto" to try them in order)
AI_PROVIDER=auto

# Add at least one API key:
ANTHROPIC_API_KEY=your_claude_api_key_here    # https://console.anthropic.com/
OPENAI_API_KEY=your_openai_api_key_here       # https://platform.openai.com/api-keys
GOOGLE_API_KEY=your_gemini_api_key_here       # https://makersuite.google.com/app/apikey
```

**Note**: If you don't add any API keys, the app will still work with a simpler mock analysis system.

4. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

#### Build for Production

```bash
pnpm build
pnpm start
```

### Project Structure

```
code-dash/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with problem list
│   └── problem/[id]/      # Dynamic problem pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── code-editor-panel.tsx
│   ├── problem-description.tsx
│   └── ...
├── lib/                   # Utilities and data
│   ├── problems.ts       # Problem definitions
│   ├── analyze-code.ts   # Code analysis logic
│   └── utils.ts
└── public/               # Static assets
```

### Adding New Problems

Edit `lib/problems.ts` to add new algorithm challenges:

```typescript
{
  id: "your-problem-id",
  title: "Problem Title",
  category: "Category",
  difficulty: "Easy" | "Medium" | "Hard",
  description: "Problem description...",
  examples: [...],
  constraints: [...],
  starterCode: "function solution() { ... }",
  testCases: [...],
  functionName: "solution"
}
```

### AI Configuration

CodeDash supports three AI providers for code analysis:

1. **Anthropic Claude** (Recommended)
   - Model: `claude-3-5-sonnet-20241022`
   - Best for detailed code analysis and suggestions
   - Get API key: https://console.anthropic.com/

2. **OpenAI GPT**
   - Model: `gpt-4o`
   - Excellent for comprehensive feedback
   - Get API key: https://platform.openai.com/api-keys

3. **Google Gemini**
   - Model: `gemini-pro`
   - Free tier available
   - Get API key: https://makersuite.google.com/app/apikey

The app automatically selects an available provider or falls back to mock analysis if no API keys are configured.

### Future Enhancements

- Support for multiple programming languages (Python, Java, C++, etc.)
- User authentication and cloud progress sync
- Community-contributed problems
- Code hints and step-by-step solutions
- Leaderboard and achievements system

### Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

### License

MIT License - feel free to use this project for learning and personal use.

---

<a name="korean"></a>
## 한국어

### 개요

**CodeDash**는 AI 기반 알고리즘 학습 플랫폼으로, 누구나 손쉽게 코딩 연습을 할 수 있도록 돕습니다. 유료 구독 플랫폼 대신, CodeDash는 최신 AI 모델(Claude, GPT, Gemini 등)을 활용하여 지능적인 코드 분석과 피드백을 제공합니다.

### 주요 기능

- **인터랙티브 코드 에디터**: JavaScript를 지원하는 Monaco Editor 내장
- **알고리즘 챌린지**: 다양한 자료구조와 알고리즘을 다루는 엄선된 문제 모음
- **실시간 코드 실행**: 미리 정의된 테스트 케이스로 솔루션을 즉시 테스트
- **AI 어시스턴트 채팅**: 코딩 중 대화형 AI 멘토의 도움 받기
  - 솔루션을 직접 알려주지 않는 힌트 제공
  - 코드 리뷰 및 개선 제안
  - 개념 및 알고리즘 설명
  - 오류 및 문제 디버깅
- **AI 기반 분석**: 제출 시 상세한 피드백 제공:
  - 정확성 (테스트 결과 기반)
  - 시간 복잡도 (Big O 표기법)
  - 코드 가독성
  - 최적화 제안
- **진행 상황 추적**: 일일 기록과 통계 모니터링
- **아름다운 UI**: 부드러운 애니메이션이 적용된 현대적이고 반응형 디자인

### 기술 스택

- **프레임워크**: Next.js 16 (React 19)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: shadcn/ui + Radix UI
- **코드 에디터**: Monaco Editor (VS Code 에디터)
- **애니메이션**: Framer Motion
- **패키지 매니저**: pnpm

### 시작하기

#### 사전 요구사항

- Node.js 18+
- pnpm (권장) 또는 npm

#### 설치 방법

1. 저장소를 클론합니다:
```bash
git clone https://github.com/yourusername/code-dash.git
cd code-dash
```

2. 의존성을 설치합니다:
```bash
pnpm install
# 또는
npm install
```

3. AI 기반 코드 분석을 위한 환경 변수를 설정합니다:

예제 파일을 복사하고 API 키를 추가합니다:

```bash
cp .env.example .env.local
```

그 다음 `.env.local` 파일을 편집하여 **최소 하나의** API 키를 추가합니다:

```env
# 원하는 AI 제공자 선택 (또는 "auto"를 사용하여 순서대로 시도)
AI_PROVIDER=auto

# 최소 하나의 API 키를 추가하세요:
ANTHROPIC_API_KEY=your_claude_api_key_here    # https://console.anthropic.com/
OPENAI_API_KEY=your_openai_api_key_here       # https://platform.openai.com/api-keys
GOOGLE_API_KEY=your_gemini_api_key_here       # https://makersuite.google.com/app/apikey
```

**참고**: API 키를 추가하지 않아도 앱은 더 간단한 모의 분석 시스템으로 작동합니다.

4. 개발 서버를 실행합니다:
```bash
pnpm dev
# 또는
npm run dev
```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다

#### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

### 프로젝트 구조

```
code-dash/
├── app/                    # Next.js app 디렉토리
│   ├── page.tsx           # 문제 목록이 있는 홈 페이지
│   └── problem/[id]/      # 동적 문제 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── code-editor-panel.tsx
│   ├── problem-description.tsx
│   └── ...
├── lib/                   # 유틸리티 및 데이터
│   ├── problems.ts       # 문제 정의
│   ├── analyze-code.ts   # 코드 분석 로직
│   └── utils.ts
└── public/               # 정적 에셋
```

### 새 문제 추가하기

`lib/problems.ts` 파일을 수정하여 새로운 알고리즘 챌린지를 추가할 수 있습니다:

```typescript
{
  id: "your-problem-id",
  title: "문제 제목",
  category: "카테고리",
  difficulty: "Easy" | "Medium" | "Hard",
  description: "문제 설명...",
  examples: [...],
  constraints: [...],
  starterCode: "function solution() { ... }",
  testCases: [...],
  functionName: "solution"
}
```

### AI 설정

CodeDash는 코드 분석을 위해 세 가지 AI 제공자를 지원합니다:

1. **Anthropic Claude** (권장)
   - 모델: `claude-3-5-sonnet-20241022`
   - 상세한 코드 분석과 제안에 최적
   - API 키 발급: https://console.anthropic.com/

2. **OpenAI GPT**
   - 모델: `gpt-4o`
   - 포괄적인 피드백에 탁월
   - API 키 발급: https://platform.openai.com/api-keys

3. **Google Gemini**
   - 모델: `gemini-pro`
   - 무료 티어 제공
   - API 키 발급: https://makersuite.google.com/app/apikey

앱은 사용 가능한 제공자를 자동으로 선택하거나, API 키가 설정되지 않은 경우 모의 분석으로 대체합니다.

### 향후 개선 사항

- 여러 프로그래밍 언어 지원 (Python, Java, C++ 등)
- 사용자 인증 및 클라우드 진행 상황 동기화
- 커뮤니티 기여 문제
- 코드 힌트 및 단계별 솔루션 제공
- 리더보드 및 업적 시스템

### 기여하기

기여를 환영합니다! 이슈나 풀 리퀘스트를 자유롭게 제출해 주세요.

### 라이선스

MIT 라이선스 - 학습 및 개인적인 용도로 자유롭게 사용하실 수 있습니다.
