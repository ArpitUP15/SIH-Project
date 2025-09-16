import React from 'react'

const HowItWorks = () => {

    const dataJson = [
      {
        icon: "1",
        heading: "Create Your Profile",
        detail:
          "Share a few details about yourself and your needs so we can personalize your MindEase experience",
      },
      {
        icon: "2",
        heading: "Explore Resources",
        detail:
          "dive into our curated content library, content library, connect with suppport groups, or schedule a session with a counselor",
      },
      {
        icon: "3",
        heading: "Cultivate Well-being",
        detail:
          "Engage with tools and community support to build lasting resilience and thrive in your higher education journey",
      },
    ];
    

 return (
   <div className="mt-[10rem] px-20 pb-30 pt-10 bg-slate-100">
     <h1 className="font-bold text-center text-3xl tracking-wide mt-[5rem]">
       How MindEase Works
     </h1>

     <div className="mt-[3rem] px-10">
       <div className="flex items-center gap-4">
         {dataJson.map((elem, idx) => (
           <div className="flex-col mx-auto px-2 rounded-md basis-[30%] gap-[2%] h-[20%] items-center bg-white text-center">
             <p className="px-3 mt-2 py-1 mx-auto font-bold bg-blue-300 w-fit rounded-full">{elem.icon}</p>
             <h1 className="font-bold text-xl py-2 pt-4"> {elem.heading}</h1>
             <p className="py-2">{elem.detail}</p>
           </div>
         ))}
       </div>
     </div>
   </div>
 );
}

export default HowItWorks
