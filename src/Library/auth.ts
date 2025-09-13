"use server"

export async function login(email: string, password: string) 
{
    // 1. Validate Input
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }

    // 2. Authenticate User
}