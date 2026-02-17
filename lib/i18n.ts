import type { AppLanguage } from "@/lib/app-language";

export const DEFAULT_LANGUAGE: AppLanguage = "en";

export interface LocaleCopy {
  header: {
    settings: string;
    language: string;
    languageEnglish: string;
    languageKorean: string;
  };
  hero: {
    badge: string;
    titleTop: string;
    titleBottom: string;
    description: string;
    startSolving: string;
  };
  home: {
    allCategory: string;
    allChallenges: string;
    challenges: string;
    problems: string;
    externalFeedbackTitle: string;
    externalFeedbackDescription: string;
    externalFeedbackAction: string;
  };
  externalFeedback: {
    backHome: string;
    title: string;
    description: string;
    titleLabel: string;
    titlePlaceholder: string;
    problemLabel: string;
    problemPlaceholder: string;
    codeLabel: string;
    codePlaceholder: string;
    submit: string;
    loading: string;
    resultTitle: string;
    errorRequired: string;
    errorGeneric: string;
    errorTimeout: string;
    defaultProblemTitle: string;
    mentorPrompt: string;
    editorTitle: string;
    editorDescription: string;
    chatTitle: string;
    chatDescription: string;
    chatMissingProblem: string;
    chatMissingProblemContext: string;
  };
  settings: {
    backHome: string;
    title: string;
    description: string;
    provider: string;
    model: string;
    maxTokens: string;
    apiKey: string;
    save: string;
    testConnection: string;
    testingConnection: string;
    connectionSuccess: string;
    lastSaved: string;
    keyRequired: string;
    connectionFailed: string;
    keyHelpLabel: string;
    keyHelpGetLink: string;
    keyHelpFormat: string;
    resetApiKey: string;
    modelPlaceholder: string;
    saveRequiresTest: string;
    saveBlockedNoModel: string;
  };
  problem: {
    back: string;
    aiMentor: string;
    examples: string;
    input: string;
    output: string;
    constraints: string;
    translationReady: string;
    fallbackEnglish: string;
    mentorSetupNotice: string;
    mentorSetupTitle: string;
    mentorSetupDescription: string;
    mentorSetupCancel: string;
    mentorSetupGoToSettings: string;
  };
  problemCard: {
    solved: string;
  };
  streak: {
    title: string;
    subtitle: string;
    last12Weeks: string;
    activityUnit: string;
    weekdays: string[];
  };
  stats: {
    title: string;
    solved: string;
    speedAvg: string;
    completion: string;
  };
}

