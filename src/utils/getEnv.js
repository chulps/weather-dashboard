export default function getEnv() {
    switch (window.location.origin) {
        case 'http://localhost:3000':
            return 'development';
        case 'https://chulps.github.io':
            return 'production';
        default:
            return 'development';
    }
}