import { CompanyInfoLabels, GeneralInfoKeys } from '@/constants'
import { useEventCallback, useTheme } from '@/hooks'
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
  const theme = useTheme()

  const generalSectionRows = useMemo<KeyValueItemProps[]>(() => {
    return GeneralInfoKeys.map((key) => ({
      keyText: CompanyInfoLabels[key],
      valueText: props.item[key],
    }))
  }, [props])

  const onPress = useEventCallback(() => {
    props.onPress(props.item)
  })

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        borderColor: theme.colors.border.main,
        backgroundColor: theme.colors.background.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
      },
    ],
    [theme]
  )

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
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
    gap: 32,
  },
})
