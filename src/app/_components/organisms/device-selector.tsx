import { View } from "react-native";
import { router } from "expo-router";

import type { GridProduct } from "../molecules/product-grid";
import type { ScrollableTab } from "../molecules/scrollable-tabs";
import { usePushNotifications } from "~/app/push-notifications";
import Evo from "../atoms/assets/chargericons//evo";
import Autocharge from "../atoms/assets/chargericons/autocharge";
import Basiccharge from "../atoms/assets/chargericons/basiccharge";
import Quantum from "../atoms/assets/chargericons/quantum";
import Securicharge from "../atoms/assets/chargericons/securicharge";
import Wallpod from "../atoms/assets/chargericons/wallpod";
import Zura from "../atoms/assets/chargericons/zura";
import { ThemedText } from "../atoms/themed";
import ProductGrid from "../molecules/product-grid";
import ScrollableTabs from "../molecules/scrollable-tabs";

// Products for EVO, WallPod, Zura, SecuriCharge, BasicCharge, Quantum, AutoCharge
const products: GridProduct[] = [
  {
    id: "evo",
    title: "EVO",
    category: "ev",
    icon: <Evo size={90} />,
  },
  {
    id: "wallpod",
    title: "WallPod",
    category: "ev",
    icon: <Wallpod size={90} />,
  },
  {
    id: "zura",
    title: "Zura",
    category: "ev",
    icon: <Zura size={90} />,
  },
  {
    id: "securicharge",
    title: "SecuriCharge",
    category: "ev",
    icon: <Securicharge size={90} />,
  },
  {
    id: "basiccharge",
    title: "BasicCharge",
    category: "ev",
    icon: <Basiccharge size={90} />,
  },
  {
    id: "quantum",
    title: "Quantum",
    category: "ev",
    icon: <Quantum size={90} />,
  },
  {
    id: "autocharge",
    title: "Autocharge",
    category: "ev",
    icon: <Autocharge size={90} />,
  },
];

export default function DeviceSelector() {
  const { expoPushToken } = usePushNotifications();
  console.log("pushToken", expoPushToken);

  const handlePressProduct = (product: GridProduct) => {
    router.push(`/installer/scan?type=${product.id == "evo" ? "EVO" : "V1"}`);
    //router.push("/installer/connect/id");
  };

  const addTabs: ScrollableTab[] = [
    {
      id: 0,
      title: "All",
      content: (
        <ProductGrid products={products} onPressProduct={handlePressProduct} />
      ),
    },
    {
      id: 1,
      title: "EV",
      content: (
        <ProductGrid
          products={products.filter((p) => p.category === "ev")}
          onPressProduct={handlePressProduct}
        />
      ),
    },
    {
      id: 2,
      title: "Leisure",
      content: (
        <ProductGrid
          products={products.filter((p) => p.category === "leisure")}
          onPressProduct={handlePressProduct}
        />
      ),
    },
  ];

  return (
    <View className="h-full w-full bg-background">
      <ThemedText className="font-montserrat_medium py-6 text-3xl">
        Add Device
      </ThemedText>
      <ScrollableTabs tabs={addTabs} />
    </View>
  );
}
