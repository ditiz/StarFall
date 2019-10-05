export const getCookie = (cookie: string) =>
    document.cookie
        .split(";")
        .filter(cookie => cookie.indexOf(cookie) >= 0)[0]
        .split("=")[1];
