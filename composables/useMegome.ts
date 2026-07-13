import type { Profile, Skill, Education, Experience, Certification, ProjectFull } from '~/types/megome'

export const useMegome = () => {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.megomeUrl}/public/v1`
  const accessKey = config.public.megomeAccessKey

  const headers = (): HeadersInit => ({
    Authorization: `Bearer ${accessKey}`,
  })

  const getProfile = async (): Promise<Profile> => {
    const res = await fetch(`${baseUrl}/profile`, { headers: headers() })
    const json = await res.json()
    return json.data as Profile
  }

  const getSkills = async (): Promise<Skill[]> => {
    const res = await fetch(`${baseUrl}/skill`, { headers: headers() })
    const json = await res.json()
    return json.skills as Skill[]
  }

  const getEducations = async (): Promise<Education[]> => {
    const res = await fetch(`${baseUrl}/education`, { headers: headers() })
    const json = await res.json()
    return json.educations as Education[]
  }

  const getExperiences = async (): Promise<Experience[]> => {
    const res = await fetch(`${baseUrl}/experience`, { headers: headers() })
    const json = await res.json()
    return json.experiences as Experience[]
  }

  const getCertificates = async (): Promise<Certification[]> => {
    const res = await fetch(`${baseUrl}/certification`, { headers: headers() })
    const json = await res.json()
    return json.certificates as Certification[]
  }

  const getProjects = async (): Promise<ProjectFull[]> => {
    const res = await fetch(`${baseUrl}/project`, { headers: headers() })
    const json = await res.json()
    return json.projects as ProjectFull[]
  }

  const getProjectById = async (id: number): Promise<ProjectFull> => {
    const res = await fetch(`${baseUrl}/project/${id}`, { headers: headers() })
    const json = await res.json()
    return json.project as ProjectFull
  }

  const getExperienceById = async (id: number): Promise<Experience> => {
    const res = await fetch(`${baseUrl}/experience/${id}`, { headers: headers() })
    const json = await res.json()
    return json.experience as Experience
  }

  const getCertificateById = async (id: number): Promise<Certification> => {
    const res = await fetch(`${baseUrl}/certification/${id}`, { headers: headers() })
    const json = await res.json()
    return json.certificate as Certification
  }

  return {
    getProfile,
    getSkills,
    getEducations,
    getExperiences,
    getCertificates,
    getProjects,
    getProjectById,
    getExperienceById,
    getCertificateById,
  }
}
