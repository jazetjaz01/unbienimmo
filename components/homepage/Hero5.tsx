const features = [
  {
    title: "Maisons",
    description:
      "Optimized for speed with minimal loading times and instant interactions.",
   image: "/home-page/estimations/estimation2.png",
   
  },
  {
    title: "Appartements",
    description: "Tailor every component to match your brand or workflow.",
    image: "/home-page/estimations/estimation1.png",
  },
  {
    title: "Terrains",
    description: "Built with clean, modern code and best practices in mind.",
    image: "/home-page/estimations/estimation3.png",
  },
  {
    title: "Bureaux",
    description:
      "Every component is designed to look great on all screen sizes.",
    image: "/home-page/estimations/estimation4.png",
  },
  {
    title: "Locaux commerciaux",
    description: "Built with accessibility best practices in mind.",
   image: "/home-page/estimations/estimation5.png",
  },
  {
    title: "Fonds de commerce",
    description: "Easily connect with your favorite tools, APIs, and services.",
   image: "/home-page/estimations/estimation6.png",
  },
];

const Hero5 = () => {
  return (
    <div className="mx-auto flex max-w-450 flex-col  py-4 ">
     <h2 className="text-4xl md:text-5xl font-medium text-center text-slate-900 mb-10 tracking-tight">
        Nos estimations
      </h2>
      

      <div className="mx-auto mt-16 grid max-w-450 grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-6">
        {features.map((feature, index) => (
          <div
            className="relative rounded-lg border border-border/80"
            key={index}
          >
            <div className="mask-b-from-50% dark:mask-b-from-40% aspect-4/5 w-full rounded-t-lg">
              <img
                alt=""
                className="size-full rounded-t-lg object-cover"
                src={feature.image}
              />
            </div>

            <div className="mask-t-from-50% absolute inset-x-0 bottom-0 rounded-b-lg bg-background/80 p-6 pt-20">
              <h3 className="font-medium text-xl tracking-[-0.005em]">
                {feature.title}
              </h3>
             {/* <p className="mt-2 text-foreground/80 text-lg">
                {feature.description}
              </p>*/}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero5;
