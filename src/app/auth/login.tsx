import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { api } from "@/services/api";
import { saveToken } from "@/storage/auth-storage";

type UserRole = "psychologist" | "patient";

export default function LoginScreen() {
  const [role, setRole] = useState<UserRole>("psychologist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN_RESPONSE", response.data);

      await saveToken(response.data.access_token);

      if (role === "psychologist") {
        router.replace("/psychologist/home");
        return;
      }

      router.replace("/patient/home");
    } catch (error: any) {
      console.log("LOGIN_ERROR", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        baseURL: process.env.EXPO_PUBLIC_API_URL,
      });

      setErrorMessage("E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <View className="flex-1 bg-[#FCF3FB] px-8 pt-12">
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="h-9 w-9 items-center justify-center rounded-full border border-[#E8D9EA] bg-white"
      >
        <ArrowLeft size={18} color="#241744" />
      </TouchableOpacity>

      <View className="mt-8 flex-row items-center gap-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#9B5FD3] shadow-lg">
          <View className="h-3 w-3 rounded-full bg-white" />
        </View>

        <Text className="text-xl font-bold text-[#241744]">PSIA</Text>
      </View>

      <View className="mt-7">
        <Text className="text-3xl font-bold text-[#241744]">
          Bem-vinda de volta
        </Text>

        <Text className="mt-3 text-base text-[#6F527D]">
          Entre para continuar acompanhando.
        </Text>
      </View>

      <View className="mt-8 h-14 flex-row rounded-full bg-[#FCE8F5] p-1">
        <TouchableOpacity
          onPress={() => setRole("psychologist")}
          className="flex-1 items-center justify-center rounded-full"
          style={
            role === "psychologist" ? { backgroundColor: "#FFFFFF" } : undefined
          }
        >
          <Text className="font-medium text-[#241744]">Psicóloga</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setRole("patient")}
          className="flex-1 items-center justify-center rounded-full"
          style={
            role === "patient" ? { backgroundColor: "#FFFFFF" } : undefined
          }
        >
          <Text className="font-medium text-[#241744]">Paciente</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-7">
        <Text className="mb-2 font-medium text-[#241744]">E-mail</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          placeholderTextColor="#8C7896"
          autoCapitalize="none"
          keyboardType="email-address"
          className="h-14 rounded-full border border-[#E8D9EA] bg-white px-5 text-[#241744] shadow-sm"
        />
      </View>

      <View className="mt-5">
        <Text className="mb-2 font-medium text-[#241744]">Senha</Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#8C7896"
          secureTextEntry
          className="h-14 rounded-full border border-[#E8D9EA] bg-white px-5 text-[#241744] shadow-sm"
        />
      </View>

      {errorMessage ? (
        <Text className="mt-4 text-center text-sm font-medium text-red-500">
          {errorMessage}
        </Text>
      ) : null}

      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        className="mt-10 h-16 items-center justify-center rounded-full bg-[#9B5FD3] shadow-lg"
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-base font-bold text-white">Entrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
