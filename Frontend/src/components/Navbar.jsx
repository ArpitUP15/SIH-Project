import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="px-8 py-2 flex items-center">
      <div className="flex gap-2 basis-[25%] items-center">
        <div>logo</div>
        <div className="text-[#2589FB] font-bold text-xl">MindEase</div>
      </div>
      <div className="w-full">
        <ul className="list-none flex items-center justify-center gap-8">
          <li className="text-slate-800 text-sm ">Home</li>
          <li className="text-slate-800 text-sm ">Features</li>
          <li className="text-slate-800 text-sm ">Testimonals</li>
          <li className="text-slate-800 text-sm ">How it Works</li>
          <li className="text-slate-800 text-sm ">Contact</li>
        </ul>
      </div>
      <div className='basis-[20%] text-end'>
        <Button variant="sih" size="sm">Login</Button>
      </div>
    </div>
  );
}

export default Navbar
