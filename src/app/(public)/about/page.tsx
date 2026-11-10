export const metadata = { title: 'About — TechNeeds IGDTUW' };

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <p className="text-cobalt-300 font-mono text-sm tracking-widest uppercase mb-3">Who We Are</p>
        <h1 className="section-heading text-white mb-8">About TechNeeds</h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p>
            TechNeeds is a technical society at Indira Gandhi Delhi Technical University for Women (IGDTUW), Delhi.
            We focus on fostering technical skills, coding proficiency, innovation, and problem-solving among students.
          </p>
          <p>
            Through hackathons, ideathons, workshops, and collaborative events, we create opportunities for students
            to learn, build, and grow together. Our flagship events include InnoVortex and collaborations with
            Innerve, IGDTUW&apos;s annual technical fest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="card">
            <h3 className="font-display text-lg font-semibold text-white mb-2">Mission</h3>
            <p className="text-gray-500 text-sm">To be added by admin</p>
          </div>
          <div className="card">
            <h3 className="font-display text-lg font-semibold text-white mb-2">Vision</h3>
            <p className="text-gray-500 text-sm">To be added by admin</p>
          </div>
          <div className="card">
            <h3 className="font-display text-lg font-semibold text-white mb-2">Values</h3>
            <p className="text-gray-500 text-sm">To be added by admin</p>
          </div>
        </div>

        {/* Team section — P1 */}
        <div className="mt-20">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Our Team</h2>
          <div className="card text-center py-12">
            <p className="text-gray-500">Coming soon — Team profiles will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
