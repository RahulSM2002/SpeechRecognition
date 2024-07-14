import { IconButton } from "@mui/material";
import Image from "next/image";
import "./style.css";
import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime";

const SpeechToTextField = ({
  setText,
  setIsRecording,
}: {
  setText: any;
  setIsRecording: any;
}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const [lastTranscript, setLastTranscript] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  //This will stop the recording after 2 seconds if there's no new words
  useEffect(() => {
    setText(transcript);
    if (transcript !== lastTranscript) {
      setLastTranscript(transcript);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        SpeechRecognition.stopListening();
        stopAnalyzingAudio();
      }, 3000);
    }
  }, [transcript]);

  useEffect(() => {
    setIsRecording(listening);
  }, [listening]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startAnalyzingAudio = () => {
    audioContextRef.current = new AudioContext();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current.connect(analyserRef?.current);
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef?.current?.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      analyze();
    });
  };

  const analyze = () => {
    if (analyserRef?.current && dataArrayRef?.current) {
      analyserRef?.current?.getByteFrequencyData(dataArrayRef?.current);
      const sum = dataArrayRef?.current?.reduce((a, b) => a + b, 0);
      const avg = sum / dataArrayRef?.current?.length;
      setVolume(avg);
      requestAnimationFrame(analyze);
    }
  };

  const stopAnalyzingAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setVolume(0);
  };

  useEffect(() => {
    if (listening) {
      startAnalyzingAudio();
    } else {
      stopAnalyzingAudio();
    }
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const OnPress = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening();
    }
  };

  return (
    <IconButton
      className="feedback-container rounded-full w-[70px] h-[70px] bg-[#9f9ffc] border-[1px] border-[#000] mt-3 flex items-center justify-center cursor-pointer"
      style={{
        animation: listening
          ? `pulse ${Math?.max(1.5 - volume / 100, 0.5)}s infinite`
          : "none",
      }}
      onClick={OnPress}
    >
      <Image
        src="/microphone.svg"
        height={25}
        width={25}
        alt="microphone"
        className="microphone-status"
      />
    </IconButton>
  );
};

export default SpeechToTextField;
