import { CompanyInfoLabels, GeneralInfoKeys } from '@/constants'
import { useEventCallback } from '@/hooks'
import { CompanyFullInfo } from '@/types'
import { memo, useMemo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { CompanyFinancialSummarySection } from './CompanyFinancialSummarySection'
import { CompanyListItemDataSection } from './CompanyItemDataSection'
import { KeyValueItemProps } from './KeyValueItem'

interface CompanyListItemProps {
  item: CompanyFullInfo
  onPress: (item: CompanyFullInfo) => void
}

export const CompanyListItem = memo(function CompanyListItem(
  props: CompanyListItemProps
) {
  const generalSectionRows = useMemo<KeyValueItemProps[]>(() => {
    return GeneralInfoKeys.map((key) => ({
      keyText: CompanyInfoLabels[key],
      valueText: props.item[key],
    }))
  }, [props])

  const onPress = useEventCallback(() => {
    props.onPress(props.item)
  })

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <CompanyListItemDataSection
        title={`General - ${props.item.name}`}
        rows={generalSectionRows}
      />
      <CompanyFinancialSummarySection item={props.item} />
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 16,
    gap: 16,
    borderRadius: 32,
  },
  title: {
    fontSize: 24,
  },
})
