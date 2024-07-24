"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import "regenerator-runtime";
import { StyledEngineProvider } from "@mui/material/styles";
import dynamic from "next/dynamic";
import CustomCursor from "@/components/CustomCursor";
import { CardBody, CardContainer, CardItem } from "../components/3DCard";

const SpeechToTextField = dynamic(
  () => import("@/components/SpeechToTextField"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

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
    setTextCopied(true);
  };

  useEffect(() => {
    setTextCopied(false);
  }, [searchText]);

  return (
    <StyledEngineProvider injectFirst>
      <CustomCursor />
      <div className="w-full min-h-screen items-center flex justify-center flex-col bg-image">
        <CardContainer
          className={`w-2/5 py-3 bg-white rounded-lg flex flex-col justify-center items-center`}
        >
          <CardItem translateZ="50" className="font-bold text-2xl text-black">
            Speech to Text
          </CardItem>
          <CardItem as="p" translateZ="60">
            <SpeechToTextField
              setIsRecording={setIsRecording}
              setText={setSearchText}
            />
          </CardItem>
          <CardItem
            translateZ="70"
            className="text-black text-sm font-semibold mt-1"
          >
            {isRecording ? "Recording..." : "Tap to record"}
          </CardItem>
          <CardItem
            translateZ="50"
            className="w-5/6 border-1 py-2 mt-3 justify-center flex h-auto bg-[#daedfd] rounded-[7px]"
          >
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
          </CardItem>
          <CardItem
            translateZ={"50"}
            className="flex flex-row mt-3 gap-3 items-center"
          >
            <div
              className="text-white text-sm font-bold bg-green-500 rounded-[4px] px-2 py-1 cursor-pointer copyButton"
              onClick={handleCopyText}
              aria-disabled={textCopied}
              style={{ opacity: textCopied ? 0.5 : 1 }}
            >
              {textCopied ? "Copied" : "Copy Text"}
            </div>
            <div
              className="text-white text-sm font-bold bg-red-500 rounded-[4px] px-2 py-1 cursor-pointer clearButton"
              onClick={() => setSearchText("")}
            >
              Clear Text
            </div>
          </CardItem>
        </CardContainer>
      </div>
    </StyledEngineProvider>
  );
}
