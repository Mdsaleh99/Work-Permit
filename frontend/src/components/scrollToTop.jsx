import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export default function ScrollToTop() {
    const { location } = useRouterState();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]); // scroll on path change

    return null;
}

// useRouterState() gives you access to the current router state (including location.pathname).
// When the path changes, the useEffect hook triggers and scrolls the window to the top.
