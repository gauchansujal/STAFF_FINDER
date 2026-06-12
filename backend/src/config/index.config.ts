export const jwtConfig = {
    secret : process.env.JWT_SECRET || "secret",
    exp:"7d",
}
export const adminconfig = {
    name: process.env.ADMIN_NAME || "admin",
    email: process.env.ADMIN_EMAIL || "",
    password: process.env.ADMIN_PASSWORD || "",
}