type SearchDefinition = {
  definition: string;
  translation?: {
    transWord: string;
    transDfn: string;
    transLang: string;
  };
};

type SearchResultItem = {
  targetCode: string;
  word: string;
  wordGrade?: string;
  pronunciation?: string;
  pos?: string;
  origin?: string;
  link?: string;
  definitions?: SearchDefinition[];
};

type SearchResultSearchData = {
  total: string;
  start: string;
  num: string;
};

type SearchResult = {
  results: SearchResultItem[];
  searchData: SearchResultSearchData;
};

type PronunciationInfoType = {
  pronunciation: string;
  pronunciationLink: string;
};

type TermDataDerivativeType = {
  word: string;
  targetCode: string;
  link: string;
};

type TermDataExampleType = {
  type: string;
  example: string;
};

type TermDataDefinitionAndExamples = {
  definition: string;
  translation: {
    transLang: string;
    transWord: string;
    transDfn: string;
  };
  examples: TermDataExampleType[];
};

type TermDataResult = {
  targetCode: string;
  word: string;
  wordGrade?: string;
  wordType?: string;
  wordUnit?: string;
  pos?: string;
  categoryInfo?: {
    type: string;
    written_form: string;
  };
  pronunciationInfo?: PronunciationInfoType;
  originalLanguage?: {
    originalLanguage: string;
    originalLanguageType: string;
  };
  derivativesData?: TermDerivativeType[];
  definitionAndExamples: TermDataDefinitionAndExamples[];
};

type LoginWithCredentialsType = {
  username: string;
  password: string;
};

type FormStateType = {
  error?: boolean;
  errorMsg?: string;
  success?: boolean;
};

type TermCollection = {
  _id: string;
  name: string;
  lastReview: number;
};

type TermCollectionResponse = {
  results: TermCollection[];
  searchData: {
    total: string;
    start: string;
    num: string;
  };
};

type SavedTermResponse = {
  _id: string;
  termCollectionId: string;
  targetCode: string;
  easiness: number;
  interval: number;
  repititions: number;
  nextReview: number;
  completedForSession: boolean;
};

interface BlogPostData {
  _id: string;
  title: string;
  thumbnail?: string;
  updatedAt: string;
}

interface BlogPost extends BlogPostData {
  createdAt: string;
  postContent: string;
}

type MatchingGammarElement = {
  description: string;
  grammarForm: string;
  link: string;
};

interface SentenceData {
  text?: string;
  POS?: string;
  detailed_POS?: string[];
  start?: number;
  end?: number;
  meaning_in_english?: string;
  dictionary_form?: string;
  link?: string;
  expression?: string;
  components?: SentenceData[];
}
