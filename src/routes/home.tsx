import { Container } from "@/components/container";
import { MarqueImg } from "@/components/marquee-img";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col w-full pb-24">
      <Container>
        {/* AISuperpower Heading & Tagline */}
        <div className="my-8">
          <h2 className="text-3xl text-center md:text-left md:text-6xl">
            <span className="text-outline font-extrabold md:text-8xl">
              AISuperpower
            </span>
            <br />
            Practice smarter. Perform better.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-3xl mx-auto md:mx-0">
            AISuperpower is your personal AI interview coach, designed to guide
            you through mock interviews, analyze your responses, and boost your
            confidence — anytime, anywhere.
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col md:flex-row w-full items-center justify-evenly mt-10 md:px-12 md:py-8">
          <p className="text-3xl font-semibold text-gray-900 text-center md:text-left">
            250k+
            <span className="block text-xl text-muted-foreground font-normal">
              Offers Received
            </span>
          </p>

          <p className="text-3xl font-semibold text-gray-900 text-center md:text-left mt-6 md:mt-0">
            1.2M+
            <span className="block text-xl text-muted-foreground font-normal">
              Interviews Aced
            </span>
          </p>
        </div>
      </Container>

      {/* Hero Image Section */}
      <div className="w-full mt-10 rounded-xl bg-gray-100 h-[420px] drop-shadow-md relative overflow-hidden">
        <img
          src="/assets/img/hero.jpg"
          alt="Interview AI"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 left-4 px-4 py-2 rounded-md bg-white text-sm font-medium">
          Interviews Copilot &copy;
        </div>

        <div className="hidden md:block absolute w-80 bottom-4 right-4 px-4">
          <h2 className="text-neutral-800 font-semibold">Developer</h2>
          <p className="text-sm text-neutral-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
            distinctio natus, quos voluptatibus magni sapiente.
          </p>

          <Button className="mt-3">
            Generate <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full my-10">
        <Marquee pauseOnHover speed={40} gradient={false}>
          <MarqueImg img="/assets/img/logo/firebase.png" />
          <MarqueImg img="/assets/img/logo/meet.png" />
          <MarqueImg img="/assets/img/logo/zoom.png" />
          <MarqueImg img="/assets/img/logo/microsoft.png" />
          <MarqueImg img="/assets/img/logo/tailwindcss.png" />
          <MarqueImg img="/assets/img/logo/microsoft.png" />
        </Marquee>
      </div>

      {/* AI Insights Section */}
      <Container className="py-8 space-y-8">
        <h2 className="tracking-wide text-xl text-gray-800 font-semibold">
          Unleash your potential with personalized AI insights and targeted
          interview practice.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="col-span-1 md:col-span-3">
            <img
              src="/assets/img/office.jpg"
              alt=""
              className="w-full max-h-96 rounded-md object-cover"
            />
          </div>

          <div className="col-span-1 md:col-span-2 gap-8 max-h-96 min-h-96 w-full">
            <p className="text-center text-muted-foreground">
              Transform the way you prepare, gain confidence, and boost your
              chances of landing your dream job. Let AI be your edge in today’s
              competitive job market.
            </p>

            <Link to="/generate" className="w-full flex justify-center mt-4">
              <Button className="w-3/4">
                Generate <Sparkles className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
