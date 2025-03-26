/**
 * route argument must start with "/"
 * @param route
 * @returns
 */
export function api(route: string) {
  return import.meta.env.VITE_API_URL + route;
}
