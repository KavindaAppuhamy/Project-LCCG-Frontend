import React from 'react'
import Photo1 from '/public/photo1.jpg'
import Photo2 from '/public/photo2.jpg'
import '../../src/index.css'


const projectComponent = () => {

  const relatedProjects = [
    {
      status: "Upcoming",
      title: "First Project",
      image: Photo1,
      description: "Lorem ipsum dolor sit amet, ut labore et dolore magna aliqua.",
    },
    {
      status: "Upcoming",
      title: "Second Project",
      image: Photo1,
      description: "Lorem ipsum dolor sit amet, ut labore et dolore magna aliqua.",
    },
    {
      status: "Completed",
      title: "Third Project",
      image: Photo1,
      description: "Lorem ipsum dolor sit amet, ut labore et dolore magna aliqua.",
    },
    {
      status: "Completed",
      title: "Fourth Project",
      image: Photo1,
      description: "Lorem ipsum dolor sit amet, ut labore et dolore magna aliqua.",
    },
  ];

  const featuredProject = [{
    status: "Completed",
    title: "Featured Project",
    image: Photo2,
    description: "The engine that gives its mysterious inner life to a work of art must be the subterranean expression of a wish, working its way to the surface of a narrative. Change is an easy panacea. It takes character to stay in one…"
  }];

  return (
    <div className="max-w-full min-h-screen mx-auto px-6 py-12 bg-[var(--color-bg)]">
      <h2 className="text-3xl font-semibold mb-8 text-[var(--color-heading)]">
        Our <span className="text-[var(--color-secheading)] font-bold">Projects</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Featured Project Post */}
        {featuredProject.map((post, index) => (
          <div key={index} className="md:col-span-2">
            <img
              src={post.image}
              alt="Featured"
              className="w-full h-96 object-cover rounded-md"
            />

            <p className="text-xs text-[var(--color-status)] uppercase mt-4">
              {post.status}
            </p>
            <h3 className="text-2xl font-bold mt-2 leading-snug text-[var(--color-heading)]">
              {post.title}
            </h3>
            <p className="text-[var(--color-description)] mt-3 text-sm">
              {post.description}
            </p>

            <div className="mt-4">
              <a href="#" className="text-[var(--color-readmore)] text-sm font-bold inline-flex items-center hover:underline">
                READ MORE <span className="ml-2">→</span>
              </a>
            </div>
          </div>))}

        {/* Right: Related Project Cards */}
        <div className="flex flex-col gap-6">
          {relatedProjects.map((post, index) => (
            <div key={index} className="flex gap-4 items-start">
              <img
                src={post.image}
                alt="Post"
                className="w-32 h-24 object-cover rounded"
              />
              <div>
                <p className="text-xs text-[var(--color-status)] uppercase font-medium mb-2">
                  {post.status}
                </p>
                <h4 className="text-sm font-semibold text-[var(--color-heading)] leading-snug mt-2">
                  {post.title}
                </h4>
                <p className="text-[var(--color-description)] mt-1 text-sm">
                  {post.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default projectComponent
