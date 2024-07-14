"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import "regenerator-runtime";
import { StyledEngineProvider } from "@mui/material/styles";
import dynamic from "next/dynamic";
import bgImage from "../../public/bg.jpg"; // Replace with the actual path to your bg.jpg
import micIconCursor from "../../public/microphone.png";
import CustomCursor from "@/components/CustomCursor";

const SpeechToTextField = dynamic(
  () => import("@/components/SpeechToTextField"),
  {
    ssr: false,
  }
);

const micCursorStyle = {
  cursor: `url(${micIconCursor}), auto`,
};

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const container = document.getElementById("speechContainer");
    if (container) {
      container.classList.add("pop-in");
    }
  }, []);

  const handleInputChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(searchText);
  };

  return (
    <StyledEngineProvider injectFirst>
      <CustomCursor />
      <div className="w-full min-h-screen items-center flex justify-center flex-col bg-image">
        <div
          id="speechContainer"
          className={`w-2/5 py-3 bg-white rounded-lg flex flex-col justify-center items-center`}
          style={micCursorStyle}
        >
          <span className="font-bold text-2xl text-black">Speech to Text</span>
          <SpeechToTextField
            setIsRecording={setIsRecording}
            setText={setSearchText}
          />
          <span className="text-black text-sm font-semibold mt-1">
            {isRecording ? "Recording..." : "Tap to record"}
          </span>
          <div className="w-5/6 border-1 py-2 mt-3 justify-center flex h-auto bg-[#daedfd] rounded-[7px]">
            <textarea
              value={searchText}
              onChange={handleInputChange}
              className={`w-full px-3 text-black bg-transparent border-none outline-none ${
                isRecording ? "fade-loop" : ""
              }`}
              placeholder={
                isRecording ? "Listening..." : "Type your text here..."
              }
              rows={3}
            />
          </div>
          <div className="flex flex-row mt-3 gap-3 items-center">
            <div
              className="text-white text-sm font-bold bg-green-500 rounded-[4px] px-2 py-1 cursor-pointer copyButton"
              onClick={handleCopyText}
            >
              Copy Text
            </div>
            <div
              className="text-white text-sm font-bold bg-red-500 rounded-[4px] px-2 py-1 cursor-pointer clearButton"
              onClick={() => setSearchText("")}
            >
              Clear Text
            </div>
          </div>
        </div>
      </div>
    </StyledEngineProvider>
  );
}
