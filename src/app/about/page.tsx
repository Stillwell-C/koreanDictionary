import React from "react";

const AboutPage = () => {
  return (
    <div>
      <h2>About</h2>
      <div>
        <p>
          This is a project to I&apos;m making to practice Next.js and actually
          the first project I thought of making when I started learning to
          program.
        </p>
        <p>
          Using the dictionary API provided by the{" "}
          <a href='https://krdict.korean.go.kr/openApi/openApiInfo'>
            National Institute of Korean Language
          </a>
          , users can search words in multiple languages and, after creating an
          account, save words to their word list. Currently, users have only one
          word list, but the option to add more will be added in the future.
          They can then download this data - words, definitions, example
          sentences, etc. - as a CSV file which can be imported into flash card
          applications like <a href='https://apps.ankiweb.net/'>Anki</a>. This
          is still under development, and while you can currently download a CSV
          file from your word list, the formatting is off. I will add more
          detailed information on this in the form of blog posts.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
