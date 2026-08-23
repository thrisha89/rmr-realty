import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Replays a soft fade + rise every time the route changes, so navigating
// between pages feels like one continuous, considered motion instead of
// an abrupt content swap. Keyed by pathname so React remounts (and thus
// re-triggers) the animation on every navigation.
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <div key={key} className="page-transition-enter">
      {children}
    </div>
  );
}
