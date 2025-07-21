import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from "../locales/en/home.json";
import PRODUCT_EN from "../locales/en/product.json";
import HOME_VI from "../locales/vi/home.json";
import PRODUCT_VI from "../locales/vi/product.json";

// header
import HEADER_EN from "../locales/en/header.json";
import HEADER_VI from "../locales/vi/header.json";

// blog
import BLOG_EN from "../locales/en/blog.json";
import BLOG_VI from "../locales/vi/blog.json";

// blog management
import BLOG_MANAGEMENT_EN from "../locales/en/blogManagement.json";
import BLOG_MANAGEMENT_VI from "../locales/vi/blogManagement.json";

// footer
import FOOTER_EN from "../locales/en/footer.json";
import FOOTER_VI from "../locales/vi/footer.json";

// route management
import ROUTE_MANAGEMENT_EN from "../locales/en/routeManagement.json";
import ROUTE_MANAGEMENT_VI from "../locales/vi/routeManagement.json";

// station management
import STATION_MANAGEMENT_EN from "../locales/en/stationManagement.json";
import STATION_MANAGEMENT_VI from "../locales/vi/stationManagement.json";

// station route management
import STATION_ROUTE_MANAGEMENT_EN from "../locales/en/stationRouteManagement.json";
import STATION_ROUTE_MANAGEMENT_VI from "../locales/vi/stationRouteManagement.json";

// metro map
import METRO_MAP_EN from "../locales/en/metroMap.json";
import METRO_MAP_VI from "../locales/vi/metroMap.json";

// my tickets
import MY_TICKETS_EN from "../locales/en/myTickets.json";
import MY_TICKETS_VI from "../locales/vi/myTickets.json";

// order
import ORDER_EN from "../locales/en/order.json";
import ORDER_VI from "../locales/vi/order.json";

// payment success
import PAYMENT_SUCCESS_EN from "../locales/en/paymentSuccess.json";
import PAYMENT_SUCCESS_VI from "../locales/vi/paymentSuccess.json";

// buy ticket
import BUY_TICKET_EN from "../locales/en/buyTicket.json";
import BUY_TICKET_VI from "../locales/vi/buyTicket.json";

export const locales = {
  en: "English",
  vi: "Tiếng Việt",
} as const;

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN,
    header: HEADER_EN,
    blog: BLOG_EN,
    blogManagement: BLOG_MANAGEMENT_EN,
    footer: FOOTER_EN,
    routeManagement: ROUTE_MANAGEMENT_EN,
    stationManagement: STATION_MANAGEMENT_EN,
    stationRouteManagement: STATION_ROUTE_MANAGEMENT_EN,
    metroMap: METRO_MAP_EN,
    myTickets: MY_TICKETS_EN,
    order: ORDER_EN,
    paymentSuccess: PAYMENT_SUCCESS_EN,
    buyTicket: BUY_TICKET_EN,
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    header: HEADER_VI,
    blog: BLOG_VI,
    blogManagement: BLOG_MANAGEMENT_VI,
    footer: FOOTER_VI,
    routeManagement: ROUTE_MANAGEMENT_VI,
    stationManagement: STATION_MANAGEMENT_VI,
    stationRouteManagement: STATION_ROUTE_MANAGEMENT_VI,
    metroMap: METRO_MAP_VI,
    myTickets: MY_TICKETS_VI,
    order: ORDER_VI,
    paymentSuccess: PAYMENT_SUCCESS_VI,
    buyTicket: BUY_TICKET_VI,
  },
} as const;

export const defaultNS = "product";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "vi",
    ns: [
      "home", 
      "product", 
      "header", 
      "blog", 
      "blogManagement", 
      "footer",
      "routeManagement",
      "stationManagement", 
      "stationRouteManagement",
      "metroMap",
      "myTickets",
      "order",
      "paymentSuccess",
      "buyTicket"
    ],
    fallbackLng: "vi",
    defaultNS,
    debug: true, // Enable debug mode to see what's happening
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: true, // Enable suspense mode
    },
  });
}

export default i18n;
