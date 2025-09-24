import { ActivityIndicator, View } from "react-native";
import { styles } from "@/assets/styles/home.style.js";
import { COLORS } from "../constants/colors";

export default function PageLoader() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
