import { useClerk } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Alert, TouchableOpacity } from "react-native";
import { styles } from "../assets/styles/home.style";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export default function LogoutButton() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure, you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();

            Linking.openURL(Linking.createURL("/"));
          } catch (err) {
            console.error(JSON.stringify(err, null, 2));
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
    </TouchableOpacity>
  );
}
