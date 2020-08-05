export const appendBaseURL = (path: string) => {
    if (process.env.NODE_ENV === 'development') {
        return `/${path}`;
    } else {
        return `${path}.html`;
    }
};
