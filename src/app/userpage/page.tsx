import { getTermCollections } from "@/lib/dbData";
import { auth } from "@/lib/auth";
import styles from "./userpage.module.css";
import { Suspense } from "react";
import TermList from "@/components/termList/TermList";
import SearchResultPaginationMenu from "@/components/searchResultPagination/SearchResultPaginationMenu";
import { Metadata } from "next";
import Link from "next/link";
import AddCollectionDialog from "@/components/addCollectionDialog/AddCollectionDialog";
import AddCollectionButton from "@/components/Buttons/addCollectionButton/AddCollectionButton";

type Props = {
  searchParams: {
    start?: string;
    modal?: string;
  };
};

export const generateMetadata = async (): Promise<Metadata> => {
  const session = await auth();

  return {
    title: `${session?.user?.username}'s Profile`,
    description: `Profile page for ${session?.user?.username}`,
  };
};

const page = async ({ searchParams: { start, modal } }: Props) => {
  const session = await auth();
  const userId = session?.user?.id || "";
  const data = await getTermCollections(userId, start);
  const showModal = modal === "true";

  const collections =
    data?.results?.length &&
    data.results.map((collection) => (
      <TermList
        key={collection._id}
        collectionId={collection._id.toString()}
        name={collection.name}
      />
    ));

  const addCollectionLink = start
    ? `/userpage?start=${start}&modal=true`
    : "/userpage?modal=true";
  const closeModalLink = start ? `/userpage?start=${start}` : "/userpage/";

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
        <div className={styles.resultsContainer}>
          <div className={styles.collectionsHeading}>
            <h2>Collections</h2>
            <AddCollectionButton addCollectionLink={addCollectionLink} />
          </div>
          <p>
            {`You have ${data.searchData.total} ${
              data.searchData.total !== "1" ? "collections" : "collection"
            }.`}
          </p>
          <div className={styles.results}>
            {!data?.results?.length && <p>No collections found</p>}
            {collections}
          </div>
        </div>
        <SearchResultPaginationMenu searchData={data.searchData} />
      </Suspense>
      <AddCollectionDialog
        isOpen={showModal}
        closeLink={closeModalLink}
        userId={session?.user?.id || ""}
      />
    </div>
  );
};

export default page;
