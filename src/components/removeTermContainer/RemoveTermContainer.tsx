import { auth } from "@/lib/auth";
import RemoveTermForm from "./removeTermForm/RemoveTermForm";

type Props = {
  targetCode: string;
  termCollectionId: string;
};

const RemoveTermContainer = async ({ targetCode, termCollectionId }: Props) => {
  return (
    <RemoveTermForm
      targetCode={targetCode}
      termCollectionId={termCollectionId}
    />
  );
};

export default RemoveTermContainer;
