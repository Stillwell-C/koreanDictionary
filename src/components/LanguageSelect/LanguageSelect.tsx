import { Listbox } from "@headlessui/react";
import styles from "./languageSelect.module.css";
import { FiCheck, FiChevronDown } from "react-icons/fi";

type Props = {
  currentLanguage: number;
  handleChangeLanguage: (e: number) => void;
};

const LanguageSelect = ({ currentLanguage, handleChangeLanguage }: Props) => {
  const languages = [
    { display: "한국어", value: 0 },
    { display: "English", value: 1 },
    { display: "日本語", value: 2 },
    { display: "Français", value: 3 },
    { display: "Español", value: 4 },
    { display: "العربية", value: 5 },
    { display: "монгол", value: 6 },
    { display: "Tiếng Việt", value: 7 },
    { display: "ไทย", value: 8 },
    { display: "Indonesia", value: 9 },
    { display: "русский", value: 10 },
    { display: "中文", value: 11 },
  ];

  const options = languages.map((language) => (
    <Listbox.Option
      className={({ active }) =>
        active ? `${styles.option} ${styles.optionActive}` : styles.option
      }
      key={language.value}
      value={language.value}
    >
      <span className={styles.optionCheck}>
        {language.value === currentLanguage && <FiCheck />}
      </span>
      <span>{language.display}</span>
    </Listbox.Option>
  ));

  return (
    <Listbox value={currentLanguage} onChange={handleChangeLanguage}>
      <Listbox.Label hidden>Translation Language:</Listbox.Label>
      <div className={styles.listboxContent}>
        <Listbox.Button className={styles.listboxButton}>
          <span>{languages[currentLanguage].display}</span>
          <span className={styles.listboxButtonIcon}>
            <FiChevronDown />
          </span>
        </Listbox.Button>

        <Listbox.Options className={styles.listboxOptions}>
          {options}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default LanguageSelect;
