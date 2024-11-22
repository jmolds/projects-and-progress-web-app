import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { ProgressCard, ProgressDetails } from '@/components/ProgressComponents';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useSwiperHoverEffect } from '@/hooks/useSwiperHoverEffect'; 
import { formatProgressCards } from '@/utils/formatProgressCards';
import { firestore } from '@/utils/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import axios from 'axios'; 

export async function getServerSideProps() {
  // Fetch projects data
  const projectsRef = collection(firestore, 'projects');
  const projectSnapshot = await getDocs(projectsRef);
  const projects = projectSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    updated_ts: doc.data().updated_ts ? doc.data().updated_ts.toDate().toISOString().slice(0, 10) : null  // Convert Date to "YYYY-MM-DD" format
  })).sort((a, b) => a.positionIndex - b.positionIndex);

  console.log("Projects data:", projects);  // Log the projects data for inspection

  // Fetch progress data
  const progressRef = collection(firestore, 'progress');
  const progressSnapshot = await getDocs(progressRef);
  const progress = progressSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_ts: doc.data().created_ts ? doc.data().created_ts.toDate().toISOString().slice(0, 10) : null,  // Convert Date to "YYYY-MM-DD"
    updated_ts: doc.data().updated_ts ? doc.data().updated_ts.toDate().toISOString().slice(0, 10) : null  // Ensure both timestamps are converted
  }));

  // console.log("Progress data:", progress);  // Log the progress data for inspection

  return {
    props: {
        projects,
        progress
    }
  };
}


export default function Home({ projects, progress }) {
  const projectsHeaderRef = useRef(null);
  const projectsSectionRef = useRef(null);
  const progressSectionRef = useRef(null);
  const projectsSwiperRef = useRef(null);
  const progressSwiperRef = useRef(null);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProgressCard, setSelectedProgressCard] = useState(null);

  // Custom hooks for hover state management
  const projectsSwiperHover = useSwiperHoverEffect(selectedProjectId !== null);
  const progressSwiperHover = useSwiperHoverEffect(selectedProgressCard !== null);

    // Use the Intersection Observer hook to manage visibility states
    const isProjectsVisible = useIntersectionObserver(projectsSectionRef);
    const isProgressVisible = useIntersectionObserver(progressSectionRef);

    
    const visibleProgressCards = formatProgressCards(progress, selectedProjectId);

    // Memoized styles for Swiper components, accounting for hover and selection states
    const projectsSwiperStyle = useMemo(() => ({
      border: selectedProjectId ? '1px solid transparent' : projectsSwiperHover.isHovered ? '1px solid white' : '1px solid transparent',
      transition: 'border 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5px 0',
      height: '100%',
      position: 'relative',
    }), [projectsSwiperHover.isHovered, selectedProjectId]);
  
    const progressSwiperStyle = useMemo(() => ({
      border: selectedProgressCard ? '1px solid transparent' : progressSwiperHover.isHovered ? '1px solid white' : '1px solid transparent',
      transition: 'border 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1% 0',
      minHeight: '15vh',
      maxHeight: '15vh',
    }), [progressSwiperHover.isHovered, selectedProgressCard]);


    const handleProjectSelect = (projectId) => {
      // console.log("Selecting project:", projectId);
      if (projectId === selectedProjectId) {
        setSelectedProjectId(null);
        setSelectedProgressCard(null); // Deselect progress card when project is deselected
      } else {
        setSelectedProjectId(projectId);
        
        const project = projects.find(p => p.id === projectId);
        const index = project ? project.positionIndex - 1 : -1; // 1-based index assumed
    
        // console.log("Project index:", index);
        if (index !== -1 && projectsSwiperRef.current) {
          if (!isSlideVisible(projectsSwiperRef.current, index)) {
            projectsSwiperRef.current.slideTo(index, 500);
          }
        }
      }
    };
    
    
    const handleProgressSelect = (progressCard) => {
      // console.log("Selecting progress card:", progressCard.id);
      if (progressCard === selectedProgressCard) {
        setSelectedProgressCard(null);
        setSelectedProjectId(null);
      } else {
        setSelectedProgressCard(progressCard);
        setSelectedProjectId(progressCard.projectId);
    
        const progressIndex = progress.findIndex(card => card.id === progressCard.id);
        if (progressIndex !== -1 && progressSwiperRef.current) {
          progressSwiperRef.current.slideTo(progressIndex, 500);
        }
    
        const project = projects.find(p => p.id === progressCard.projectId);
        const projectIndex = project ? project.positionIndex - 1 : -1;
        // console.log("Corresponding project index:", projectIndex);
        if (projectIndex !== -1 && projectsSwiperRef.current) {
          if (!isSlideVisible(projectsSwiperRef.current, projectIndex)) {
            projectsSwiperRef.current.slideTo(projectIndex, 500);
          }
        }
      }
    };
    
