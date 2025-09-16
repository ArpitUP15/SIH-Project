import React from 'react'
import { LuBrain } from "react-icons/lu";
import { BsPeople } from "react-icons/bs";
import { RiSecurePaymentLine } from "react-icons/ri";

const Whyus = () => {

    const dataJson = [
      {
        icon: <LuBrain className="text-[#2589FB] mx-auto text-4xl" />,
        heading: "Personalised Support",
        detail:
          "receive tailored guidance and resources designed to meet your unique mental health needs and academic challenges",
      },
      {
        icon: <BsPeople className="text-[#2589FB] mx-auto text-4xl" />,
        heading: "Supportive Community",
        detail:
          "Connect with peers in a safe understanding environment, fostering a sense of belonging and shared growth",
      },
      {
        icon: (
          <RiSecurePaymentLine className="text-[#2589FB] mx-auto text-4xl" />
        ),
        heading: "Confidential Booking System",
        detail:
          "Schedule private appointments with on-campus counselors ensuring your journey is supported with discretion",
      },
    ];

  return (
    <div className="">
      <h1 className="font-bold text-center text-3xl tracking-wide mt-[5rem]">
        Why Choose MindEase?
      </h1>

      <div className="mt-[3rem] px-10">
        <div className="flex items-center gap-4">
          {dataJson.map((elem, idx) => (
            <div className="flex-col mx-auto px-2 rounded-md basis-[30%] gap-[2%] h-[20%] items-center bg-white text-center">
              <p className="p-2">{elem.icon}</p>
              <h1 className="font-bold text-xl py-2 pt-4"> {elem.heading}</h1>
              <p className="py-2">{elem.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Whyus
