import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'

import { useEventCallback } from '@/hooks'
import { debounce } from '@/utils'
import { memo, useRef } from 'react'
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'
import { IconButton } from './IconButton'

interface SearchInputProps {
  onChangeText?: TextInputProps['onChangeText']
  onPressFilters?: () => void
}

export const SearchInput = memo(function SearchInput(props: SearchInputProps) {
  const inputRef = useRef<TextInput>(null)

  const handleOnPressSearch = useEventCallback(() => {
    inputRef.current?.focus()
  })

  const onChangeText = useEventCallback((text: string) => {
    props.onChangeText?.(text)
  })

  return (
    <View style={styles.searchContainer}>
      <IconButton icon={faSearch} onPress={handleOnPressSearch} />

      <TextInput
        onChangeText={debounce(onChangeText)}
        placeholder="Search"
        ref={inputRef}
        style={styles.input}
      />

      <IconButton icon={faFilter} onPress={props.onPressFilters} />
    </View>
  )
})

const ContainerHeight = 48

const styles = StyleSheet.create({
  searchContainer: {
    height: ContainerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: ContainerHeight / 2,
    borderWidth: 1,
  },
  input: {
    height: '100%',
    flex: 1,
  },
  button: {
    flex: 1,
  },
})
