import TextTranslation from "@/components/textTranslation/TextTranslation";
import styles from "./translate.module.css";

const Translate = () => {
  return (
    <div className={styles.container}>
      <h2>Translate</h2>
      <TextTranslation />
    </div>
  );
};

export default Translate;
