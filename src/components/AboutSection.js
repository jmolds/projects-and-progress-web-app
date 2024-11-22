import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

const AboutSection = () => {
  const placeholderImageUrl = "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/testimage.jpeg?alt=media&token=74893c96-b369-4b06-800e-c8ba2dd73bb0";
//   const [profileUrl, setProfileUrl] = useState(placeholderImageUrl);
  const [experienceData, setExperienceData] = useState([
    {
      role: 'Data Scientist',
      company: 'Little Caesars',
      duration: '2021 - 2024',
      bullets: [
        'Designed data pipelines for order, customer, and store-level measurement, supporting marketing and finance.',
        'Created customer classifications using customer retention/churn modeling, increasing advertising spend effectiveness.',
        'Led development for item-specific demand predictions served hourly to store operators at each domestic and international location.'
      ],
      logoUrl: "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fcaesars.jpg?alt=media&token=3e470411-f049-445a-9089-dad06b256377",
      iconsUrls: ["https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2FScreenshot%202024-06-27%20163516.png?alt=media&token=4740322d-5266-44f3-b734-73102a460adc",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fdatabricks-logo-2F2F1E37DB-seeklogo.com.png?alt=media&token=f76cecd7-2162-4b12-bea2-93d452bb9a3d",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fazure-sql-logo-3AE930D2AF-seeklogo.com.png?alt=media&token=448de692-e94f-4797-a129-83597cbdd1ec",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fmicrosoft-azure-logo-A5763BE4D0-seeklogo.com.png?alt=media&token=68848cae-209b-436d-9e37-53c8ff62930f",
         
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fpower-bi-microsoft-logo-E4FC8DE4A9-seeklogo.com.png?alt=media&token=9f18409e-365e-47d8-92de-21059bf3b7e8",
          "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Ffirebase-logo-C912FB49C1-seeklogo.com.png?alt=media&token=e56a2cea-c3cf-408d-a9ea-ad0ed87f85ba",
        
    ]
    },
    {
      role: 'Data Scientist',
      company: 'Capser Sleep',
      duration: '2019',
      bullets: [
        'Designed a data pipeline and Bayesian regression model to optimize ad spending.',
        'Developed a visualization dashboard showing ad-spend response curves for multiple channels.',
        'Reviewed current marketing testing methods, including geo-spatial A/B testing.'
      ],
      logoUrl: "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2FScreenshot%202024-06-25%20210727.png?alt=media&token=a9b9a55f-ccba-4c8c-8005-60d7025544ab",
      iconsUrls: ["https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2FScreenshot%202024-06-27%20163600.png?alt=media&token=f749f21a-a38a-4ca1-b23d-28d96c15c445", 
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fpymc3.png?alt=media&token=e0e8b9df-7fb6-46b8-b147-9ca5969d177b",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fscikit-learn-logo-8766D07E2E-seeklogo.com.png?alt=media&token=1bf45359-57d1-4593-a56f-c8ee7d29ff04",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fgit-logo-F4A93DAA20-seeklogo.com.png?alt=media&token=07c5c440-c52d-44a5-a923-61aa5ac299cf",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fjira-logo-AC0E7573B0-seeklogo.com.png?alt=media&token=cf8447a1-96ff-4ced-b22b-63618411bbd6",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Fabout_looker-by-google-cloud5180.jpg?alt=media&token=0bd23eb4-85e5-4a5e-b909-039cd969fa94",
    ]
    },
    {
      role: 'Postdoctoral Researcher and Course Instructor',
      company: 'University of Lausanne',
      duration: '2014 - 2018',
      bullets: [
        'Employed data science methods for memory-based decision-making research.',
        'Designed novel computer-based experiments and evaluated models with behavioral results.',
        'Received 2-year postdoctoral salary funding from the Swiss National Science Foundation.'
      ],
      logoUrl: "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2FScreenshot%202024-06-25%20210947.png?alt=media&token=a2770f65-24c1-41f5-a86b-39af37c98c14",
      iconsUrls: ["https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2FR_logo.svg.png?alt=media&token=0b102e58-a242-470b-af7c-b06816d7cb51",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2FTidyverse_hex_logo.png?alt=media&token=a9bd9549-9b80-4edf-9115-226333fe0b07",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2F1_XN4PndkDSnKAvji21l1ETg.png?alt=media&token=942116e2-8521-492b-a649-a3c7bb8c8a9e",
        "https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2FGgplot2_hex_logo.png?alt=media&token=26c0bcf6-63c2-4dba-8d83-8bcc900e40cb",

      ]
    }
  ]);

  const educationData = [
    {
      degree: 'Ph.D. in Cognitive and Brain Sciences',
      school: 'State University of New York at Binghamton'
    },
    {
      degree: 'B.S. (Summa cum laude) in Psychology',
      school: 'Eastern Michigan University'
    }
  ];


 
  return (
    <section className="about-section py-8 bg-transparent">
      <div className="container mx-auto flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row items-center content-normal p-4">
          <div className="w-full md:w-1/3 flex justify-center">
            <Image 
              src={"https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/about%2Funnamed.jpg?alt=media&token=63ccdb84-2d66-4f13-b68a-79d5a209198a"} 
              alt="Profile" 
              width={375} 
              height={375} 
              className="rounded-full object-cover border-2 border-black"
              priority
            />
          </div>
          <div className="w-full md:w-2/3 p-4 mb-4 text-left rounded-lg bg-black">
          <p className="text-white md:text-lg text-base text-left align-middle leading-relaxed">
         Hi, welcome.
         <span className="block mb-6"></span>
         This website provides weekly reporting for the Enabled Autonomy Video Player tablet and other data signals. The main goal is to support evidence-based improvements for the app and other projects by monitoring and forecasting key measurments.
         <span className="block mb-4"></span>
         I created the Enabled Autonomy Video Player app for my cousin, Bill (cognitively impaired), to provide him a video browsing and viewing experience he could engage with independently.
       </p>
          </div>
        </div>
        {experienceData.map((exp, idx) => (
        <div key={idx} className="experience-card w-full bg-transparent p-2 rounded-lg mt-2">
          <div className="md:grid md:grid-cols-4 md:gap-4 flex flex-col md:flex-row items-center">
            <div className="md:col-span-1 w-full flex justify-center md:justify-start items-center mt-4 md:mt-0">
              <Image 
                src={exp.logoUrl} 
                alt={`${exp.company} Logo`} 
                width={160}  
                height={160} 
                className="object-fit"  
              />
            </div>
            <div className="md:col-span-3 w-full">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-black text-shadow-md">{exp.company}</h3>
                  <p className="text-lg text-black">{exp.role}</p>
                </div>
                <p className="text-sm text-gray-700">{exp.duration}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {exp.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex-1 bg-black md:m-2 flex items-center justify-start rounded-md">
                    <p className="text-white p-1 m-0 md:m-3 bullet-point text-xs md:text-base">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-start mt-1">
                {exp.iconsUrls.map((iconUrl, iIdx) => (
                  <Image 
                    key={iIdx} 
                    src={iconUrl} 
                    alt="Tech Used" 
                    width={75} 
                    height={75} 
                    className="m-1"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="w-full p-5 mt-5">
        <h2 className="text-2xl font-bold text-black mb-4">Education</h2>
        {educationData.map((edu, idx) => (
          <div key={idx} className="bg-black mt-2 rounded-md">
            <div className="flex flex-col rounded:md md:flex-row justify-between items-center">
              <p className="text-md md:text-lg font-bold text-white m-2">{edu.degree}</p>
              <p className="text-md text-white m-2">{edu.school}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
};

export default AboutSection;