import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "FinWord - 금융 용어 학습 서비스",
  description: "금융 뉴스를 읽으며 금융 용어를 학습하세요",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
