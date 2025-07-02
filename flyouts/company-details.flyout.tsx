import {
  CompanyFinancialSummarySection,
  CompanyListItemDataSection,
  KeyValueItemProps,
} from '@/components'
import {
  CompanyDetailsKeys,
  CompanyInfoLabels,
  GeneralInfoKeys,
} from '@/constants'
import { CompanyFullInfo, FlyoutContentBaseProps } from '@/types'
import { registerFlyout } from '@/utils/flyout'
import { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

export const CompanyDetailsFlyoutContent = memo(
  function CompanyDetailsFlyoutContent(
    props: FlyoutContentBaseProps<CompanyFullInfo>
  ) {
    const generalSectionRows = useMemo<KeyValueItemProps[]>(() => {
      return GeneralInfoKeys.map((key) => ({
        keyText: CompanyInfoLabels[key],
        valueText: props[key],
      }))
    }, [props])

    const detailsSectionRows = useMemo<KeyValueItemProps[]>(() => {
      return CompanyDetailsKeys.map((key) => ({
        keyText: CompanyInfoLabels[key],
        valueText: props.details[key],
      }))
    }, [props])

    return (
      <View style={styles.container}>
        <CompanyListItemDataSection
          title={`General - ${props.name}`}
          rows={generalSectionRows}
        />
        <CompanyListItemDataSection title="Details" rows={detailsSectionRows} />
        <CompanyFinancialSummarySection item={props} />
      </View>
    )
  }
)

const styles = StyleSheet.create({
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  container: {
    gap: 32,
  },
  actionButton: {
    flex: 1,
  },
})

export const CompanyDetailsFlyout = registerFlyout({
  id: 'company-details',
  props: {
    title: 'Company Details',
    Content: CompanyDetailsFlyoutContent,
  },
})
