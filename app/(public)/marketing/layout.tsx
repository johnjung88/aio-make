import "@/components/marketing/marketing.css";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="marketing-renewal">{children}</div>;
}
