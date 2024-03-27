import SearchLanguageToggle from "@/components/searchLanguageToggle/SearchLanguageToggle";
import { getTermData } from "@/lib/apiData";
import React from "react";
import SmallSearchForm from "@/components/smallSearchForm/smallSearchForm";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import AddTermDialog from "@/components/AddTermDialog/AddTermDialog";
import SingleTermDefinitionExamples from "@/components/singleTermDefinitionExamples/SingleTermDefinitionExamples";
import SingleTermTopline from "@/components/singleTermTopline/SingleTermTopline";

type Props = {
  params: {
    targetCode: string;
  };
  searchParams: {
    translation?: string;
    transLang?: string;
    modal?: string;
  };
};

export const generateMetadata = async ({
  params: { targetCode },
  searchParams: { translation, transLang },
}: Props): Promise<Metadata> => {
  const data = await getTermData(targetCode, translation, transLang);

  return {
    title: `Definition for ${data.word}`,
    description: `Definition, information, and examples for ${data.word}`,
  };
};

const SingleTermPage = async ({
  params: { targetCode },
  searchParams: { translation, transLang, modal },
}: Props) => {
  const session = await auth();
  const userId = session?.user?.id;

  const modalOpen = modal === "true";

  const data = await getTermData(targetCode, translation, transLang);

  const searchParamObj = { translation, transLang };
  let searchParamString = "";
  for (const [key, value] of Object.entries(searchParamObj)) {
    if (value) {
      searchParamString += searchParamString.length
        ? `&${key}=${value}`
        : `?${key}=${value}`;
    }
  }

  const openModalLink = searchParamString.length
    ? `/term/${targetCode}${searchParamString}&modal=true&modalTarget=${targetCode}`
    : `/term/${targetCode}?modal=true&modalTarget=${targetCode}`;

  const closeModalLink = `/term/${targetCode}${searchParamString}`;

  const content = (
    <div>
      <SmallSearchForm />
      <SearchLanguageToggle />
      <SingleTermTopline openModalLink={openModalLink} data={data} />
      <SingleTermDefinitionExamples
        definitionAndExamples={data?.definitionAndExamples}
        wordInfo={{
          word: data.word,
          pos: data?.pos,
          origin: data?.originalLanguage?.originalLanguageType,
        }}
      />
      {userId && modalOpen && (
        <AddTermDialog
          isOpen={modalOpen}
          closeLink={closeModalLink}
          userId={userId}
        />
      )}
    </div>
  );

  return content;
};

export default SingleTermPage;
