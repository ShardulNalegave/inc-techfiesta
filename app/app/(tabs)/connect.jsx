import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRecoilState } from 'recoil'
import { userstate } from '../../constants/atoms'

const connect = () => {
  const [user,setuser]=useRecoilState(userstate)
  return (
    <SafeAreaView>

    <View>
      
      <Text>{user?.email}</Text>
      <Text>{user?.password}</Text>
    </View>
    </SafeAreaView>
  )
}

export default connect