import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
  category: string;
}

// Initialize the database
export const useDB = () => {
  const db = SQLite.openDatabase('store.db');

  useEffect(() => {
    debugDb();
    //initDB();   
  }, []);

  // Create the database
  const initDB = () => {
    const sql = `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      category TEXT NOT NULL
    )`;
    
    db.execAsync([{sql, args: []}], false).then(() => {
      console.log('Database initialized');
    })
  };

  // Insert a product. Make sure sql and args are in the correct order.
  const insertProduct = (product: Product) => {
    const { name, price, description, image, quantity, category } = product;
    const sql = `INSERT INTO products (name, price, description, image, quantity, category) VALUES (?, ?, ?, ?, ?, ?)`;
    const args = [name, price, description, image, quantity, category];
    return db.execAsync([{sql, args}], false);
  };

  const getProducts = () => {
    const sql = 'SELECT * FROM products';
    const args = [];
    return db.execAsync([{sql, args }], false).then((result) => result[0].rows) as Promise<Product[]>;
  };

  const getAllCategories = () => {
    const sql = 'SELECT DISTINCT category FROM products';
    const args = [];
    return db.execAsync([{sql, args }], false).then((result) => result[0].rows) as Promise<Product[]>;
  };

  const getProductsByCategory = (category: string) => {
    const sql = 'SELECT * FROM products WHERE category = ?';
    const args = [category];
    return db.execAsync([{sql, args }], false).then((result) => result[0].rows) as Promise<Product[]>;
  }

  const getProduct = (id: number) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    const args = [id];
    return db.execAsync([{sql, args }], false).then((result) => result[0].rows[0]) as Promise<Product>;
  }

  const deleteProduct = (id: number) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    const args = [id];
    return db.execAsync([{sql, args }], false);
  }

  const updateProduct = (product: Product) => {
    const { id, name, price, description, image, quantity, category } = product;
    const sql = 'UPDATE products SET name = ?, price = ?, description = ?, image = ?, quantity = ?, category = ? WHERE id = ?';
    const args = [name, price, description, image, quantity, category, id];
    return db.execAsync([{sql, args }], false);
  }

  // Debugging the database for Android and iOS
  const debugDb = async () => {
    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'SQLite/store.db', {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, 'store.db', 'application/octet-stream')
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch((e) => console.log(e));
      } else {
        console.log('Permission not granted');
      }
    } else {
      console.log(FileSystem.documentDirectory);
      await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/store.db');
    }
  };

  return { 
    getProducts,
    insertProduct,
    getAllCategories,
    getProductsByCategory,
    getProduct,
    deleteProduct,
    updateProduct,
  };
}