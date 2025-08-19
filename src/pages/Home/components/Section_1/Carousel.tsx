const images = "https://vietnambusinessinsider.vn/uploads/images/2024/04/18/can-canh-14-ga-tuyen-metro-so-1-voi-chieu-dai-197km-bat-dau-tu-ga-trung-tam-ben-thanh-den-suoi-tien-1713409234.jpeg"

export default function Carousel() {
  return (
    <div className="w-full mx-auto h-120">
      <img className="lg:w-full lg:h-full h-0 w-0" src={images} alt="Train image"/>
    </div>
  );
}
