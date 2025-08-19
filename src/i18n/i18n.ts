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
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    header: HEADER_VI,
    blog: BLOG_VI,
    blogManagement: BLOG_MANAGEMENT_VI,
    footer: FOOTER_VI,
  },
} as const;

export const defaultNS = "product";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "vi",
    ns: ["home", "product", "header", "blog", "blogManagement", "footer"],
    fallbackLng: "vi",
    defaultNS,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });
}

export default i18n;
