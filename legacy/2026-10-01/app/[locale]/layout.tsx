import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { SiteHeader, SiteFooter } from "@/components/sections/site-shell";
import { PublicChatbot } from "@/components/chatbot/public-chatbot";
import { AnalyticsInit } from "@/components/analytics-init";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return {
    title: {
      default: `AIO에이전시 | ${t("headline")}`,
      template: "%s | AIO에이전시",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AnalyticsInit />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <PublicChatbot locale={locale} />
    </NextIntlClientProvider>
  );
}
