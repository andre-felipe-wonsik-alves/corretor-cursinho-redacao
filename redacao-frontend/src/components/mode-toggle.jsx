import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            className="border px-3 py-1 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            {resolvedTheme === "dark" ? "🌙 Modo Escuro" : "☀️ Modo Claro"}
        </button>
    );
}
