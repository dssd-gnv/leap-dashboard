import React from "react";

const About = () => {
  return (
    <div className="about-dashboard max-w-5xl mx-auto px-4 py-12 font-poppins">
      <h1 className="text-5xl font-bold mb-4 text-center mb-16">About this Dashboard</h1>

      {/* Grid container for 2x2 boxes */}
      <div className="grid grid-cols-2 gap-8 mb-16">
        {/* Box 1 */}
        <div className="card p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FFFFFF" className="w-8 h-8 text-white rounded-full p-2 mr-2" style={{ backgroundColor: '#386FA3' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            LEAP's Mission
          </h2>
          <p className="text-lg leading-relaxed" style={{color: '#545444'}}>
          The <a href="https://leap-va.org/" className="text-blue-500 underline">Local Energy Alliance Program</a> (LEAP) is a nonprofit organization that delivers energy efficiency solutions in Virginia to make homes safer, healthier, and more affordable while reducing energy usage and mitigating climate change.
          </p>
        </div>

        {/* Box 2 */}
        <div className="card p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FFFFFF" className="w-8 h-8 text-white rounded-full p-2 mr-2" style={{ backgroundColor: '#386FA3' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Data for Good
          </h2>
          <p className="text-lg leading-relaxed" style={{color: '#545444'}}>
            LEAP has partnered with <a href="https://dssdglobal.org/" className="text-blue-500 underline">Data Science for Sustainable Development</a> (DSSD), a nonprofit that provides technical services to social impact organizations. A team of students from the University of Florida developed this dashboard in collaboration with LEAP.
          </p>
        </div>

        {/* Box 3 */}
        <div className="card p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#FFFFFF" className="w-8 h-8 text-white rounded-full p-2 mr-2" style={{ backgroundColor: '#386FA3' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            Dashboard Metrics
          </h2>
          <p className="text-lg leading-relaxed" style={{color: '#545444'}}>
            You can toggle between statewide totals (which is the default option) and household averages. The data on the dashboard are updated each time the dashboard is loaded. 
          </p>
        </div>

        {/* Box 4 */}
        <div className="card p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#FFFFFF" className="w-8 h-8 text-white rounded-full p-2 mr-2" style={{ backgroundColor: '#386FA3' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            Learn More
          </h2>
          <p className="text-lg leading-relaxed" style={{color: '#545444'}}>
            Learn more about LEAP's services by reaching out to <a href='mailto:info@leap-va.org' className="text-blue-500 underline">info@leap-va.org</a>. Learn more about DSSD by reaching out to <a href='mailto:info@leap-va.org' className="text-blue-500 underline">dssd-gainesville@dssdglobal.org</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
