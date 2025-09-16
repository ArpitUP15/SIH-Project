import React from 'react'
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { GrUserAdmin } from "react-icons/gr";
import { LiaUserFriendsSolid } from "react-icons/lia";
import a from "../assets/images/a.png";
import b from "../assets/images/b.png";
import c from "../assets/images/c.png";
import d from "../assets/images/d.png";


const Features = () => {

    const dataJson = [
      {
        icon: <IoChatbubblesOutline className='text-blue-500 text-3xl'/>,
        heading: "AI-guided Chatbot Support",
        detail:
          "Interactive chat provides immediate coping stratergies and directs to professional help",
        img: "",
      },
      {
        icon: <RiSecurePaymentLine className = "text-blue-500 text-3xl"/>,
        heading: "Confidential Booking System",
        detail:
          "Securely schedule appointments with on-campus counsellors or external helplines.",
        img: a,
      },
      {
        icon: <HiOutlineBuildingStorefront className = "text-blue-500 text-3xl"/>,
        heading: "Psychoeducational Resource",
        detail:
          "Access videos, relaxation audio, and mental wellness guides in multiple regional languages.",
        img: b,
      },
      {
        icon: <LiaUserFriendsSolid className = "text-blue-500 text-3xl"/>,
        heading: "Peer Support Platform",
        detail:
          "Connect with trained student volunteers and participate in moderated peer-to-peer forums.",
        img: c,
      },
      {
        icon: <GrUserAdmin className = "text-blue-500 text-3xl"/>,
        heading: "Admin Dashboard & Analytics",
        detail:
          "Authorities receive anonymous data analytics for comprehensive mental health trend monitoring.",
        img: d,
      },
    ];

  return (
    <div className="mx-auto">
      <h1 className="font-bold text-center text-3xl tracking-wide mt-[5rem]">
        Comprehensive Support, Right at Your Fingertips
      </h1>
      <p className="mx-auto px-10 max-w-[600px] text-center mt-[1rem] font-bold tracking-tight text-zinc-800">
        Explore the five core features of MindSet designed to foster mental
        resilience and provide timely assistance.
      </p>

      <div className="mt-[3rem] px-10">
        <div className="grid grid-cols-3 gap-4">
          {dataJson.map((elem, idx) => (
            <div className="flex-col mx-auto px-2 py-4 rounded-md  items-center bg-white text-center">
              <p className="px-3 mt-2 py-2 mx-auto font-bold bg-blue-200 w-fit rounded-full">
                {elem.icon}
              </p>
              <h1 className="font-bold text-xl py-2 pt-4"> {elem.heading}</h1>
              <p className="py-2 text-center text-[12px]">{elem.detail}</p>
              <img src={elem.img} alt="" className='mx-auto text-center h-30 w-full px-4'/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features
