import { NavigationContainer, NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import NewProduct from './app/screens/NewProduct';
import Product from './app/screens/Product';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

// Define Stack on TypeScript
type RootStackParamList = {
  Products: undefined;
  Modal: undefined;
  Details: {
    id: string;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

// Although it was working without the type definition, we define this for TypeScript
export type StackNavigation = NavigationProp<RootStackParamList>;

export type ProductsPageProps = NativeStackScreenProps<RootStackParamList, 'Products'>;
export type ModalPageProps = NativeStackScreenProps<RootStackParamList, 'Modal'>;
export type DetailsPageProps = NativeStackScreenProps<RootStackParamList, 'Details'>;

const RootStackNavigation = () => {
  const navigation = useNavigation<StackNavigation>();

  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Products"
       component={Home}
       options={{
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        ),
       }} 
       />
      <RootStack.Screen name="Modal" component={NewProduct}
        options={{ presentation: 'modal' }} />
      <RootStack.Screen name="Details" component={Product} />
    </RootStack.Navigator>
  )
}

export default function App() {
  const [isReady, setIsReady] = useState(true);
  // FileSystem.deleteAsync(FileSystem.documentDirectory + 'SQLite/store.db');

  // const openDatabase = async () => {
  //   if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
  //     await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  //   }
  //   const asset = Asset.fromModule(require('./assets/store.db'));
  //   await FileSystem.downloadAsync(asset.uri, FileSystem.documentDirectory + 'SQLite/store.db');
  //   setIsReady(true);
  // };

  // openDatabase();

  return <NavigationContainer>{isReady ? <RootStackNavigation /> : <></>}</NavigationContainer>;
}
