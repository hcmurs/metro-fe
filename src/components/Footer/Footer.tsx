import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");

  return (
    <div className="bg-[#234047] text-white py-16 px-4 sm:px-10 lg:px-20 ">
      <div className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-10">
        {t("brandName")}
      </div>

      {/* Grid 4 cột */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14 text-sm mb-20">
        <div>
          <h3 className="text-lg font-bold mb-4">
            {t("sections.metroServices.title")}
          </h3>
          <ul className="space-y-2">
            <li>{t("sections.metroServices.items.home")}</li>
            <li>{t("sections.metroServices.items.stationsMap")}</li>
            <li>{t("sections.metroServices.items.fareCalculator")}</li>
            <li>{t("sections.metroServices.items.buyTickets")}</li>
            <li>{t("sections.metroServices.items.timetable")}</li>
            <li>{t("sections.metroServices.items.support")}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">
            {t("sections.exploreLines.title")}
          </h3>
          <ul className="space-y-2">
            <li>{t("sections.exploreLines.items.line1")}</li>
            <li>{t("sections.exploreLines.items.line2")}</li>
            <li>{t("sections.exploreLines.items.line3")}</li>
            <li>{t("sections.exploreLines.items.line4")}</li>
            <li>{t("sections.exploreLines.items.futureExtensions")}</li>
            <li>{t("sections.exploreLines.items.stationGuide")}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">
            {t("sections.customerCare.title")}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <Phone
              className="bg-white text-[#234047] p-1 rounded-full"
              size={24}
            />
            <span>{t("sections.customerCare.phone")}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail
              className="bg-white text-[#234047] p-1 rounded-full"
              size={24}
            />
            <span>{t("sections.customerCare.email")}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4">
            {t("sections.connectWithUs.title")}
          </h3>
          <p className="mb-4">{t("sections.connectWithUs.subtitle")}</p>
          <div className="flex gap-3 flex-wrap">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <div
                key={i}
                className="bg-white text-[#234047] w-10 h-10 flex items-center justify-center rounded-full"
              >
                <Icon size={20} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email subscribe */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
        <input
          type="email"
          placeholder={t("emailSubscribe.placeholder")}
          className="rounded-full px-6 py-3 w-full md:w-[500px] lg:w-[800px] text-black bg-white"
        />
        <button className="bg-orange-600 text-white font-semibold px-10 py-3 rounded-full hover:bg-orange-700 w-full md:w-auto">
          {t("emailSubscribe.button")}
        </button>
      </div>

      <p className="text-center text-xs sm:text-sm text-white">
        {t("copyright")}
      </p>
    </div>
  );
}
