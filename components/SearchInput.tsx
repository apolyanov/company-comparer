import { useEventCallback, useTheme } from '@/hooks'
import { debounce } from '@/utils'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { memo, useMemo, useRef } from 'react'
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'
import { IconButton } from './IconButton'

interface SearchInputProps {
  onChangeText?: TextInputProps['onChangeText']
  onPressFilters?: () => void
}

export const SearchInput = memo(function SearchInput(props: SearchInputProps) {
  const theme = useTheme()
  const inputRef = useRef<TextInput>(null)

  const handleOnPressSearch = useEventCallback(() => {
    inputRef.current?.focus()
  })

  const onChangeText = useEventCallback((text: string) => {
    props.onChangeText?.(text)
  })

  const styles = useMemo(() => {
    const ContainerHeight = 48

    return StyleSheet.create({
      searchContainer: {
        height: ContainerHeight,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: ContainerHeight / 2,
        borderWidth: 1,
        borderColor: theme.colors.border.main,
        backgroundColor: theme.colors.background.surface,
      },
      input: {
        height: '100%',
        flex: 1,
        color: theme.colors.text.primary,
      },
    })
  }, [theme])

  return (
    <View style={styles.searchContainer}>
      <IconButton icon={faSearch} onPress={handleOnPressSearch} />
      <TextInput
        onChangeText={debounce(onChangeText)}
        placeholder="Search"
        placeholderTextColor={theme.colors.text.placeholder}
        ref={inputRef}
        style={styles.input}
      />
      <IconButton icon={faFilter} onPress={props.onPressFilters} />
    </View>
  )
})
