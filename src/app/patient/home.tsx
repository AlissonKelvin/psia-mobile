import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import {
  Clock,
  FileText,
  Mic,
  Send,
  Text as TextIcon,
  User,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

type ReportMode = "audio" | "text";

const MAX_SECONDS = 30;
const MAX_TEXT_LENGTH = 140;

export default function PatientHomeScreen() {
  const [mode, setMode] = useState<ReportMode>("audio");
  const [text, setText] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  async function requestPermission() {
    const status = await AudioModule.requestRecordingPermissionsAsync();

    if (!status.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o uso do microfone para gravar seu relato.",
      );
      return false;
    }

    return true;
  }

  async function startRecording() {
    const hasPermission = await requestPermission();

    if (!hasPermission) {
      return;
    }

    setAudioUri(null);
    setSeconds(0);
    setIsRecording(true);

    await recorder.prepareToRecordAsync();
    recorder.record();

    timerRef.current = setInterval(() => {
      setSeconds((currentSeconds) => {
        const nextSeconds = currentSeconds + 1;

        if (nextSeconds >= MAX_SECONDS) {
          stopRecording();
        }

        return nextSeconds;
      });
    }, 1000);
  }

  async function stopRecording() {
    if (!isRecording) {
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    await recorder.stop();
    setAudioUri(recorder.uri ?? null);
    setIsRecording(false);
  }

  function discardAudio() {
    setAudioUri(null);
    setSeconds(0);
  }

  async function saveAudioReport() {
    if (!audioUri) {
      return;
    }

    Alert.alert("Relato salvo", "Seu relato por áudio foi salvo para análise.");
    setAudioUri(null);
    setSeconds(0);
  }

  async function sendTextReport() {
    if (!text.trim()) {
      Alert.alert("Relato vazio", "Escreva seu relato antes de enviar.");
      return;
    }

    Alert.alert("Relato enviado", "Seu relato foi enviado para análise.");
    setText("");
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <View className="flex-1 bg-[#FCF3FB] px-5 pt-8">
      <Text className="text-sm text-[#6F527D]">Olá, Marina</Text>

      <Text className="mt-1 text-2xl font-bold text-[#241744]">
        Como você está hoje?
      </Text>

      <View className="mt-7 h-12 flex-row rounded-full bg-[#FCE8F5] p-1">
        <TouchableOpacity
          onPress={() => setMode("audio")}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full"
          style={mode === "audio" ? { backgroundColor: "#FFFFFF" } : undefined}
        >
          <Mic size={16} color="#241744" />
          <Text className="font-medium text-[#241744]">Áudio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode("text")}
          className="flex-1 flex-row items-center justify-center gap-2 rounded-full"
          style={mode === "text" ? { backgroundColor: "#FFFFFF" } : undefined}
        >
          <TextIcon size={16} color="#241744" />
          <Text className="font-medium text-[#241744]">Texto</Text>
        </TouchableOpacity>
      </View>

      {mode === "audio" ? (
        <View className="flex-1 items-center justify-center">
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            disabled={!!audioUri}
            className="h-32 w-32 items-center justify-center rounded-full bg-[#9B5FD3]"
            style={{ opacity: audioUri ? 0.6 : 1 }}
          >
            <Mic size={54} color="#FFFFFF" />
          </TouchableOpacity>

          <Text className="mt-8 text-2xl font-bold text-[#241744]">
            00:{String(seconds).padStart(2, "0")}
          </Text>

          <Text className="mt-2 text-sm text-[#6F527D]">
            {isRecording
              ? "Toque para parar a gravação"
              : audioUri
                ? "Gravação concluída"
                : "Toque para começar a gravar"}
          </Text>

          {audioUri ? (
            <View className="mt-8 w-full gap-3">
              <TouchableOpacity
                onPress={saveAudioReport}
                className="h-14 items-center justify-center rounded-full bg-[#9B5FD3]"
              >
                <Text className="font-bold text-white">Salvar relato</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={discardAudio}
                className="h-14 items-center justify-center rounded-full border border-[#E8D9EA] bg-white"
              >
                <Text className="font-bold text-[#241744]">
                  Gravar novamente
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : (
        <View className="mt-7 flex-1">
          <TextInput
            value={text}
            onChangeText={(value) => setText(value.slice(0, MAX_TEXT_LENGTH))}
            placeholder="Escreva como você está se sentindo agora. Pode ser sobre o dia, um sonho, uma situação..."
            placeholderTextColor="#8C7896"
            multiline
            textAlignVertical="top"
            maxLength={MAX_TEXT_LENGTH}
            className="h-[68%] rounded-3xl border border-[#E8D9EA] bg-white px-5 py-5 text-base leading-6 text-[#241744]"
          />

          <Text className="mt-2 text-right text-sm text-[#6F527D]">
            {text.length}/{MAX_TEXT_LENGTH}
          </Text>

          <TouchableOpacity
            onPress={sendTextReport}
            className="mt-3 h-14 flex-row items-center justify-center gap-2 rounded-full bg-[#C8A3E5]"
          >
            <Send size={18} color="#FFFFFF" />
            <Text className="font-bold text-white">Enviar relato</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="mb-4 h-16 flex-row items-center justify-around rounded-full border border-[#E8D9EA] bg-white">
        <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-full bg-[#9B5FD3]">
          <FileText size={20} color="#FFFFFF" />
          <Text className="mt-1 text-[10px] font-bold text-white">Relato</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Clock size={20} color="#6F527D" />
          <Text className="mt-1 text-[10px] text-[#6F527D]">Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <User size={20} color="#6F527D" />
          <Text className="mt-1 text-[10px] text-[#6F527D]">Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
