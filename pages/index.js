import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import "regenerator-runtime";
import axios from "axios";
import Loader from "../components/Loader";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-DtEoVcJoc0JL7P7Y7izGl1eG",
  apiKey: "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",
});


export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [res, setRes] = useState("");
  const[isLoading,setIsLoading]=useState(false)
  const [visible, setVisible] = useState(false);
  const [Islistening, setIslistening] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setVisible(true);
    await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0,
        top_p: 1,
        n: 1,
        stream: false,
        logprobs: null,
      },{
        
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
        
      }
    ).then((res)=>{
     setRes(res.data.choices[0].text)
      setIsLoading(false)
    });
   
   
    
    SpeechRecognition.stopListening();
    resetTranscript();
    setIslistening(false);
  };
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (Islistening) {
      SpeechRecognition.startListening({ continuous: true });
      setPrompt(transcript);
      console.log(prompt);
    }
  }, [Islistening, transcript]);

  return (
    <div className=" bg-gray-800 w-full ">
      <nav className="bg-black text-white text-4xl font-extrabold py-8 px-4 flex justify-center">
        MY CUSTOM AI
      </nav>
      <form
        className=" my-10 flex justify-center flex-col  mx-40 "
        onSubmit={submitHandler}
      >
        <label className="text-lg text-white bg-black w-[60%] py-3 px-2 rounded-md my-5 font-extrabold">
          <p>ASK ME ANYTHING</p>
        </label>
        <textarea
          rows={5}
          className="w-[60%] py-2 px-4 text-lg "
          placeholder="Type your query here ..."
          value={prompt}
          onChange={(e) => {
            setVisible(false);
            setPrompt(e.target.value);
          }}
        ></textarea>
        <div className="flex items-center space-x-10 ">
          <button
            type="submit"
            className="my-4 bg-black rounded-md text-white text-lg py-3 w-[10%]"
          >
            SUBMIT
          </button>
          <button
            type="button"
            className={
              !Islistening
                ? "my-7 bg-white rounded-full  text-lg py-3  px-3"
                : "my-7 bg-red-500 rounded-full  text-lg py-3  px-3 shadow-md translate-y-[-6px] transition-all"
            }
            onClick={() => setIslistening(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width={40}
              height={40}
            >
              <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
            </svg>
          </button>
        </div>
      </form>

      {visible && (
        <div className="text-lg text-white my-4 bg-slate-600 mx-40 py-6 px-4 w-[40%] flex justify-center">
          {isLoading?<Loader></Loader> :res}
        </div>
      )}
    </div>
  );
}
