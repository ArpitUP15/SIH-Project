import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import resourceHubMainImage from "../assets/images/resourceHubMainImage.png";
import { useNavigate } from "react-router-dom";
import sampleThumbnail from "../assets/images/sampleThubnail.png";
import { FaPlayCircle } from "react-icons/fa";
import { MdAir } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";

const ResourceHub = () => {
  const navigate = useNavigate();
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [showAllAudios, setShowAllAudios] = useState(false);
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [loadingAudios, setLoadingAudios] = useState(true);

  // Filtered videos based on search
  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/videos/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingVideos(false);
      }
    };

    const fetchAudios = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/audios/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch audios");
        const data = await res.json();
        setAudios(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingAudios(false);
      }
    };

    fetchVideos();
    fetchAudios();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center bg-slate-100 gap-4 sm:gap-0">
        <div className="flex gap-2 items-center justify-center sm:basis-[25%]">
          <div>logo</div>
          <div className="text-[#2589FB] font-bold text-xl">MindEase</div>
        </div>

        <div className="w-full">
          <ul className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <li
              className="cursor-pointer hover:underline hover:scale-105 transition"
              onClick={() => navigate("/")}
            >
              Go Back To Home
            </li>
          </ul>
        </div>

        <div className="flex justify-center sm:justify-end sm:basis-[20%]">
          <Button
            variant="sih"
            size="sm"
            className="active:scale-[0.95] transition duration-150"
            onClick={() => navigate("/authenticate/login")}
          >
            Login
          </Button>
        </div>
      </div>
      {/* Hero Section */}
      <div
        className="relative w-full min-h-[85vh] bg-cover bg-center px-6"
        style={{ backgroundImage: `url(${resourceHubMainImage})` }}
      >
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative flex justify-end items-start pt-12 pr-24">
          <div className="max-w-xl text-left">
            <h1 className="font-bold text-zinc-800 text-2xl sm:text-3xl lg:text-4xl tracking-wide leading-snug">
              Cultivate Inner Peace & Growth with{" "}
              <span className="text-blue-400">MindEase</span>
            </h1>
            <p className="mt-4 text-gray-800 text-sm sm:text-base font-medium leading-relaxed">
              Explore a curated collection of psychoeducational resources
              designed to support your mental well-being journey. Discover tools
              for motivation, relaxation, and cognitive exercises.
            </p>

            <div className="flex items-center justify-center mt-10">
              <button className="mt-6 text-white rounded-full px-2 py-1 mx-auto text-sm sm:px-4 sm:py-1 bg-blue-500 hover:bg-blue-600 transition shadow-lg">
                Explore Resources
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Video Section */}
      <div className="py-6 bg-cyan-50">
        <h1 className="sm:text-3xl pb-10 text-xl text-black font-bold text-center">
          Motivational Videos
        </h1>

        <div className="relative max-w-[1100px] mx-auto min-h-[200px]">
          {loadingVideos ? (
            <div className="w-full flex justify-center gap-4 mb-6 px-6">
              <Skeleton className="h-[120px] w-[300px] rounded-md" />
              <Skeleton className="h-[120px] w-[300px] rounded-md" />
              <Skeleton className="h-[120px] w-[300px] rounded-md" />
            </div>
          ) : !showAllVideos ? (
            <div className="flex items-center justify-start gap-6 overflow-x-auto">
              {videos.slice(0, 3).map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div>
              {/* Search Bar */}
              <div className="w-full flex justify-center mb-6 px-6">
                <input
                  type="text"
                  placeholder="Search Videos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Videos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-h-[400px] overflow-y-auto">
                {filteredVideos.length > 0 ? (
                  filteredVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">
                    No videos found.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <div className="w-fit mx-auto mt-6">
            <Button
              className="mx-auto"
              variant="outline"
              size="sm"
              onClick={() => setShowAllVideos(!showAllVideos)}
            >
              {showAllVideos ? "Show Less" : "See All"}
            </Button>
          </div>
        </div>
      </div>
      {/* Audio Section */}
      <div className="py-6 bg-cyan-50">
        <h1 className="sm:text-3xl pb-10 text-xl text-black font-bold text-center">
          Relaxation Sounds
        </h1>

        <div className="relative max-w-[1100px] mx-auto min-h-[200px]">
          {loadingAudios ? (
            <div className="w-full flex justify-center gap-4 mb-6 px-6">
              <Skeleton className="h-[120px] w-[300px] rounded-md" />
              <Skeleton className="h-[120px] w-[300px] rounded-md" />
              <Skeleton className="h-[120px] w-[300px] rounded-md" />
            </div>
          ) : !showAllAudios ? (
            <div className="flex items-center justify-start gap-6 overflow-x-auto">
              {audios.slice(0, 3).map((audio) => (
                <AudioCard key={audio.id} audio={audio} />
              ))}
            </div>
          ) : (
            <div>
              {/* Search Bar */}
              <div className="w-full flex justify-center mb-6 px-6">
                <input
                  type="text"
                  placeholder="Search Audios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Audio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-h-[400px] overflow-y-auto">
                {audios.length > 0 ? (
                  audios.map((audio) => (
                    <AudioCard key={audio.id} audio={audio} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">
                    No audios found.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <div className="w-fit mx-auto mt-6">
            <Button
              className="mx-auto"
              variant="outline"
              size="sm"
              onClick={() => setShowAllAudios(!showAllAudios)}
            >
              {showAllAudios ? "Show Less" : "See All"}
            </Button>
          </div>
        </div>
      </div>
      {/* Mental Exercise Section */}
      <div className="bg-cyan-50 pt-4">
        <h1 className="sm:text-3xl pb-10 text-xl text-black font-bold text-center">
          Exercises
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1080px] mx-auto px-4">
          {/* Card 1 */}
          <div className="flex flex-col p-4 shadow-md rounded-md bg-white">
            <p className="pt-2">
              <MdAir className="text-4xl text-blue-500" />
            </p>
            <h1 className="font-bold py-2 text-lg text-black">
              Deep Breathing Guide
            </h1>
            <p className="font-semibold text-sm text-gray-600">
              Practice controlled breathing techniques to calm your nervous
              system.
            </p>
            <p className="text-blue-600 font-semibold text-sm mt-6 cursor-pointer hover:underline">
              Start Exercise
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col p-4 shadow-md rounded-md bg-white">
            <p className="pt-2">
              <MdAir className="text-4xl text-blue-500" />
            </p>
            <h1 className="font-bold py-2 text-lg text-black">
              Mindful Relaxation
            </h1>
            <p className="font-semibold text-sm text-gray-600">
              Simple mindfulness techniques to release stress and stay present.
            </p>
            <p className="text-blue-600 font-semibold text-sm mt-6 cursor-pointer hover:underline">
              Start Exercise
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col p-4 shadow-md rounded-md bg-white">
            <p className="pt-2">
              <MdAir className="text-4xl text-blue-500" />
            </p>
            <h1 className="font-bold py-2 text-lg text-black">Focus Booster</h1>
            <p className="font-semibold text-sm text-gray-600">
              Train your focus with short, effective exercises for clarity.
            </p>
            <p className="text-blue-600 font-semibold text-sm mt-6 cursor-pointer hover:underline">
              Start Exercise
            </p>
          </div>

          {/* Card 4 */}
          <div className="flex flex-col p-4 shadow-md rounded-md bg-white">
            <p className="pt-2">
              <MdAir className="text-4xl text-blue-500" />
            </p>
            <h1 className="font-bold py-2 text-lg text-black">
              Sleep Improvement
            </h1>
            <p className="font-semibold text-sm text-gray-600">
              Gentle routines to improve your sleep quality and relaxation.
            </p>
            <p className="text-blue-600 font-semibold text-sm mt-6 cursor-pointer hover:underline">
              Start Exercise
            </p>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

// Video Card Component
const VideoCard = ({ video }) => (
  <div className="min-w-[300px] bg-white rounded-md shadow-md overflow-hidden">
    <div className="relative w-full group">
      <img
        src={video.thumbnail || sampleThumbnail}
        alt={video.title}
        className="w-full h-[25vh] object-cover"
      />
      <FaPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-white opacity-0 group-hover:opacity-100 transition" />
    </div>
    <div className="px-4 py-3">
      <p className="bg-white top-2 right-2 absolute backdrop-blur-2xl text-sm px-2 rounded-full shadow">
        {video.duration}
      </p>
      <h1 className="text-black text-base font-bold">{video.title}</h1>
      <p className="text-gray-600 my-2 text-sm">{video.description}</p>
      <button className="ring-2 ring-cyan-600 text-cyan-600 rounded-sm px-2 py-1 text-xs">
        Watch Now
      </button>
    </div>
  </div>
);

// Audio Card Component
const AudioCard = ({ audio }) => (
  <div className="min-w-[300px] bg-white rounded-md shadow-md overflow-hidden">
    <div className="relative w-full group">
      <img
        src={audio.thumbnail || sampleThumbnail}
        alt={audio.title}
        className="w-full h-[25vh] object-cover"
      />
      <FaPlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-white opacity-0 group-hover:opacity-100 transition" />
    </div>
    <div className="px-4 py-3">
      <p className="bg-white top-2 right-2 absolute backdrop-blur-2xl text-sm px-2 rounded-full shadow">
        {audio.duration}
      </p>
      <h1 className="text-black text-base font-bold">{audio.title}</h1>
      <p className="text-gray-600 my-2 text-sm">{audio.description}</p>
      <button className="ring-2 ring-cyan-600 text-cyan-600 rounded-sm px-2 py-1 text-xs">
        Listen Now
      </button>
    </div>
  </div>
);

export default ResourceHub;
