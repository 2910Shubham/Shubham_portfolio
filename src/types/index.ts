export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link?: string | null;
  details: {
    overview: string;
    features: string[];
    technologies: string[];
    content: string;
  };
};
