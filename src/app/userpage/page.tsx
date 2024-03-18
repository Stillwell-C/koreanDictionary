import TermListResult from "@/components/termListResult/TermListResult";
import { getTermCollections } from "@/lib/apiData";
import { auth } from "@/lib/auth";
import styles from "./userpage.module.css";
import { Suspense } from "react";
import TermList from "@/components/termList/TermList";

type Props = {
  searchParams: {
    translation?: string;
    transLang?: string;
  };
};

const page = async ({ searchParams: { translation, transLang } }: Props) => {
  const session = await auth();
  const data: { _id: string; name: string }[] | [] = session?.user?.id
    ? await getTermCollections(session.user.id)
    : [];

  const collections =
    data?.length &&
    data.map((collection) => (
      <TermList
        key={collection._id}
        collectionId={collection._id.toString()}
        name={collection.name}
      />
    ));

  return (
    <div className={styles.container}>
      <div className={styles.results}>
        <h2>My Info</h2>
        <div>
          <p>Username: {session?.user?.username}</p>
          <p>Email: {session?.user?.email}</p>
        </div>
      </div>

      <Suspense fallback={<p>Retrieving collections...</p>}>
        <h2>Collections</h2>
        <div className={styles.results}>
          {!data?.length && <p>No collections found</p>}
          {collections}
        </div>
      </Suspense>
    </div>
  );
};

export default page;
