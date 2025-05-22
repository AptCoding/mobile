import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "../atoms/themed";

export interface GridProduct {
  id: string;
  title: string;
  category: string;
  icon?: JSX.Element;
}

interface ProductGridProps {
  products: GridProduct[];
  onPressProduct: (product: GridProduct) => void;
}

export default function ProductGrid({
  products,
  onPressProduct,
}: ProductGridProps) {
  const renderProductItem = ({ item }: { item: GridProduct }) => {
    const handlePress = () => {
      onPressProduct(item);
    };

    return (
      <Pressable onPress={handlePress} style={styles.productContainer}>
        <View style={styles.imageContainer}>{item.icon}</View>
        <ThemedText className="mb-3 mt-2 text-center">{item.title}</ThemedText>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      style={styles.gridContainer}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    width: "100%",
    padding: 0,
    margin: 0,
  },
  productContainer: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 150,
    height: 150,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
