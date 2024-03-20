import { getTermData, searchWord } from "@/lib/apiData";
import Reciever from "./Reciever";

const WordSearch = async () => {
  // const data = await getTermData("23460", "true", "1");
  const target_code = "23460";
  const translation = "true";
  const transLanguage = "1";

  const data = await fetch(
    `https://krdict.korean.go.kr/api/view?key=${
      process.env.API_KEY
    }&method=target_code&q=${target_code}${
      translation ? `&translated=y&trans_lang=${transLanguage}` : ""
    }`
  );

  const text = await data.text();

  return (
    <div>
      <Reciever data={text} />
    </div>
  );
};

export default WordSearch;
