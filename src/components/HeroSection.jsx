import Button from "../common/Button";

function HeroSection() {
  return (
    <section className="w-full px-4 py-12 md:px-32 md:py-20 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6 gap-4 md:gap-12 md:flex md:w-full md:items-center">
          
          <div className="flex flex-col items-end text-center md:justify-center gap-4">
            <div className="flex flex-col items-center sm:items-end">
              <h1
                className="text-headline-2 text-brown-600 font-sans font-weight-headline md:hidden"
                style={{
                  lineHeight: 1,
                  paddingTop: "3px",
                  paddingBottom: "3px",
                  verticalAlign: "baseline"
                }}
              >
                Stay Informed, Stay Inspired
              </h1>
              <h1
                className="hidden sm:block text-headline-2 sm:w-full text-brown-600 font-sans font-weight-headline text-right"
                style={{
                  lineHeight: 1.25,
                  paddingTop: "3px",
                  paddingBottom: "3px",
                  verticalAlign: "baseline"
                }}
              >
                Stay<br /> Informed,<br /> Stay Inspired
              </h1>
            </div>
            <p className="text-body-1 text-brown-400 max-w-2xl font-weight-body leading-relaxed font-sans md:text-right">
              Discover a World of Knowledge at Your Fingertips. Your Daily Dose of Inspiration and Information.
            </p>
          </div>
          
          <img
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt="Hero"
            className="w-full h-[470px] rounded-[16px] object-cover mx-auto md:w-[386px] md:h-[529px]"
          />
          
          <div className="md:flex md:flex-col md:justify-center">
            <h1 className="text-body-2 text-brown-400 leading-relaxed font-sans font-weight-headline">
              -Author
            </h1>
            <p className="text-headline-3 text-brown-500 max-w-2xl font-weight-body leading-relaxed font-sans">
              Thompson P.
            </p>
            <div className="flex flex-col gap-4">
              <p className="text-body-1 text-brown-400 max-w-2xl font-weight-body leading-relaxed font-sans">
                I am a pet enthusiast and freelance writer who specializes in animal behavior and care. With a deep love for cats, I enjoy sharing insights on feline companionship and wellness.
              </p>
              <p className="text-body-1 text-brown-400 max-w-2xl font-weight-body leading-relaxed font-sans">
                When i'm not writing, I spends time volunteering at my local animal shelter, helping cats find loving homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;