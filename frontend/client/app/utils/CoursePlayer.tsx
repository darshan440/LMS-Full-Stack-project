import React, { useEffect, useState } from 'react'
import { FC } from 'react';
import axios from "axios";

type Props = {
    videoUrl: string;
    title: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
    const [videoData, setVideoData] = useState({
        otp: "",
        playbackInfo:""
    })

  useEffect(() => {
    if (videoUrl) {
      axios
        .post("http://localhost:8000/api/v1/getVdoCipherOTP", {
          videoId: videoUrl,
        })
        .then((res: any) => {
            setVideoData(res.data);
            console.log(res.data);

        })
        .catch((err) => {
          console.error("Error fetching OTP:", err);
        });
        
    }
  }, [videoUrl]);
  return (
      <div style={{ paddingTop: "41%", position: "relative" }}>
          
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=wgybyEEfDk5hssK6 `}
          style={{
            border: 0,
            width: "90%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
              ></iframe>
              
          )}
          
      </div>
      
  );
}

export default CoursePlayer