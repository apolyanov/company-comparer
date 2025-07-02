import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          height: 80,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Search',
        }}
      />
    </Tabs>
  )
}
