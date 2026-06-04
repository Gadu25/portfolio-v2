export const useProfile = () => {
  const config = useRuntimeConfig();
  const baseUrl = `${config.public.megomeUrl}/public/v1`;

  const getProfile = () => {
    return fetch(`${baseUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${config.public.megomeAccessKey}`,
      },
    })
  }

  return {
    getProfile,
  }
}