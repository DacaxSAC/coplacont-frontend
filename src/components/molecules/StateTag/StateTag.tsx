import styles from "./StateTag.module.scss";
import { Text } from "@/components/atoms/Text";
import { CheckIcon, InfoIcon } from "@/components/atoms";

export const StateTag: React.FC<{ state: boolean }> = ({ state }) => {
  return (
    <div className={`${styles.StateTag} ${styles[`StateTag--${state ? 'active' : 'inactive'}`]}`}>
      {state ? <CheckIcon /> : <InfoIcon />}
      <Text size="xs" color={state ? 'success' : 'danger'}>
        {state ? "Activo" : "Inactivo"}
      </Text>
    </div>
  );
};
