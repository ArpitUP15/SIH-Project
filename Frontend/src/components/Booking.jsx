import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import BookingHeroImage from "../assets/images/BookingHeroImage.png";
import { GiNotebook } from "react-icons/gi";
import { PiStudentDuotone } from "react-icons/pi";
import { RiPsychotherapyLine } from "react-icons/ri";
import { BsCalendarDate } from "react-icons/bs";
import { Calendar } from "@/components/ui/calendar";
import { IoIosTimer } from "react-icons/io";
import { GrView } from "react-icons/gr";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Booking = () => {


    const [ studentId, setStudentId] = useState();
    const [counsellors, setCounsellors] = useState();
    const [date, setDate] = useState(Date)
    const [policy, setPolicy] = useState(false);
 
  return (
    <div>
      {/* NAVBAR */}
      <div className="px-8 py-2 flex items-center">
        <div className="flex gap-2 basis-[25%] items-center">
          <div>logo</div>
          <div className="text-[#2589FB] font-bold text-xl">MindEase</div>
        </div>
        <div className="w-full">
          <ul className="list-none flex items-center justify-center gap-8">
            <li className="hover:scale-105 text-sm cursor-pointer hover:underline transition-all duration-100 text-white">
              Book a Session
            </li>
            <li className="hover:scale-105 text-sm cursor-pointer hover:underline transition-all duration-100 text-white">
              My Bookings
            </li>
            <li className="hover:scale-105 text-sm cursor-pointer hover:underline transition-all duration-100 text-white">
              Privacy Policy
            </li>

            <li
              className="hover:scale-105 text-sm cursor-pointer hover:underline transition-all duration-100 text-white"
              onClick={() => handleNavigation(contactRef)}
            >
              home
            </li>
          </ul>
        </div>
        <div className="basis-[20%] text-end">
          <img
            src="#"
            alt="profileImage
              "
          />
        </div>
      </div>

      {/* Booking Hero Section */}

      <div className="bg-[#06D6A0FF] px-12 py-4 pb-14">
        <div className="flex">
          <div className="ml-21 sm:ml-[250px] p-4 mt-12">
            <div className="text-xl lg:text-4xl font-bold px-4 tracking-wider text-[#19191FFF]">
              Counseling for Students
            </div>
            <div className="text-sm sm:text-base mt-4 px-4 text-[#19191fff]">
              Securely book your counselling sessions with ease. Your privacy
              and well-being are our top priorities.
            </div>
            <div className="px-4 pt-8">
              <Button variant="sih" size="sm">
                Book Your Session Now
              </Button>
            </div>
          </div>
          <div className="w-[100%]">
            <img src={BookingHeroImage} alt="" className="w-full" />
          </div>
        </div>

        <div className="bg-white flex-col mt-32 max-w-[900px] mx-auto px-12 py-8">
          <div className="flex items-center justify-start gap-4 py-1">
            <div>
              <GiNotebook className="text-cyan-400 text-5xl" />
            </div>
            <div className="text-xl sm:text-3xl font-bold text-[#171A1FFF]">
              Book a New Session
            </div>
          </div>
          <div className="text-[#565D6DFF] text-base tracking-wide py-1">
            Fill out the form below to schedule your confidential counselling
            session.
          </div>
          <div className="mt-10">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Student Id
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 top-1 pl-3 flex items-center pointer-events-none">
                <PiStudentDuotone className="text-lg text-gray-600" />
              </div>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Student Id"
                required
                className="w-full pl-10 pr-3 text-sm outline-none border-none py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-10">
            <label
              htmlFor="counsellor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Counsellor
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 top-1 pl-3 flex items-center pointer-events-none">
                <RiPsychotherapyLine className="text-lg text-gray-600" />
              </div>
              <select
                name="counsellor"
                id="counsellor"
                className="w-full px-10"
              >
                <option value="name1"> name1 </option>
                <option value="name2"> name2 </option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-20 sm:gap-72 mt-10">
            <div className="">
              <div className="flex items-center justify-start gap-2 py-4">
                <div>
                  <BsCalendarDate className="text-[#565D6DFF] text-2xl" />
                </div>
                <div className="font-semibold text-base text-[#171A1FFF]">
                  Select Date
                </div>
              </div>
              <div className="">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-lg w-80 p-4 border text-base shadow-md ring-zinc-600 ring-[0.5px]"
                />
              </div>
            </div>
            <div className="flex-col items-center gap-4">
              <div className="flex items-center">
                <div>
                  <IoIosTimer className="text-2xl" />
                </div>
                <div className="font-semibold text-base text-[#171A1FFF]">
                  Time Slot
                </div>
              </div>
              <div className="py-6">
                <select
                  name="counsellor"
                  id="counsellor"
                  className="px-10 text-left"
                >
                  <option value="name1"> name1 </option>
                  <option value="name2"> name2 </option>
                </select>
              </div>
            </div>
          </div>
          <div className="pt-10 pb-2 text-sm">Additional Notes (Optional)</div>
          <textarea
            name=""
            id=""
            cols={100}
            rows={20}
            className="bg-slate-200 p-2"
          ></textarea>

          <div className="flex items-center gap-2">
            <div>
              <input type="checkbox" name="policy" id="policy" />
            </div>
            <div className="text-[12px]">
              I have read and agree to the{" "}
              <span className="text-indigo-700 cursor-pointer">
                {" "}
                privacy policy
              </span>{" "}
              &nbsp; and confidentiality agreement.
            </div>
          </div>

          <div className="w-full py-4">
            <Button className="w-full" variant="sih">
              Confirm Booking
            </Button>
          </div>
        </div>

        <div className="bg-white flex-col mt-10 max-w-[900px] mx-auto px-12 py-8">
          <div className="flex items-center justify-start gap-4 py-1">
            <div>
              <GrView className="text-cyan-400 text-5xl" />
            </div>
            <div className="text-xl sm:text-3xl font-bold text-[#171A1FFF]">
              Your Existing Bookings
            </div>
          </div>

          <div className="text-sm sm:text-base mt-4 px-4 text-[#19191fff]">
            View, edit, or delete your scheduled counselling sessions.
          </div>

          <div className="py-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Booking Id</TableHead>
                  <TableHead>Counsellor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">3647</TableCell>
                  <TableCell>Manish Pal</TableCell>
                  <TableCell>34 5 66</TableCell>
                  <TableCell className="text-right">Pending</TableCell>
                  <TableCell className="text-right">delete</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
        <div className="h-6 w-full bg-white text-center text-sm">The Vangaurd</div>
    </div>
  );
};

export default Booking;
