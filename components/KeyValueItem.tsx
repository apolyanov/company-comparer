import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface KeyValueItemProps {
  keyText: string;
  valueText: string | number;
}

export const KeyValueItem = memo(function KeyValueItem(
  props: KeyValueItemProps
) {
  return (
    <View style={styles.container}>
      <Text>{props.keyText}</Text>
      <Text>{props.valueText}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    gap: 8,
  },
});
