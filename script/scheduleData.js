// SKALA 4반(205호) 주간 시간표 — 광주 캠퍼스, 교수님은 4반 기준.
// type: "class"(기본) | "holiday"(휴일/휴강) | "special"(특강/평가)
export const CLASS_LABEL = "SKALA 4반";
export const ROOM_LABEL = "205호 · 광주";

export const SCHEDULE = [
  {
    week: 1,
    days: [
      { date: "2026-07-14", dow: "화", course: "팀빌딩(심요한), Git 이해·활용", prof: "엄진영" },
      { date: "2026-07-15", dow: "수", course: "HTML, CSS, JavaScript", prof: "엄진영" },
      { date: "2026-07-16", dow: "목", course: "HTML, CSS, JavaScript", prof: "엄진영" },
      { date: "2026-07-17", dow: "금", course: "대체휴일(개천절)", prof: "", type: "holiday" },
    ],
  },
  {
    week: 2,
    days: [
      { date: "2026-07-20", dow: "월", course: "데이터 분석을 위한 Python 이해", prof: "류홍걸" },
      { date: "2026-07-21", dow: "화", course: "데이터 분석을 위한 Python 이해", prof: "류홍걸" },
      { date: "2026-07-22", dow: "수", course: "스마트 데이터 이해 및 활용", prof: "류홍걸" },
      { date: "2026-07-23", dow: "목", course: "스마트 데이터 이해 및 활용", prof: "류홍걸" },
      { date: "2026-07-24", dow: "금", course: "스마트 데이터 이해 및 활용", prof: "류홍걸" },
    ],
  },
  {
    week: 3,
    days: [
      { date: "2026-07-27", dow: "월", course: "데이터 분석 개요 및 기초통계", prof: "박병선" },
      { date: "2026-07-28", dow: "화", course: "데이터 분석 개요 및 기초통계", prof: "박병선" },
      { date: "2026-07-29", dow: "수", course: "Prompt 설계와 Context", prof: "한성훈" },
      { date: "2026-07-30", dow: "목", course: "LLM과 Transformer 아키텍처", prof: "한성훈" },
      { date: "2026-07-31", dow: "금", course: "LLM과 Transformer 아키텍처", prof: "한성훈" },
    ],
  },
  {
    week: 4,
    days: [
      { date: "2026-08-03", dow: "월", course: "Java, SpringBoot, Rest API 구현", prof: "류홍걸" },
      { date: "2026-08-04", dow: "화", course: "Java, SpringBoot, Rest API 구현", prof: "류홍걸" },
      { date: "2026-08-05", dow: "수", course: "Java, SpringBoot, Rest API 구현", prof: "류홍걸" },
      { date: "2026-08-06", dow: "목", course: "Java, SpringBoot, Rest API 구현", prof: "류홍걸" },
      { date: "2026-08-07", dow: "금", course: "Java, SpringBoot, Rest API 구현", prof: "류홍걸" },
    ],
  },
  {
    week: 5,
    days: [
      { date: "2026-08-10", dow: "월", course: "Agile 방법론 및 MSA 개발", prof: "류홍걸" },
      { date: "2026-08-11", dow: "화", course: "Agile 방법론 및 MSA 개발", prof: "류홍걸" },
      { date: "2026-08-12", dow: "수", course: "sLLM 구현 및 Fine Tunning", prof: "임성열" },
      { date: "2026-08-13", dow: "목", course: "sLLM 구현 및 Fine Tunning", prof: "임성열" },
      { date: "2026-08-14", dow: "금", course: "실전 Feature Engineering", prof: "이은호" },
    ],
  },
  {
    week: 6,
    days: [
      { date: "2026-08-17", dow: "월", course: "대체휴일(광복절)", prof: "", type: "holiday" },
      { date: "2026-08-18", dow: "화", course: "Front-framework: Vue.js", prof: "김일한" },
      { date: "2026-08-19", dow: "수", course: "Front-framework: Vue.js", prof: "김일한" },
      { date: "2026-08-20", dow: "목", course: "Front-framework: Vue.js", prof: "김일한" },
      { date: "2026-08-21", dow: "금", course: "Front-framework: Vue.js", prof: "김일한" },
    ],
  },
  {
    week: 7,
    days: [
      { date: "2026-08-24", dow: "월", course: "컨테이너 이해 및 애플리케이션 컨테이너화", prof: "신인철" },
      { date: "2026-08-25", dow: "화", course: "컨테이너 이해 및 애플리케이션 컨테이너화", prof: "신인철" },
      { date: "2026-08-26", dow: "수", course: "쿠버네티스 이해 및 애플리케이션 배포", prof: "신인철" },
      { date: "2026-08-27", dow: "목", course: "쿠버네티스 이해 및 애플리케이션 배포", prof: "신인철" },
      { date: "2026-08-28", dow: "금", course: "특강(취업특강)", prof: "최현영", type: "special" },
      { date: "2026-08-29", dow: "토", course: "특강(취업특강, 8시~12시 종료)", prof: "최현영", type: "special" },
    ],
  },
  {
    week: 8,
    days: [
      { date: "2026-08-31", dow: "월", course: "Spring AI", prof: "정윤석" },
      { date: "2026-09-01", dow: "화", course: "Spring AI", prof: "정윤석" },
      { date: "2026-09-02", dow: "수", course: "웹 서비스 개발 mini-Project", prof: "윤재성" },
      { date: "2026-09-03", dow: "목", course: "웹 서비스 개발 mini-Project", prof: "윤재성" },
      { date: "2026-09-04", dow: "금", course: "웹 서비스 개발 mini-Project", prof: "윤재성" },
    ],
  },
  {
    week: 9,
    days: [
      { date: "2026-09-07", dow: "월", course: "머신러닝 및 딥러닝 이해", prof: "김준범" },
      { date: "2026-09-08", dow: "화", course: "머신러닝 및 딥러닝 이해", prof: "김준범" },
      { date: "2026-09-09", dow: "수", course: "머신러닝 및 딥러닝 이해", prof: "김준범" },
      { date: "2026-09-10", dow: "목", course: "모델 개발 및 최적화", prof: "김준범" },
      { date: "2026-09-11", dow: "금", course: "모델 개발 및 최적화", prof: "김준범" },
    ],
  },
  {
    week: 10,
    days: [
      { date: "2026-09-14", dow: "월", course: "쿠버네티스 실무 심화", prof: "박보경" },
      { date: "2026-09-15", dow: "화", course: "쿠버네티스 실무 심화", prof: "박보경" },
      { date: "2026-09-16", dow: "수", course: "쿠버네티스 실무 심화", prof: "박보경" },
      { date: "2026-09-17", dow: "목", course: "특강(도메인특강, 프로젝트 현장 사례)", prof: "", type: "special" },
      { date: "2026-09-18", dow: "금", course: "생성형 AI 서비스 개발의 이해·활용 (LangChain)", prof: "김경난" },
    ],
  },
  {
    week: 11,
    days: [
      { date: "2026-09-21", dow: "월", course: "생성형 AI 서비스 개발의 이해·활용 (LangChain)", prof: "김경난" },
      { date: "2026-09-22", dow: "화", course: "생성형 AI 서비스 개발의 이해·활용 (LangChain)", prof: "김경난" },
      { date: "2026-09-23", dow: "수", course: "자체휴강", prof: "", type: "holiday" },
      { date: "2026-09-24", dow: "목", course: "추석연휴", prof: "", type: "holiday" },
      { date: "2026-09-25", dow: "금", course: "추석연휴", prof: "", type: "holiday" },
    ],
  },
  {
    week: 12,
    days: [
      { date: "2026-09-28", dow: "월", course: "RAG Pipeline 설계 및 구축", prof: "김경난" },
      { date: "2026-09-29", dow: "화", course: "RAG Pipeline 설계 및 구축", prof: "김경난" },
      { date: "2026-09-30", dow: "수", course: "RAG Pipeline 설계 및 구축", prof: "김경난" },
      { date: "2026-10-01", dow: "목", course: "데이터 분석 mini-Project", prof: "박보경" },
      { date: "2026-10-02", dow: "금", course: "데이터 분석 mini-Project", prof: "박보경" },
    ],
  },
  {
    week: 13,
    days: [
      { date: "2026-10-05", dow: "월", course: "대체휴일(개천절)", prof: "", type: "holiday" },
      { date: "2026-10-06", dow: "화", course: "모델 서빙 및 AIOps 구성", prof: "임성열" },
      { date: "2026-10-07", dow: "수", course: "모델 서빙 및 AIOps 구성", prof: "임성열" },
      { date: "2026-10-08", dow: "목", course: "모델 서빙 및 AIOps 구성", prof: "임성열" },
      { date: "2026-10-09", dow: "금", course: "한글날", prof: "", type: "holiday" },
    ],
  },
  {
    week: 14,
    days: [
      { date: "2026-10-12", dow: "월", course: "AI Agent 설계 및 구축", prof: "김경난" },
      { date: "2026-10-13", dow: "화", course: "AI Agent 설계 및 구축", prof: "김경난" },
      { date: "2026-10-14", dow: "수", course: "Vector DB", prof: "김경난" },
      { date: "2026-10-15", dow: "목", course: "AI Agent Capstone", prof: "김경난" },
      { date: "2026-10-16", dow: "금", course: "AI Agent Capstone", prof: "김경난" },
    ],
  },
  {
    week: 15,
    days: [
      { date: "2026-10-19", dow: "월", course: "AI Agent Capstone", prof: "김경난" },
      { date: "2026-10-20", dow: "화", course: "AI 서비스 개발 Mini-project", prof: "김경난" },
      { date: "2026-10-21", dow: "수", course: "AI 서비스 개발 Mini-project", prof: "김경난" },
      { date: "2026-10-22", dow: "목", course: "AI 서비스 개발 Mini-project", prof: "김경난" },
      { date: "2026-10-23", dow: "금", course: "DevOps 이해 및 활용", prof: "김경난" },
    ],
  },
  {
    week: 16,
    days: [
      { date: "2026-10-26", dow: "월", course: "DevOps 이해 및 활용", prof: "김경난" },
      { date: "2026-10-27", dow: "화", course: "AI 프로젝트 방법론", prof: "백정열", type: "special" },
      { date: "2026-10-28", dow: "수", course: "팀프로젝트", prof: "백정열" },
      { date: "2026-10-29", dow: "목", course: "팀프로젝트", prof: "박병선" },
      { date: "2026-10-30", dow: "금", course: "팀프로젝트", prof: "박병선" },
    ],
  },
  {
    week: 17,
    days: [
      { date: "2026-11-02", dow: "월", course: "팀프로젝트", prof: "이용우" },
      { date: "2026-11-03", dow: "화", course: "팀프로젝트", prof: "이용우" },
      { date: "2026-11-04", dow: "수", course: "팀프로젝트", prof: "이용우" },
      { date: "2026-11-05", dow: "목", course: "팀프로젝트", prof: "박창렬" },
      { date: "2026-11-06", dow: "금", course: "팀프로젝트", prof: "박창렬" },
    ],
  },
  {
    week: 18,
    days: [
      { date: "2026-11-09", dow: "월", course: "팀프로젝트", prof: "류홍걸" },
      { date: "2026-11-10", dow: "화", course: "팀프로젝트", prof: "류홍걸" },
      { date: "2026-11-11", dow: "수", course: "팀프로젝트", prof: "임성열" },
      { date: "2026-11-12", dow: "목", course: "팀프로젝트 (중간점검)", prof: "임성열" },
      { date: "2026-11-13", dow: "금", course: "팀프로젝트", prof: "임성열" },
    ],
  },
  {
    week: 19,
    days: [
      { date: "2026-11-16", dow: "월", course: "팀프로젝트", prof: "강병호" },
      { date: "2026-11-17", dow: "화", course: "팀프로젝트", prof: "강병호" },
      { date: "2026-11-18", dow: "수", course: "팀프로젝트", prof: "강병호" },
      { date: "2026-11-19", dow: "목", course: "팀프로젝트", prof: "강병호" },
      { date: "2026-11-20", dow: "금", course: "팀프로젝트", prof: "강병호" },
    ],
  },
  {
    week: 20,
    days: [
      { date: "2026-11-23", dow: "월", course: "팀프로젝트", prof: "이현민" },
      { date: "2026-11-24", dow: "화", course: "팀프로젝트", prof: "이현민" },
      { date: "2026-11-25", dow: "수", course: "팀프로젝트", prof: "임성열" },
      { date: "2026-11-26", dow: "목", course: "팀프로젝트", prof: "임성열" },
      { date: "2026-11-27", dow: "금", course: "팀프로젝트", prof: "임성열" },
    ],
  },
  {
    week: 21,
    days: [
      { date: "2026-11-30", dow: "월", course: "팀프로젝트", prof: "강병호" },
      { date: "2026-12-01", dow: "화", course: "팀프로젝트", prof: "강병호" },
      { date: "2026-12-02", dow: "수", course: "팀프로젝트", prof: "강병호" },
      { date: "2026-12-03", dow: "목", course: "팀프로젝트", prof: "강병호" },
      { date: "2026-12-04", dow: "금", course: "팀프로젝트", prof: "강병호" },
    ],
  },
  {
    week: 22,
    days: [
      { date: "2026-12-07", dow: "월", course: "팀프로젝트", prof: "류홍걸" },
      { date: "2026-12-08", dow: "화", course: "팀프로젝트", prof: "류홍걸" },
      { date: "2026-12-09", dow: "수", course: "팀프로젝트", prof: "류홍걸" },
      { date: "2026-12-10", dow: "목", course: "최종평가(예선)", prof: "류홍걸", type: "special" },
      { date: "2026-12-11", dow: "금", course: "최종평가(본선) · 수료식 (16시 종료)", prof: "류홍걸", type: "special" },
    ],
  },
];
