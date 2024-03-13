import { getTermData, searchWord } from "@/lib/apiData";
import Reciever from "./Reciever";

const WordSearch = async () => {
  const data = await getTermData("23460", "true", "1");

  return (
    <div>
      <Reciever data={data} />
    </div>
  );
};

export default WordSearch;
