import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 * -----------
 * Scrolls the window back to the top whenever the route (pathname) changes,
 * and also on initial mount, which covers page load / refresh / direct URL.
 *
 * It also opts the browser out of automatic scroll restoration so a reload
 * never re-lands the visitor mid-page.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Disable the browser's built-in scroll restoration once so refreshes
        // always start from the top instead of restoring the old offset.
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        // Jump straight to the top (no smooth animation) on every route change
        // and on the first render after a page load / refresh.
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname]);

    return null;
}
