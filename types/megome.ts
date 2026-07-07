export type Profile = {
  id: number
  userId: number
  firstName: string
  lastName: string
  title: string
  birthday: string | null
  tagline: string
  bio: string
  phone: string
  website: string
  location: string
  profileImage: string
  createdAt: string
  updatedAt: string
}

export type Skill = {
  id: number
  userId: number
  skillName: string
  proficiency: string
  createdAt: string
  updatedAt: string
}

export type Education = {
  id: number
  userId: number
  school: string
  description: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string | null
  isPresent: boolean
  createdAt: string
  updatedAt: string
}

export type Technology = {
  id: number
  createdByUserId: number | null
  name: string
  slug: string
  category: string
  isVerified: string
  createdAt: string
  updatedAt: string | null
}

export type Experience = {
  id: number
  userId: number
  title: string
  company: string
  logo: string | null
  startDate: string
  endDate: string | null
  isPresent: boolean
  description: string
  technologies: Technology[]
  createdAt: string
  updatedAt: string
}

export type Certification = {
  id: number
  userId: number
  title: string
  issuer: string
  issueDate: string
  certificateImage: string | null
  expirationDate: string | null
  credentialId: string | null
  credentialUrl: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectImages = {
  cover: string | null
  screenshots: string[]
}

export type Project = {
  id: number
  userId: number
  title: string
  description: string
  link: string
  githubLink: string
  status: string
  isDraft: boolean
  createdAt: string
  updatedAt: string | null
}

export type ProjectFull = Project & {
  images: ProjectImages
  technologies: Technology[]
}
