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
