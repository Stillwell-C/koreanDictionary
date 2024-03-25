"use client";

import { Dialog, Transition } from "@headlessui/react";
import styles from "./addTermDialog.module.css";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CollectionResult from "./CollectionResult/CollectionResult";
import useSWRInfinite from "swr/infinite";

type Props = {
  isOpen: boolean;
  closeLink: string;
  userId: string;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const AddTermDialog = ({ isOpen, closeLink, userId }: Props) => {
  const router = useRouter();
  const [hasNextPage, setHasNextPage] = useState(true);

  const closeDialog = () => {
    router.push(closeLink);
  };

  const handleClose = () => {
    closeDialog();
  };

  //TODO move this logic into another component
  const getKey = (pageIndex: number, previousPageData: TermCollection[]) => {
    if (previousPageData && !previousPageData?.length) {
      setHasNextPage(false);
      return null;
    }

    return `/api/userTermCollections/${userId}?start=${
      pageIndex + 1
    }&results=5`;
  };

  const { data, size, isLoading, setSize } = useSWRInfinite<TermCollection[]>(
    getKey,
    fetcher
  );

  useEffect(() => console.log(data), [data]);

  const displayMoreButton =
    !isLoading &&
    hasNextPage &&
    data &&
    data[data?.length - 1].length % 5 === 0;

  if (!userId) router.push("/login");

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose}>
        <Dialog.Panel className={styles.wrapper}>
          <div className={styles.body}>
            <div className={styles.heading}>
              <Dialog.Title>Add to Collection</Dialog.Title>
              <button onClick={closeDialog}>&#10005;</button>
            </div>
            <div className={styles.bodyContent}>
              {data?.map((page) =>
                page.map((result) => (
                  <CollectionResult
                    key={result._id}
                    userId={userId}
                    result={result}
                  />
                ))
              )}
              {isLoading && "Loading..."}
              {displayMoreButton && (
                <button
                  className={styles.moreBtn}
                  onClick={() => setSize(size + 1)}
                >
                  More
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className={styles.overlay} aria-hidden='true' />
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default AddTermDialog;
