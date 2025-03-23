import supabase from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";


interface AuthContextType {
    user: User | null;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    token: string | null;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    signInWithGoogle: async () => { },
    signOut: async () => { },
    token: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setToken(session?.access_token ?? null)
        });

        // Listen for changes on auth state
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                // redirectTo: "http://localhost:5173/auth/callback",
                redirectTo: window.location.origin
            },
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ token, user, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
