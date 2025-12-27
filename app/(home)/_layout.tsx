import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Animated, View, StyleSheet } from "react-native";
import { useRef, useEffect } from "react";

/* 🎨 COLOR THEME */
const ACTIVE = "#FF5FA2";
const INACTIVE = "#B0B0B0";
const BG_CIRCLE = "#FFE1EF";

/* 🌸 TAB ICON WITH ANIMATION */
function AnimatedTabIcon({ name, color, focused }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.View
        style={[
          styles.circle,
          { opacity, transform: [{ scale }] },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={name} size={24} color={color} />
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          height: 64,
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="home-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="product"
        options={{
          title: "Product",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name="pricetags-outline" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name={focused ? "compass" : "compass-outline"} color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="Support"
        options={{
          title: "Support",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon name={focused ? "help-circle" : "help-circle-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BG_CIRCLE,
    top: -6,
  },
});
