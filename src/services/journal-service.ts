import { api } from "./api";

export async function createTextJournal(content: string) {
  const response = await api.post("/journal-entries/", {
    content,
    source_type: "text",
  });

  return response.data;
}

export async function createAudioJournal(audioUri: string) {
  const formData = new FormData();

  formData.append("audio", {
    uri: audioUri,
    name: "journal-audio.m4a",
    type: "audio/m4a",
  } as unknown as Blob);

  const response = await api.post("/journal-entries/audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
