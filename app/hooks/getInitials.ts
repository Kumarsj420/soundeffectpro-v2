const getInitials = (name: string): string => {
    return name
        .split(' ')
        .slice(0, 1)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
};

export default getInitials;