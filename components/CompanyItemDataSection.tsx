import { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { KeyValueItem, KeyValueItemProps } from './KeyValueItem'
import { Typography } from './Typography'

interface CompanyListItemDataSectionProps {
  title: string
  rows: KeyValueItemProps[]
}

export const CompanyListItemDataSection = memo(
  function CompanyListItemDataSection(props: CompanyListItemDataSectionProps) {
    return (
      <View style={styles.container}>
        <Typography style={styles.title}>{props.title}</Typography>
        {props.rows.map((row) => (
          <KeyValueItem
            key={`${row.keyText}-${row.valueText}`}
            keyText={row.keyText}
            valueText={row.valueText}
          />
        ))}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 24,
  },
})
