# 꼬박꼬박 - Korean Dictionary and Flashcards

This repository is the front end for a dictionary application that can be used to generate flashcards in programs such as Anki.

This project is currently under development, and I am working to improve it whenever I have time. Feel free to contact me about bugs or improvements you think could be made.

## Demo

The application is live [here](https://korean-dictionary.vercel.app/).

## Detailed Description

This is a Next.js project. There is currently no back end being used, but I may create one if I need to integrate data from multiple sources. For now, all calls to APIs and databases are being handled by Next.js with sever actions and API endpoints.

You can look up Korean words and see definitions in 11 different languages, but the API being used only allows you to search for words in Korean. If your interested in trying it out but don't know Korean, I will include some words at the bottom you can copy and paste into the searchbar.

Once users make an account, they will be able to add words to collections which can be viewed on their profile page. If they navigate to the collection, they will see a link to download definitions and example sentences for each word as a CSV file. This file can be directly imported into Anki and will generate a flashcard for each word. The information in this file includes html, so be sure to toggle the option for html when importing the file. This will ensure that the word is bold in the example sentences. (The API does not provide information for which word in the example sentence should be bold, and due to the complex conjugation of Korean, I have made a very basic way for bolding most words, but hope to continue developing this. Please contact me if you know of a package that can assist with this.)

All data is from the open API provided by the [National Institute of Korean Language](https://krdict.korean.go.kr/openApi/openApiInfo)

### Rendering Optimization

Most of the routes in this project lead to pages that would not make sense to build as static SSG pages in NextJS like those that display API data for thousands of terms and user-specific data (While this would be fine for its current user base of only me, this would not make sense for an app with a growing user base). However, the blog page was made primarily to experiment with SSG since there are a limited number of posts that will ever be posted. The data for these blog posts are stored on MongoDB like all of the user data, and the pages for these posts are all static HTML that is generated at build time using the generateStaticParams function provided by NextJS.

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
