[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Stillwell-C/koreanDictionary/blob/main/README.md)

# 꼬박꼬박 - 한국어 사전과 플래시카드 애플리캐이션

이 리포지토리는 Anki 등의 플래시카드 프로그램에서 사용할 수 있는 플래시카드를 생성할 수 있는 사전 애플리캐이션의 프런트엔드 코드입니다.

이 프로젝트는 현재 개발 중이며 가능한 한 개선해 나가고 있습니다. 버그나 애플리캐이션을 개선할 수 있는 점에 대해 피드백 주시면 감사하겠습니다.

## Demo

애플리케이션은 [여기](https://korean-dictionary.vercel.app/)에서 사용할 수 있습니다.

## 백엔드 코드

백엔드 코드는 이 [리포지토리](https://github.com/Stillwell-C/mecabParseApi)를 참조해 주세요.

## 상세 내용

이 플로젝트는 Next.js으로 개발하었습다. 현재 백엔드가 사용되지 않았지만, 필요에 따라 여러 가지 데이터를 통합하기 위해 별도로 만들 수 있습니다. 현재는 API와 데이터베이스 접속을 모두 Next.js의 서버 액션과 API 엔드포인트로 처리하고 있습니다.

한국어 단어를 검색하면 11개 국어로 사전 검색 결과를 받을 수 있습니다. 사용되고 있는 제3자 API는 한국어로 된 검색 질의만 처리하며, 불어나 영어 등 다른 언어로 검색하면 외래어 결과만 보여집니다. 한국어를 모르시는 분들도 이 애플리케이션을 사용해보고 싶으시다면, 아래에 여러 가지 검색할 수 있는 한국어 단어를 제공하겠습니다.

사용자가 등록한 후에 프로필 페이지에서 여러 컬렉션을 관리할 수 있습니다. 각 컬렉션에 단어를 추가하고, 컬렉션 페이지에서는 각 단어 정의와 예문을 표시하는 플래시카드를 CSV 파일로 다운로드할 수 있습니다. 이 CSV 파일은 Anki 플래시카드 프로그램에서 직접 가져와 사용할 수 있으며, 파일 내에는 HTML 태그가 포함되어 있으므로 Anki에서 가져올 때 HTML 옵션을 선택해야 합니다. 이렇게 하면 목표 단어가 올바르게 볼드체로 표시됩니다.

컬렉션 페이지에서는 저장된 단어를 이하에 설명한 간격반복 방식으로 플래시카도로도 공부할 수 있습니다.

사전 검색 결과 데이터는 [국립국어원](https://krdict.korean.go.kr/openApi/openApiInfo)은 운영하는 오픈 API 데이터입니다.

### 간격 반복 플래시카드

이 애플리케이션은 Anki와 비슷한 간격 반복 알고리즘인 [SM-2](https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method)을 사용하여 사용자가 복습할 플래시카드와 그 순위를 결정합니다. 최적의 사용자 경험을 위해 알고리즘을 지속적으로 수정하고 있습니다.

사용자는 하루에 복습할 플래시카드를 모두 완료한 경우, 추가로 공부할 플래시카드 양을 늘릴 수 있는 선택지가 제공됩니다.

새로운 학습 세션(복습할 플래시카드가 리셋되는 시점)은 사용자 시간대 기준으로 매일 오전 3시에 시작된다. 프런트엔드에서는 Intl API를 사용하여 사용자의 시간대를 전송합니다. 이 API는 인터넷 브라우저에서 95% 이상 지원되므로 대부분의 상황에서 문제없이 작동합니다. 사용자가 시간대를 제공할 수 없는 경우, 이전 학습 세션 시작 후 24시간이 지난 후에 새로운 학습 세션이 시작됩니다.

### 번역 및 자연어 처리 문장 분석, AI 챗봇

번역 페이지를 방문하여 문장을 제출하면 번역 결과를 받을 수 있습니다. 현재 이 서비스는 Google 번역을 이용하여 제공하고 있습니다. 네이버 파파고가 더 우수한 번역을 제공한다고 생각하지만, 무료 티어 때문에 구글 번역을 사용하고 있습니다. 번역을 요청하면 번역 결과 아래에 Google 번역과 파파고 링크가 제공되어, 클릭하면 해당 번역을 바로 확인할 수 있습니다.

번역 결과를 받으면 "문장 분석 (Parse Sentence)" 버튼이 나타납니다. 문장 분석은 우선 백엔드 서버에서 처리됩니다. 백엔드는 Flask로 구축되었으며, 자연어 처리 (NLP) 패키지인 python-mecab-ko를 이용해 문장을 분석하고 문법 구조를 확인하는 소형 마이크로서비스 API입니다. 분석한 데이터는 프런트엔드에서 처리되며, 첫 번째 번역은 일부 문법 구조에 해당하는 단어들을 대상으로 구글 번역을 통해 진행합니다. 기존 기계 번역으로 정확하게 번역하기 어려운 문법 구조는 첫 번째 번역 단계에서 생략되며, 두 번째 번역 단계에서 ChatGPT를 통해 번역됩니다. ChatGPT는 구글 번역에 비해 번역 속도가 현저히 느리기 때문에, 두 서비스를 통합하여 사용합니다. 또한 백엔드는 정규식을 통해 특정 문법 구조를 확인합니다. 문법 구조가 확인되면, 분석된 문장 데이터와 함께 프런트엔드로 전송됩니다. 정규식만으로는 정확한 문법 구조 확인이 어려워, 확인된 문법 구조가 문장에 존재하는지를 ChatGPT를 통해 확정한 후 사용자에게 표시합니다. 문법 구조는 분석된 문장 아래에서 사용자가 클릭하여 외부 한국어 문법 자료로 이동할 수 있는 링크로 표시됩니다.

문장 분석기 아래에서 LangChain 패키지와 OpenAI의 ChatGPT를 통해 Retrieval-Augmented Generation (RAG) 방식을 이용한 AI 챗봇도 제공됩니다.

이 서비스는 한국어 관련 문의를 처리할 수 있으며, 사용자가 번역을 요청한 경우 챗봇은 원문과 번역문을 모두 받아 이에 대한 문의에 답변할 수 있습니다. 사용자가 특정 단어(또는 많은 경우 특정 문법)에 대해 질문하면, 챗봇은 답변 중 해당 단어 페이지로 이동할 수 있는 링크를 포함합니다. 링크가 가끔 이상하게 나올 수 있는 경우가 있는데, 이 기능을 개선하기 위해 노력 중입니다.

### 문장 분석과 목표 단어 볼드체로 나타냄

국립국어원 API는 예문에서 목표 단어를 명확히 식별하지 않으며 한국어의 복잡한 활용법을 정확하게 분석하여 목표 단어를 찾는 것은 쉽지 않습니다. API는 단어의 품사를 제공하므로 현재 품사를 바탕으로 문장을 분석하고 목표 단어를 찾아 볼드체로 표시합니다. 이 방법은 정확성이 있지만 완벽한 해결책은 아닙니다. 앞으로 발생하는 오류를 계속 확인하고 이 기능을 계속 개선할 계획입니다. "품사 없음(어근, 줄어든 말 등)"으로 지정된 단어는 여러 가지 품사를 포함하므로 적절한 분석 방법을 설계하는 데 시간이 필요합니다. 현재는 이러한 단어에 대해 볼드체로 표시하는 기능은 지원하지 않습니다. 이 품사에 해당하는 단어는 희귀해서 일반 사용자가 찾을 가능성이 낮으며 현재로서는 이 문제를 최우선으로 해결할 계획이 없습니다.

사용자가 번역을 요청할 경우 한국어 원문을 어근 분석하여 단어와 문법으로 나누어 뜻과 품사, 문법적 역할을 표시하는 도표를 제공할 계획입니다. Next.js 애프리케이션 내에서 이러한 분석을 수행할 수 없어서 [node-mecab-ya](https://github.com/golbin/node-mecab-ya)를 이용한 실험적인 백엔드가 도커 컨테이너에서 개발했지만 이 애플리케이션에서는 사용중이지 않습니다. 이 백엔드 기능을 계속 발전시켜 [node-mecab-ya](https://github.com/golbin/node-mecab-ya)이나 [OKT](https://github.com/open-korean-text/open-korean-text) 등을 이용해 보다 정확한 예문 분석과 볼드테 표시도 제공 할 수 있을 것입니다.

### 렌더링 최적화

수천 개의 검색 결과를 포함하는 API 데이터나 특정 사용자가 저장한 데이터를 표시하는 이 애플리캐이션의 대부분 페이지는 정적 사이트 생성(Static Site Generation - SSG)으로 만들 수 없습니다. 정적 사이트 생성 (SSG) 기법을 경험하기 위해 제한된 게시물로 구성된 블로그 페이지를 SSG 방식으로 개발했습니다. 사용자 데이터와 함께 블로그 데이터는 MongoDB 데이터베이스에 저장되어 있으며 다른 애플리캐이션 페이지와 달리 NextJS의 generateStaticParams 기능을 사용하여 컴파일시에 블로그 페이지가 정적 HTML 페이지로 생성됩니다.

### 현재 문제

#### 대화 예문

단어 검색 결과는 여러 예문 형태를 포함하며, 이 중 일부는 두 사람이 나누는 대화 예문입니다. 대화 예문은 일반적으로 가, 나와 같은 표시가 있습니다. API 데이터는 대화 예문의 순서를 식별하는 데이터 항목이 없습니다. 물음표로 끝나는 문장은 주로 첫 번째 문장인데 이 문제에 대한 명확한 규칙은 현재 알려지지 않았습니다. 현재로서는 예문은 API 데이터에서 나오는 순서로 그대로 표시됩니다. 대부분의 경우 이는 올바른 순서이지만 가끔씩 순서가 잘못된 경우도 있습니다. 앞으로 더 정확한 해결책을 찾기 위해 노력할 계획입니다.

## 기술 스택

- TypeScript
- Next.js
- SWR (클라이언트 데이터 접근)
- NextAuth.js
- CSS modules

## 한국어 단어

애플리케이션을 사용하고 싶지만 한국어를 모르시는 분을 위해 검색 입력 양식에 복사하여 붙여넣을 수 있는 한국어 단어 목록은 다음과 같습니다.

- 쫄깃쫄깃
- 밝다
- 경감하다
- 답답하다
- 하다 ('하다'를 검색하면 검색 결과 700 페이지이상 나옴)

## 스크린샷

#### Homepage Search

<img src="./ProjectImages/Homepage.png" alt="Homepage with search input">

#### Search Results

<img src="./ProjectImages/SearchResults.png" alt="Search Results" >

#### Add To Collection Modal

<img src="./ProjectImages/AddToCollection.png" alt="Add to collection modal" >

#### Term Page

<img src="./ProjectImages/Term.png" alt="term page">

#### Language Toggle

<img src="./ProjectImages/SearchLangToggle.png" alt="language toggle dropdown">

#### Translation & AI Chat Page

<img src="./ProjectImages/Translate.png" alt="sentence translation and ai chat page">

#### Sentence Parsing

<img src="./ProjectImages/SentenceParser.png" alt="sentence translation and ai chat page with parsed sentence">

#### Blog Page

<img src="./ProjectImages/Blog.png" alt="blog page" >

#### Profile Page With User Term Collections

<img src="./ProjectImages/ProfileCollections.png" alt="profile page showing user term collections" >

#### Term Collection Page

<img src="./ProjectImages/CollectionPage.png" alt="term collection page">

#### Flashcard Front

<img src="./ProjectImages/FlashCardFront.png" alt="front of flashcard" >

#### Flashcard Back With Spaced Repetition Options

<img src="./ProjectImages/FlashCardBack.png" alt="back of flashcard with 4 spaced repetition options">
