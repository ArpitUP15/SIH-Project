import React from 'react'
import { Button } from "@/components/ui/button";

const FinalCtaPage = () => {
  return (
    <div className='py-10'>
      <h1 className="font-bold text-white text-center text-4xl tracking-wider mt-[5rem]">
        Ready to Prioritize Your Well-being?
      </h1>
      <p className="mx-auto text-slate-100 px-10 max-w-[600px] text-center mt-[1rem] tracking-tight">
        Join the MindSet community today and access the support you deserve for
        a balanced and successful student life.
      </p>

      <div className="mt-[2rem] mx-auto flex items-center justify-center">
                <Button variant="sih" size="default" className="px-3">
                  Get Started with MindSet
                </Button>
              </div>
    </div>
  );
}

export default FinalCtaPage
