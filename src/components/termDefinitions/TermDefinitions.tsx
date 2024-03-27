import styles from "./termDefinitions.module.css";

type Props = {
  definitions?: SearchDefinition[];
};

const TermDefinitions = ({ definitions }: Props) => {
  return (
    <ol className={styles.list}>
      {definitions?.map((definition) => (
        <li key={definition.korean}>
          <p>{definition.translation?.transWord}</p>
          <p>{definition.korean}</p>
          <p>{definition.translation?.transDfn}</p>
        </li>
      ))}
    </ol>
  );
};

export default TermDefinitions;
