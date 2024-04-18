"use client";

import { deleteCollection } from "@/lib/action";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import styles from "./deleteCollectionDialog.module.css";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  closeLink: string;
  collectionId: string;
  userId: string;
};

const DeleteCollectionDialog = ({
  isOpen,
  closeLink,
  collectionId,
  userId,
}: Props) => {
  const errRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(deleteCollection, null);
  const { pending } = useFormStatus();
  const router = useRouter();

  const closeDialog = () => {
    router.push(closeLink);
  };

  const handleClose = () => {
    //Reset form action
    formRef?.current?.reset();
    closeDialog();
  };

  useEffect(() => {
    if (state?.error) {
      errRef?.current?.focus();
    }
  }, [state]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose}>
        <Dialog.Panel className={styles.wrapper}>
          <div className={styles.body}>
            <div className={styles.heading}>
              <Dialog.Title>Delete Collection</Dialog.Title>
              <button onClick={closeDialog}>&#10005;</button>
            </div>
            <div className={styles.bodyContent}>
              <p>Are you sure you want to delete this collection?</p>
              <form ref={formRef} className={styles.form} action={formAction}>
                <div className={styles.formInputDiv}>
                  <input
                    type='text'
                    name='userId'
                    value={userId}
                    hidden
                    readOnly
                  />
                  <input
                    type='text'
                    name='termCollectionId'
                    value={collectionId}
                    hidden
                    readOnly
                  />
                </div>
                <div className={styles.btnDiv}>
                  <button
                    className={`${styles.formButton} ${styles.modalButton}`}
                    type='submit'
                    disabled={pending}
                  >
                    {pending ? "Loading" : "Delete"}
                  </button>
                  <button
                    className={`${styles.closeButton} ${styles.modalButton}`}
                    onClick={closeDialog}
                    type='button'
                  >
                    Close
                  </button>
                </div>
              </form>
              <div>
                {state?.error && (
                  <p className={styles.formError} ref={errRef}>
                    {state?.errorMsg}
                  </p>
                )}
              </div>
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

export default DeleteCollectionDialog;
