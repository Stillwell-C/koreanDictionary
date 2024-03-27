import styles from "./termDefinitions.module.css";

type Props = {
  definitions?: SearchDefinition[] | TermDataDefinitionAndExamples[];
};

const TermDefinitions = ({ definitions }: Props) => {
  return (
    <ol className={styles.list}>
      {definitions?.map((definition) => (
        <li key={definition.definition}>
          <p>{definition.translation?.transWord}</p>
          <p>{definition.definition}</p>
          <p>{definition.translation?.transDfn}</p>
        </li>
      ))}
    </ol>
  );
};

export default TermDefinitions;
