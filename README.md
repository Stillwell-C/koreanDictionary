# 꼬박꼬박 - Korean Dictionary and Flashcards

This repository is the front end for a dictionary application that can be used to generate flashcards in programs such as Anki.

This project is currently under development, and I am working to improve it whenever I have time. Feel free to contact me about bugs or improvements you think could be made.

## Demo

The application is live [here](https://korean-dictionary.vercel.app/).

## Detailed Description

This is a Next.js project. There is currently no back end being used, but I may create one if I need to integrate data from multiple sources. For now, all calls to APIs and databases are being handled by Next.js with sever actions and API endpoints.

You can look up Korean words and see definitions in 11 different languages, but the API being used only allows you to search for words in Korean. If your interested in trying it out but don't know Korean, I will include some words at the bottom you can copy and paste into the searchbar.

Once users make an account, they will be able to add words to collections which can be viewed on their profile page. If they navigate to the collection, they will see a link to download definitions and example sentences for each word as a CSV file. This file can be directly imported into Anki and will generate a flashcard for each word. The information in this file includes html tags, so be sure to toggle the option for html when importing the file. This will ensure that the word is bold in the example sentences.

All data is from an open API provided by the [National Institute of Korean Language](https://krdict.korean.go.kr/openApi/openApiInfo)

### Spaced Repetition Flashcards

The flashcards in this application rely on an implementation of the [SM-2](https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method) spaced repetition algorithm similar to the spaced repetition algorithm used in applications like Anki to determine the which flashcards users will see.

When users have completed their flashcards for the day, they are also given the option to increase the number of cards reviewed for the day if they wish to continue studying.

The current implementation is not perfect, and I am currently working to improve the functionality of this feature.

### Making target words bold

The API does not provide information for which word in an example sentence should be bold, something which can be difficult due to the complex conjugation possible in Korean. The dictionary does, however, provide the part of speech and origin for words, which I have used to display the target word in bold. This seems accurate, but I'm sure it is far from perfect. I will continue trying to improve any errors I see with this. I have not extended it to cover terms classed as "품사 없음(어근, 줄어든 말 등)" (Part of speech not applicable (a root, an abbreviated word, etc.)) as there are a range of different parts of speech in this group, and I have not been able to figure out if they can be differentiated by API data alone. I may keep this current system going forward or create a back end and use an open-source package such as [OKT](https://github.com/open-korean-text/open-korean-text) for stemming (어근화).

### Rendering Optimization

Most of the routes in this project lead to pages that would not make sense to build as static SSG pages in NextJS, such as those that display API data for thousands of terms or user data stored in the DB (While this would be fine for its current user base of only me, this would not make sense for an app with a large user base). However, the blog page was made primarily to experiment with SSG since there are a limited number of posts that will be posted. The data for these blog posts are stored on MongoDB like all of the user data, and the pages for these posts are all static HTML pages that are generated at build time using the generateStaticParams function provided by NextJS.

### Known issues

#### Dialog sentences

Target words can have different types of examples. Among these are dialog sentences between two parties. I have yet to find any API data denoting the order that these should be put in. Sentences ending with question marks are, to my knowledge, always the first sentence, but I have not investigated this thoroughly. Currently they are displayed in the order recieved from the API. In many cases, this appears to be correct; however, I have found some cases where they are misordered. I hope to find a more accurate solution for ordering these in the near future.

## Overview

- TypeScript
- Next.js
- SWR (for client side data fetching)
- NextAuth.js
- CSS modules

## Example Korean Words

You can copy and paste the following terms into the search bar to see how this app works.

- 쫄깃쫄깃
- 밝다
- 경감하다
- 답답하다
- 하다 (this will give you more than 700 pages of results)
