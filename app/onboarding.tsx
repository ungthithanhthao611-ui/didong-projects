import { LinearGradient } from "expo-linear-gradient";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Dimensions,
    PanResponder,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

const { width, height } = Dimensions.get("window");

const FLOATING_ICONS = ["🍰", "🍩", "🍓", "☕", "🧁"];

/* 🌊 FLOATING ICON */
function FloatingIcon({ icon, x, y, delay }: any) {
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(translateX, {
                        toValue: -60,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: -100,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotate, {
                        toValue: 1,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(rotate, {
                        toValue: 0,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "14deg"],
    });

    return (
        <Animated.Text
            style={[
                styles.floatingIcon,
                {
                    left: x,
                    top: y,
                    transform: [{ translateX }, { translateY }, { rotate: spin }],
                },
            ]}
        >
            {icon}
        </Animated.Text>
    );
}

const STEPS = [
    {
        icon: "🍰",
        title: "Sweetness",
        desc: "A lovely dessert & drink experience",
    },
    {
        icon: "🧁",
        title: "Delicious Desserts",
        desc: "Discover cakes, drinks & sweet treats",
    },
    {
        icon: "🛒",
        title: "Easy Ordering",
        desc: "Choose your favorite and order instantly",
    },
    {
        icon: "🚀",
        title: "Get Started",
        desc: "Let’s enjoy sweetness together",
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) =>
                step === STEPS.length - 1 && g.dy < -20,
            onPanResponderRelease: (_, g) => {
                if (step === STEPS.length - 1 && g.dy < -100) {
                    router.replace("/(auth)/login");
                }
            },
        })
    ).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [step]);

    const nextStep = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
    };

    return (
        <LinearGradient
            colors={["#FF9A9E", "#FAD0C4", "#FBC2EB"]}
            style={styles.container}
        >
            <View style={styles.blobPink} />
            <View style={styles.blobWhite} />

            {FLOATING_ICONS.map((icon, i) => (
                <FloatingIcon
                    key={i}
                    icon={icon}
                    x={Math.random() * (width - 40)}
                    y={Math.random() * (height - 200)}
                    delay={i * 300}
                />
            ))}

            <Animated.View
                style={[styles.heroCard, { opacity: fadeAnim }]}
                {...panResponder.panHandlers}
            >
                <View style={styles.iconCircle}>
                    <Text style={{ fontSize: 40 }}>{STEPS[step].icon}</Text>
                </View>

                <Text style={styles.title}>{STEPS[step].title}</Text>
                <Text style={styles.subTitle}>{STEPS[step].desc}</Text>

                {step < STEPS.length - 1 ? (
                    <TouchableOpacity style={styles.button} onPress={nextStep}>
                        <Text style={styles.buttonText}>Next ➜</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.replace("/(auth)/login")}
                    >
                        <Text style={styles.buttonText}>Get Started ⬆</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.dotsRow}>
                    {STEPS.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.dot, i === step && styles.dotActive]}
                        />
                    ))}
                </View>

                {step === STEPS.length - 1 && (
                    <Text style={styles.swipeHint}>⬆ Swipe up to continue</Text>
                )}
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    blobPink: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: "rgba(255,255,255,0.18)",
        top: -80,
        left: -100,
    },
    blobWhite: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: "rgba(255,255,255,0.25)",
        bottom: 120,
        right: -60,
    },
    floatingIcon: {
        position: "absolute",
        fontSize: 34,
        opacity: 0.7,
    },
    heroCard: {
        width: "85%",
        backgroundColor: "rgba(255,255,255,0.35)",
        borderRadius: 30,
        paddingVertical: 36,
        alignItems: "center",
        zIndex: 10,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: "900",
        color: "#fff",
        marginBottom: 6,
    },
    subTitle: {
        fontSize: 14,
        color: "#fff",
        opacity: 0.9,
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#FF1493",
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    dotsRow: {
        flexDirection: "row",
        marginTop: 18,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255,255,255,0.4)",
    },
    dotActive: {
        backgroundColor: "#fff",
        width: 18,
    },
    swipeHint: {
        marginTop: 14,
        color: "#fff",
        fontSize: 12,
        opacity: 0.85,
    },
});
