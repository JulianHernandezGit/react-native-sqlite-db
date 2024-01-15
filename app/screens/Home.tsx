import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { ProductsPageProps } from '../../App'
import { Product, useDB } from '../hooks/useDB';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

const Home = ({ navigation }: ProductsPageProps ) => {
  const { getProducts, getAllCategories, getProductsByCategory } = useDB();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      loadAllCategories();
    }, [])
  );

  const loadAllCategories = async () => {
    const result = await getAllCategories();
    setCategories([{ label: 'All', value: null }, ...result.map((item) => ({ label: item.category, value: item.category }))]);
  }

  const loadProducts = async () => {
    const result = await getProducts();
    setProducts(result);
  };

  const filterProducts = async (category: { label: string, value: string }) => {
    if (!category.value) {
      loadProducts();
    } else {
    const result = await getProductsByCategory(category.value);
    setProducts(result);
  }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const numberFormat = (value) => 
       new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);

    return (
    <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id.toString() })}>
      <View style={styles.item}>
        <Image source={{ uri: item.image ? item.image : 'https://via.placeholder.com/50' }} style={{ width: 50, height: 50 }} />
        <Text style={{ flex: 1 }}>{item.name}</Text>
        <Text>{numberFormat(item.price)} x {item.category}</Text>
      </View>
    </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <DropDownPicker 
      searchable={true}
      onSelectItem={filterProducts}
      open={open}
      value={selectedCategory}
      items={categories}
      setOpen={setOpen}
      setValue={setSelectedCategory}
      setItems={setCategories}
      />
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  }
})

export default Home