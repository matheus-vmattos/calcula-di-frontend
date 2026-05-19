import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

type BrandIntroSplashProps = {
  onFinish: () => void;
};

export default function BrandIntroSplash({ onFinish }: BrandIntroSplashProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.86)).current;
  const line = useRef(new Animated.Value(-180)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(line, {
        toValue: 180,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.delay(450),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(onFinish);
  }, [line, opacity, scale, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.glow} />

        <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brand}>CalculaAI</Text>

        <Animated.View
          style={[
            styles.scanLine,
            {
              opacity,
              transform: [{ translateX: line }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#02040A",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: {
    width: 260,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#123B8A",
    opacity: 0.38,
  },
  logo: {
    width: 116,
    height: 116,
  },
  brand: {
    marginTop: 18,
    color: "#F7FAFF",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 0,
  },
  scanLine: {
    position: "absolute",
    top: 110,
    width: 110,
    height: 2,
    backgroundColor: "#7FB2FF",
  },
});