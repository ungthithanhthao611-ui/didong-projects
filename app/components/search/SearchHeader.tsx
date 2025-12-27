import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SearchHeader({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
}) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={22} color="#FF5A9E" />
      </TouchableOpacity>

      <View style={styles.searchBox}>
        <AntDesign name="search1" size={18} color="#FF5A9E" />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Search Here!"
          placeholderTextColor="#999"
          style={styles.input}
          autoFocus
        />
      </View>

      <Ionicons name="person-outline" size={22} color="#FF5A9E" />
      <Ionicons name="bag-outline" size={22} color="#FF5A9E" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 12,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 42,
    elevation: 3,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
});
