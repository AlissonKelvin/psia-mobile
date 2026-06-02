import { Link } from "expo-router";
import { Brain, Mic, Sparkles } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/colors";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-[#FCF3FB] px-8 pb-8 pt-12">
      <View className="flex-row items-center gap-3">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#9B5FD3] shadow-lg">
          <View className="h-2 w-2 rounded-full bg-white" />
        </View>

        <Text className="text-base font-bold text-[#241744]">PSIA</Text>
      </View>

      <View className="mt-16">
        <Text className="text-[38px] font-bold leading-[48px] text-[#241744]">
          Escuta com
        </Text>

        <Text className="text-[38px] font-bold leading-[48px]">
          <Text className="text-[#9B5FD3]">cuidado</Text>
          <Text className="text-[#241744]">, análise</Text>
        </Text>

        <Text className="text-[38px] font-bold leading-[48px]">
          <Text className="text-[#241744]">com </Text>
          <Text className="text-[#9B5FD3]">precisão</Text>
          <Text className="text-[#241744]">.</Text>
        </Text>

        <Text className="mt-6 text-base leading-7 text-[#6F527D]">
          PSIA apoia psicólogas no acompanhamento de relatos por texto e áudio,
          com transcrição e análise estruturada por IA.
        </Text>
      </View>

      <View className="mt-10 flex-row justify-between">
        <FeatureCard
          icon={<Mic size={22} color={colors.primary} />}
          label="Áudio"
        />
        <FeatureCard
          icon={<Sparkles size={22} color={colors.primary} />}
          label="Texto"
        />
        <FeatureCard
          icon={<Brain size={22} color={colors.primary} />}
          label="Resumo IA"
        />
      </View>

      <View className="mt-auto gap-3">
        <Link href="/auth/login" asChild>
          <TouchableOpacity className="h-14 items-center justify-center rounded-full bg-[#9B5FD3] shadow-lg">
            <Text className="text-base font-bold text-white">Entrar</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/register-psychologist" asChild>
          <TouchableOpacity className="h-14 items-center justify-center rounded-full border border-[#E8D9EA] bg-white shadow-sm">
            <Text className="text-base font-bold text-[#241744]">
              Criar conta de psicóloga
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  label: string;
};

function FeatureCard({ icon, label }: FeatureCardProps) {
  return (
    <View className="h-24 w-[31%] items-center justify-center rounded-3xl border border-[#E8D9EA] bg-white shadow-sm">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FCE8F5]">
        {icon}
      </View>

      <Text className="mt-3 text-sm text-[#4F3563]">{label}</Text>
    </View>
  );
}
