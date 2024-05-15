// This function determines the environment based on the current window.location.origin
export default function getEnv() {
  // Check the origin of the current window location
  switch (window.location.origin) {
    // If the origin is http://localhost:3000, return 'development'
    case "http://localhost:3000":
      return "development";
    // If the origin is https://chulps.github.io, return 'production'
    case "https://chulps.github.io":
      return "production";
    // If the origin doesn't match any of the above cases, return 'development' as a default
    default:
      return "development";
  }
}
