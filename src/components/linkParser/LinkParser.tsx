import React from "react";

const LinkParser = ({ children }: { children: string }) => {
  const urlCheck = (str: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return str.match(urlRegex);
  };

  const extractLink = (str: string) => {
    return str
      .replace(/\[[^\]]*\]/g, "")
      .replace("(", "")
      .replace(")", "");
  };

  const addLink = (str: string) => {
    if (urlCheck(str)) {
      const extractedLink = extractLink(str);
      return `<a target="_blank" href="${extractedLink}">Link</a>`;
    } else {
      return str;
    }
    // return urlCheck(str) ? `<a href="${str}">${str}</a>` : str;
  };

  const wordArr = children.split(" ");
  const formattedWords = wordArr.map((word) => addLink(word));
  const wordStr = formattedWords.join(" ");
  return <span dangerouslySetInnerHTML={{ __html: wordStr }} />;
};

export default LinkParser;
