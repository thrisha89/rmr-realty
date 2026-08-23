import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";
import ChatbotWidget from "./ChatbotWidget.jsx";
import EntryExperience from "./EntryExperience.jsx";
import ScrollProgress from "./ScrollProgress.jsx";
import PageTransition from "./PageTransition.jsx";

export default function PublicLayout() {
  const footerRef = useRef(null);
  const [footerInView, setFooterInView] = useState(false);

  // The WhatsApp and chat buttons are fixed to the viewport corners, so
  // without this they end up floating on top of the footer's text once
  // the user scrolls all the way down. Fading them out as soon as the
  // footer appears keeps the footer clean and legible.
  useEffect(() => {
    const node = footerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <EntryExperience />
      <Header />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer ref={footerRef} />
      <WhatsAppButton hidden={footerInView} />
      <ChatbotWidget hidden={footerInView} />
    </div>
  );
}