const localeCopy: Record<AppLanguage, LocaleCopy> = {
  en: {
    header: {
      settings: "Settings",
      language: "Language",
      languageEnglish: "English",
      languageKorean: "Korean",
    },
    hero: {
      badge: "Today's challenge is live",
      titleTop: "Welcome!",
      titleBottom: "Ready to code?",
      description:
        "Sharpen your algorithms one challenge at a time. Build your streak and become unstoppable.",
      startSolving: "Start Solving",
    },
    home: {
      allCategory: "All",
      allChallenges: "All Challenges",
      challenges: "Challenges",
      problems: "problems",
      externalFeedbackTitle: "Practice More Problems",
      externalFeedbackDescription:
        "Paste problems from any source and solve them with AI mentor chat.",
      externalFeedbackAction: "Open Page",
    },
    externalFeedback: {
      backHome: "Back to Home",
      title: "Practice More Problems",
      description:
        "Paste any problem statement and solve with code + always-on AI mentor chat.",
      titleLabel: "Problem title (optional)",
      titlePlaceholder: "e.g. Longest Substring Without Repeating Characters",
      problemLabel: "Problem statement",
      problemPlaceholder: "Paste full statement, input/output format, and constraints.",
      codeLabel: "Your code (optional)",
      codePlaceholder: "Paste your current solution if you want code-level feedback.",
      submit: "Get Feedback",
      loading: "Analyzing...",
      resultTitle: "AI Feedback",
      errorRequired: "Paste the problem statement first.",
      errorGeneric: "Failed to request feedback. Please try again.",
      errorTimeout: "The request timed out. Please try again.",
      defaultProblemTitle: "External Problem",
      mentorPrompt:
        "Based on the pasted problem, give a short review with approach direction, common pitfalls, and one next action.",
      editorTitle: "Code Editor",
      editorDescription: "Write or paste your solution and ask the mentor to review specific parts.",
      chatTitle: "AI Mentor Chat",
      chatDescription: "Ask for hints, approach checks, debugging, or code review in chat form.",
      chatMissingProblem: "Paste the problem statement first for better guidance.",
      chatMissingProblemContext:
        "Problem statement is not provided yet. Ask the user to paste it first, then continue with focused guidance.",
    },
    settings: {
      backHome: "Back to Home",
      title: "Settings",
      description:
        "Provider, model, and token are saved in this browser. API keys are kept for this tab session only, so you need to enter them again after closing the browser.",
      provider: "Provider",
      model: "Model",
      maxTokens: "Max Tokens",
      apiKey: "API Key",
      save: "Save",
      testConnection: "Test Connection",
      testingConnection: "Testing connection...",
      connectionSuccess:
        "Connected successfully. The selected model is ready to use.",
      lastSaved: "Last saved",
      keyRequired: "Please enter the API key first.",
      connectionFailed: "Connection failed",
      keyHelpLabel: "API key help",
      keyHelpGetLink: "Get key",
      keyHelpFormat: "Key format",
      resetApiKey: "Reset API Key",
      modelPlaceholder: "Select a model",
      saveRequiresTest: "Saving is enabled only after a successful connection test.",
      saveBlockedNoModel: "Please select a model first.",
    },
    problem: {
      back: "Back",
      aiMentor: "AI Mentor",
      examples: "Example",
      input: "Input",
      output: "Output",
      constraints: "Constraints",
      translationReady: "EN + KO",
      fallbackEnglish: "English (fallback)",
      mentorSetupNotice:
        "If you do not add a model, it is difficult to expect accurate mentoring.",
      mentorSetupTitle: "AI mentor setup required",
      mentorSetupDescription:
        "You need to set up a model and API key to receive accurate feedback.",
      mentorSetupCancel: "Cancel",
      mentorSetupGoToSettings: "Go to Settings",
    },
    problemCard: {
      solved: "Solved",
    },
    streak: {
      title: "Daily Streak",
      subtitle: "Keep it going!",
      last12Weeks: "Last 12 Weeks",
      activityUnit: "activities",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    stats: {
      title: "Your Stats",
      solved: "Solved",
      speedAvg: "Speed Avg",
      completion: "Completion",
    },
  },
  ko: {
    header: {
      settings: "설정",
      language: "언어",
      languageEnglish: "영어",
      languageKorean: "한국어",
    },
    hero: {
      badge: "오늘의 챌린지가 열렸어요",
      titleTop: "환영합니다!",
      titleBottom: "코딩 시작해볼까요?",
      description:
        "하루 한 문제씩 알고리즘 실력을 키워보세요. 일일 기록을 쌓고 꾸준히 성장해요.",
      startSolving: "문제 풀기 시작",
    },
    home: {
      allCategory: "전체",
      allChallenges: "전체 챌린지",
      challenges: "챌린지",
      problems: "문제",
      externalFeedbackTitle: "다양한 문제 풀어보기",
      externalFeedbackDescription:
        "원하는 문제를 붙여넣고 AI 멘토와 함께 해결해보세요.",
      externalFeedbackAction: "페이지 열기",
    },
    externalFeedback: {
      backHome: "홈으로 돌아가기",
      title: "다양한 문제 풀어보기",
      description:
        "원하는 문제를 붙여넣고 코드 작성과 AI 멘토 채팅으로 바로 풀어보세요.",
      titleLabel: "문제 제목 (선택)",
      titlePlaceholder: "예: Longest Substring Without Repeating Characters",
      problemLabel: "문제 설명",
      problemPlaceholder:
        "문제 본문, 입력/출력 형식, 제약사항을 그대로 붙여넣어 주세요.",
      codeLabel: "내 코드 (선택)",
      codePlaceholder: "작성한 코드가 있다면 함께 붙여넣어 주세요.",
      submit: "피드백 받기",
      loading: "분석 중...",
      resultTitle: "AI 피드백",
      errorRequired: "문제 설명을 먼저 붙여넣어 주세요.",
      errorGeneric: "피드백 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      errorTimeout: "요청 시간이 초과되었습니다. 다시 시도해 주세요.",
      defaultProblemTitle: "외부 문제",
      mentorPrompt:
        "붙여넣은 문제를 기준으로 접근 방향, 자주 틀리는 포인트, 다음 액션 1개를 짧게 피드백해줘.",
      editorTitle: "코드 에디터",
      editorDescription: "코드를 작성하거나 붙여넣고, 특정 부분에 대한 리뷰를 채팅으로 요청하세요.",
      chatTitle: "AI 멘토 채팅",
      chatDescription: "힌트, 접근 검토, 디버깅, 코드 리뷰를 채팅으로 바로 받을 수 있어요.",
      chatMissingProblem: "더 정확한 도움을 위해 문제 설명을 먼저 붙여넣어 주세요.",
      chatMissingProblemContext:
        "문제 설명이 아직 입력되지 않았습니다. 먼저 문제 본문을 붙여넣도록 안내한 뒤에 구체적으로 도와주세요.",
    },
    settings: {
      backHome: "홈으로 돌아가기",
      title: "설정",
      description:
        "Provider, model, token 설정은 이 브라우저에 저장됩니다. API key는 세션에만 저장되어 브라우저를 닫으면 다시 입력해야 합니다.",
      provider: "Provider",
      model: "모델",
      maxTokens: "최대 토큰",
      apiKey: "API Key",
      save: "저장",
      testConnection: "연결 테스트",
      testingConnection: "연결 테스트 중...",
      connectionSuccess: "연결 성공. 현재 선택한 모델로 사용할 수 있습니다.",
      lastSaved: "마지막 저장",
      keyRequired: "API Key를 먼저 입력해주세요.",
      connectionFailed: "연결 실패",
      keyHelpLabel: "API key 도움말",
      keyHelpGetLink: "발급 링크",
      keyHelpFormat: "키 형식",
      resetApiKey: "API Key 초기화",
      modelPlaceholder: "모델을 선택하세요",
      saveRequiresTest: "연결 테스트 성공 후에만 저장할 수 있습니다.",
      saveBlockedNoModel: "모델을 먼저 선택해주세요.",
    },
    problem: {
      back: "뒤로",
      aiMentor: "AI 멘토",
      examples: "예시",
      input: "입력",
      output: "출력",
      constraints: "제약사항",
      translationReady: "영어 + 한국어",
      fallbackEnglish: "영어 기본값 (fallback)",
      mentorSetupNotice: "모델을 추가하지 않으면 정확한 멘토링을 기대하기는 어렵습니다.",
      mentorSetupTitle: "AI 멘토 설정 필요",
      mentorSetupDescription:
        "정확한 피드백을 받으려면 모델과 API Key를 설정해야 합니다.",
      mentorSetupCancel: "취소",
      mentorSetupGoToSettings: "설정 페이지로 이동",
    },
    problemCard: {
      solved: "해결됨",
    },
    streak: {
      title: "일일 기록",
      subtitle: "지금 페이스를 유지해보세요!",
      last12Weeks: "최근 12주",
      activityUnit: "활동",
      weekdays: ["월", "화", "수", "목", "금", "토", "일"],
    },
    stats: {
      title: "내 통계",
      solved: "해결 수",
      speedAvg: "평균 속도",
      completion: "완료율",
    },
  },
};

export function getLocaleCopy(language: AppLanguage): LocaleCopy {
  return localeCopy[language] ?? localeCopy[DEFAULT_LANGUAGE];
}
