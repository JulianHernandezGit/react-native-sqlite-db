import { View, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DetailsPageProps } from '../../App';
import { Product, useDB } from '../hooks/useDB';
import { Ionicons } from '@expo/vector-icons';

const ProductPage = ({ navigation, route } : DetailsPageProps ) => {
  const { id } = route.params;
  const [product, setProduct] = useState<Product | undefined>();
  const { getProduct, updateProduct, deleteProduct } = useDB();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => onDelete(id)}>
          <Ionicons name="trash" size={24} color="black" />
        </TouchableOpacity>
      )
    });
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      const result = await getProduct(+id);
      setProduct(result);
    }
    loadProduct();
  }, [id]);
  
  const onUpdate = async () => {
    await updateProduct(product);
    navigation.goBack();
  };

  const onDelete = async (id: string) => {
    await deleteProduct(+id);
    navigation.goBack();
  };

  return <View style={styles.container}>
    {product && (
      <View style={styles.form}>
      <TextInput style={styles.input} placeholder='Name' value={product.name} onChangeText={(text) => setProduct({ ...product, name: text })} />
      <TextInput style={styles.input} placeholder='Price' onChangeText={(text) => setProduct({ ...product, price: parseFloat(text) })} />
      <TextInput style={styles.input} placeholder='Description' value={product.description} onChangeText={(text) => setProduct({ ...product, description: text })} />
      <TextInput style={styles.input} placeholder='Image' value={product.image} onChangeText={(text) => setProduct({ ...product, image: text })} />
      <TextInput style={styles.input} placeholder='Quantity' value={product.quantity.toString()} onChangeText={(text) => setProduct({ ...product, quantity: parseInt(text) })} />
      <TextInput style={styles.input} placeholder='Category' value={product.category} onChangeText={(text) => setProduct({ ...product, category: text })} />
    <Button title='Update Product' onPress={onUpdate} />
    </View>
    )}
  </View>
}

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 20,
    },
    form: {
      gap: 20,
      marginTop: 20,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      backgroundColor: 'white',
    },
});

export default ProductPage;