function isSlideVisible(swiper, index) {
  // Assuming swiper.slides is accessible and contains the DOM elements of each slide
  const swiperWidth = swiper.width;
  const slideElement = swiper.slides[index];

  if (!slideElement) return false;

  const slideRect = slideElement.getBoundingClientRect();
  const swiperRect = swiper.el.getBoundingClientRect();

  // Check if the slide's rect is within the visible bounds of the swiper container
  const isVisible = (
    slideRect.left >= swiperRect.left &&
    slideRect.right <= swiperRect.right
  );

  // console.log("Slide visibility check - Index:", index, "Visible:", isVisible);
  return isVisible;
}

    
    

    return (
      <div>
        {/* Top Section Placeholder */}
        <section className="flex flex-col justify-center bg-gray-900"  style={{ height: '85vh' }}>
          {/* This section intentionally left blank for future content */}

        </section>
        <section id="projects-header-and-visual"  className="flex flex-col justify-center bg-gray-850 py-0 my-0" style={{ height: '35vh', minHeight: '15vh' }}>
          {/* Pass the position state to LogAndControlPanel */}
  
        </section>

        {/* Projects Section */}
        <section id="projects-swiper-container" ref={projectsSectionRef} className="flex flex-col justify-center bg-gray-800 " style={{  minHeight: '500px' }}
        onMouseEnter={projectsSwiperHover.onEnter} onMouseLeave={projectsSwiperHover.onLeave}
        >
          
          {/* Projects Cards Swiper */}
          <div style={{ flex: '5 1 50%', minHeight:'30vh', alignContent: 'flex-end', background:'indigo'}}>
            {/* Swiper setup for projects */}
            <Swiper
              onSwiper={(swiper) => {
                projectsSwiperRef.current = swiper; 
                }}
                        
              spaceBetween={5}
              slidesPerView={1.1}
              breakpoints={{
                426: { slidesPerView: 1.1, spaceBetween: 5 },
                640: { slidesPerView: 2.2, spaceBetween: 10 },
                960: { slidesPerView: 2.2, spaceBetween: 40 },
                1280: { slidesPerView: 3.2, spaceBetween: 60 },
                2000: { slidesPerView: 4.2, spaceBetween: 40 },
              }}
              loop={true}
              className="w-full"
              style={projectsSwiperStyle}
            >
              {projects.map((project) => (
              <SwiperSlide key={project.id} >
               <ProjectCard 
                  {...project} 
                  isVisible={isProjectsVisible}  
                  onClick={() => handleProjectSelect(project.projectId)} 
                  selected={project.projectId === selectedProjectId}  
                  color={project.color}
                  />
              </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Progress Section */}
        <section
          id="progress-swiper-container"
          ref={progressSectionRef}
          className="flex flex-col justify-center bg-gray-700 progress-swiper-container" // Added class for targeting in CSS
          onMouseEnter={progressSwiperHover.onEnter}
          onMouseLeave={progressSwiperHover.onLeave}
          style={{
            height: '15vh', // This can be adjusted or removed if minHeight in CSS is sufficient
            // padding: '1rem 0', // Ensuring some padding to display borders
          }}
        >

          {/* Progress Cards Swiper */}
          <div>
            <Swiper
            onSwiper={(swiper) => {
                 progressSwiperRef.current = swiper; }}
            // slideToClickedSlide={true} 
            spaceBetween={5}
            slidesPerView={1.1}
            breakpoints={{
              426: { slidesPerView: 1.1, spaceBetween: 5 },
              640: { slidesPerView: 3.2, spaceBetween: 10 },
              960: { slidesPerView: 4.1, spaceBetween: 20 },
              1280: { slidesPerView: 5.5, spaceBetween: 10 },
              1900: { slidesPerView: 6.1, spaceBetween: 10 },
            }}
            // loop={true}
            className="w-full"
            style={progressSwiperStyle}
          >
           {visibleProgressCards.map((card) => (
            <SwiperSlide key={card.id} >
              <ProgressCard {...card} isVisible={isProgressVisible} 
              onClick={() => handleProgressSelect(card)}
              selected={card === selectedProgressCard} 
              color={projects.find(p => p.id === card.projectId)?.color}
              />
            </SwiperSlide>
          ))}
          </Swiper>
          </div>
        </section>
              
        <section className="flex justify-center bg-gray-900 min-h-screen w-full">
          {selectedProgressCard && (
            <div className="w-19/20 mx-auto p-2">
              <ProgressDetails details={selectedProgressCard} />
            </div>
          )}
        </section>



        <section className="flex flex-col justify-center bg-gray-800"  style={{ height: '100vh' }}>
          {/* This section intentionally left blank for future content */}
         
        </section>
        
      </div>
    );
  }

