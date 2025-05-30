const images = "https://png.pngtree.com/png-vector/20191214/ourmid/pngtree-vector-illustration-of-white-metro-train-png-image_2074332.jpg"

export default function Carousel() {
  return (
    <div className="w-full mx-auto mt-10">
      <img className="w-[600px] lg:min-w-[600px] md:min-w-[380px]" src={images} alt="Train image"/>
    </div>
  );
}
