import TermListResult from "@/components/termListResult/TermListResult";
import { getTermCollections } from "@/lib/apiData";
import { auth } from "@/lib/auth";
import styles from "./userpage.module.css";
import { Suspense } from "react";
import TermList from "@/components/termList/TermList";
import SearchResultPaginationMenu from "@/components/searchResultPagination/SearchResultPaginationMenu";

type Props = {
  searchParams: {
    start?: string;
  };
};

const page = async ({ searchParams: { start } }: Props) => {
  const session = await auth();
  const userId = session?.user?.id || "";
  const data = await getTermCollections(userId, start);

  const collections =
    data?.results?.length &&
    data.results.map((collection) => (
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
        <div className={styles.resultsContainer}>
          <h2>Collections</h2>
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
    </div>
  );
};

export default page;
