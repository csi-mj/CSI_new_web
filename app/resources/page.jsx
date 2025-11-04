import React from "react";
import ResourceCard from "./components/resourcecard";

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 px-8 pb-40 sm:pb-48">
      {/* Header Section */}
      <section className="text-center mb-16 pt-12 pb-10">
        <h1 className="font-silkscreen text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-lg mt-8 text-center">
           Resources
        </h1>
        <p
          className="font-silkscreen mt-6 text-lg max-w-2xl mx-auto"
          style={{ color: "#d40924" }}
        >
          Explore curated resources from all our tech domains. Click a card to dive in!
        </p>
        <div className="mt-10 sm:mt-12 w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full" />
      </section>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <ResourceCard
          title="Tech Foundations"
          pdfUrl="/pdfs/basic-tech.pdf"
          imageUrl="/images/basic-img.jpg"
          description="Get started with essential tools and workflows — learn VS Code, Git, GitHub, and how to kickstart your own projects from scratch."
        />
        <ResourceCard
          title="Web Development"
          pdfUrl="/pdfs/web-dev.pdf"
          imageUrl="/images/web-dev-img.jpeg"
          description="Build stunning websites and apps with HTML, CSS, JS, and modern frameworks"
        />
        <ResourceCard
          title="App Development"
          pdfUrl="/pdfs/app-dev.pdf"
          imageUrl="/images/app-dev-img.jpeg"
          description="Create mobile experiences for Android, iOS, and cross-platform apps."
        />
        <ResourceCard
          title="AI/ML"
          pdfUrl="/pdfs/aiml.pdf"
          imageUrl="/images/aiml-img.jpeg"
          description="Explore machine learning, neural networks, and smart data solutions."
        />
        <ResourceCard
          title="IoT"
          pdfUrl="/pdfs/iot.pdf"
          imageUrl="/images/iot-img.jpeg"
          description="Connect devices, sensors, and the world around you with IoT technologies."
        />
        <ResourceCard
          title="Blockchain"
          pdfUrl="/pdfs/blockchain.pdf"
          imageUrl="/images/block-chain-img.jpeg"
          description="Dive into decentralized tech, cryptocurrencies, and smart contracts."
        />
        <ResourceCard
          title="Cloud Computing"
          pdfUrl="/pdfs/cloud.pdf"
          imageUrl="/images/cloud-img.jpeg"
          description="Learn cloud platforms, deployment, and scalable infrastructure."
        />
        <ResourceCard
          title="Cyber Security"
          pdfUrl="/pdfs/cybersec.pdf"
          imageUrl="/images/cyber-sec-img.jpeg"
          description="Protect networks, systems, and data with ethical hacking skills."
        />
        <ResourceCard
          title="Robotics"
          pdfUrl="/pdfs/robotics.pdf"
          imageUrl="/images/robotics-img.jpeg"
          description="Build and program intelligent machines for automation and innovation."
        />
      </div>
    </div>
  );
};

export default ResourcesPage;
