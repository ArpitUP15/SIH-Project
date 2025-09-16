import person1 from "../assets/images/person1.png";
import person2 from "../assets/images/person2.png";
import person3 from "../assets/images/person3.png";

const Reviews = () => {

    const dataJson = [
      {
        icon: "⭐⭐⭐⭐⭐",
        detail:
          "“MindSet has been an invaluable resource during my toughest academic periods. The personalized support and community made all the difference.”",
        img: person1,
        name: "Sarah J.",
        place: "University Student, Psychology",
      },
      {
        icon: "⭐⭐⭐⭐⭐",
        detail:
          "“I highly recommend MindSet for any student needing mental health resources. The booking system is confidential, and the peer support is amazing.”",
        img: person2,
        name: "Michael P.",
        place: "Graduate Student, Engineering",
      },
      {
        icon: "⭐⭐⭐⭐⭐",
        detail:
          "“As a mental health professional, I'm impressed by MindSet's comprehensive approach. It's a crucial platform for student well-being.”",
        img: person3,
        name: "Dr. Anya Sharma",
        place: "Licensed Psychologist",
      },
    ];

  return (
    <div className="bg-white px-20 pb-30 pt-10">
      <h1 className="font-bold text-center text-3xl tracking-wide mt-[5rem]">
        What Our Students Say
      </h1>
      <p className="mx-auto px-10 max-w-[600px] text-center mt-[1rem] font-bold tracking-tight text-zinc-800">
        Hear from students and experts who have benefited from MindSet's
        support.
      </p>

      <div className="mt-[3rem] px-10">
        <div className="flex items-center gap-4 overflow-clip flex-nowrap">
          {dataJson.map((elem, idx) => (
            <div className="flex-col mx-auto px-2 rounded-md  items-center bg-white text-center py-2">
              <p className="mt-2 font-bold text-start">{elem.icon}</p>
              <p className="py-2 text-base">
                {" "}
                <i>{elem.detail}</i>
              </p>

              <div className='flex items-center gap-6 px-2 mt-10'>
                <div><img className='rounded-full w-10 h-10' src={elem.img} alt="propfilepic" /></div>
                <div className='flex-col items-center'>
                  <div className='text-sm text-black'>{elem.name}</div>
                  <div className='text-[10px] text-zinc-800'>{elem.place}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reviews
