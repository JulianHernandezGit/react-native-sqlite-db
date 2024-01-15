import { View, ModalBaseProps, StyleSheet, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { Product, useDB } from '../hooks/useDB';
import { ModalPageProps } from '../../App';

// Create a new product in the database with the form and text input
const NewProduct = ({ navigation }: ModalPageProps) => {
  const { insertProduct } = useDB();

  const [product, setProduct] = useState<Product>({
    name: 'Hat',
    price: 42,
    description: '',
    image: '',
    quantity: 100,
    category: 'Clothing',
  });

  // Insert the product into the database
  const addProduct = async () => {
    const result = await insertProduct(product);
    console.log(result);
    navigation.goBack();
  }

  return <View style={styles.container}>
    <View style={styles.form}>
      <TextInput style={styles.input} placeholder='Name' value={product.name} onChangeText={(text) => setProduct({ ...product, name: text })} />
      <TextInput style={styles.input} placeholder='Price' onChangeText={(text) => setProduct({ ...product, price: parseFloat(text) })} />
      <TextInput style={styles.input} placeholder='Description' value={product.description} onChangeText={(text) => setProduct({ ...product, description: text })} />
      <TextInput style={styles.input} placeholder='Image' value={product.image} onChangeText={(text) => setProduct({ ...product, image: text })} />
      <TextInput style={styles.input} placeholder='Quantity' value={product.quantity.toString()} onChangeText={(text) => setProduct({ ...product, quantity: parseInt(text) })} />
      <TextInput style={styles.input} placeholder='Category' value={product.category} onChangeText={(text) => setProduct({ ...product, category: text })} />
    <Button title='Create Product' onPress={addProduct} />
    </View>
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

export default NewProduct;