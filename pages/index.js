import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProjectCard from '@/components/ProjectCard';
import { ProgressCard, ProgressDetails } from '@/components/ProgressComponents';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useSwiperHoverEffect } from '@/hooks/useSwiperHoverEffect'; 
import { formatProgressCards } from '@/utils/formatProgressCards';
import { firestore } from '@/utils/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import WeeklyPlot from '@/components/WeeklyPlot'; 
import ParallaxContainer from '@/components/ParallaxContainer';  
import AboutSection from '@/components/AboutSection';

export async function getServerSideProps() {
  const projectsRef = collection(firestore, 'projects');
  const projectSnapshot = await getDocs(projectsRef);
  const projects = projectSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    updated_ts: doc.data().updated_ts ? doc.data().updated_ts.toDate().toISOString().slice(0, 10) : null
  })).sort((a, b) => a.positionIndex - b.positionIndex);

  const progressRef = collection(firestore, 'progress');
  const progressSnapshot = await getDocs(progressRef);
  const progress = progressSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_ts: doc.data().created_ts ? doc.data().created_ts.toDate().toISOString().slice(0, 10) : null,
    updated_ts: doc.data().updated_ts ? doc.data().updated_ts.toDate().toISOString().slice(0, 10) : null
  }));

  return {
    props: {
      projects,
      progress
    }
  };
}

export default function Home({ projects, progress }) {
  const [opacity, setOpacity] = useState(1);
  const topRef = useRef(null);
  const projectsHeaderRef = useRef(null);
  const projectsSectionRef = useRef(null);
  const progressSectionRef = useRef(null);
  const projectsSwiperRef = useRef(null);
  const progressSwiperRef = useRef(null);
  const plotlyContainerRef = useRef(null);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProgressCard, setSelectedProgressCard] = useState(null);
  const [featuredData, setFeaturedData] = useState(null);
  const [featuredSignalId, setFeaturedSignalId] = useState(null);
  const [featuredSignalLabel, setFeaturedSignalLabel] = useState(null);
  const [plotDimensions, setPlotDimensions] = useState({ width: 0, height: 0 });
  const [selectedColor, setSelectedColor] = useState(null);

  const projectsSwiperHover = useSwiperHoverEffect(selectedProjectId !== null);
  const progressSwiperHover = useSwiperHoverEffect(selectedProgressCard !== null);

  const isProjectsVisible = useIntersectionObserver(projectsSectionRef);
  const isProgressVisible = useIntersectionObserver(progressSectionRef);

  const visibleProgressCards = formatProgressCards(progress, selectedProjectId);

  // Load Time Monitoring Code (no changes)

  // Optimize useEffect dependencies
  useEffect(() => {
    const resizePlot = () => {
      if (plotlyContainerRef.current) {
        const { width, height } = plotlyContainerRef.current.getBoundingClientRect();
        setPlotDimensions({ width, height });
      }
    };

    resizePlot();
    window.addEventListener('resize', resizePlot);

    return () => window.removeEventListener('resize', resizePlot);
  }, []);

  // Handle scroll opacity (no changes)

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

  const handleProjectSelect = useCallback((projectId) => {
    if (projectId === selectedProjectId) {
      // Deselect logic
      setSelectedProjectId(null);
      setSelectedProgressCard(null);
      setFeaturedData(null);
      setSelectedColor(null);
      setFeaturedSignalId(null);
      setFeaturedSignalLabel(null);
    } else {
      setSelectedProjectId(projectId);

      // Set the project-specific details
      const project = projects.find(p => p.id === projectId);
      const color = project?.color || 'white';
      setFeaturedData(project?.featuredData || null);
      setSelectedColor(project?.color || 'white');
      setFeaturedSignalId(project?.featuredSignalId || 'weekly_usage_hours');
      setFeaturedSignalLabel(project?.featuredSignalLabel || 'Usage Hours');
    }
  }, [selectedProjectId, projects]);

  const handleProgressSelect = useCallback((progressCard) => {
    if (progressCard === selectedProgressCard) {
      // Deselect logic
      setSelectedProgressCard(null);
      setSelectedProjectId(null);
      setFeaturedData(null);
      setSelectedColor(null);
    } else {
      setSelectedProgressCard(progressCard);
      setSelectedProjectId(progressCard.projectId);

      // Swiper movement code has been removed to disable automatic scrolling

      // Set the project-specific details
      const project = projects.find(p => p.id === progressCard.projectId);
      setFeaturedData(project?.featuredData || null);
      setSelectedColor(project?.color || 'white');
      setFeaturedSignalId(project?.featuredSignalId || 'weekly_usage_hours');
      setFeaturedSignalLabel(project?.featuredSignalLabel || 'Usage Hours');
    }
  }, [selectedProgressCard, projects]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const newOpacity = scrollTop === 0 ? 1 : 0; // Show video only at top of the page
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div style={{ position: 'relative' }}>
      <ParallaxContainer />
      <section 
  ref={topRef} 
  className="relative flex items-center justify-center h-[85vh] bg-transparent font-semibold"
>
  {/* Centered video */}
  <div 
    className="absolute inset-0 flex justify-center items-center"
    style={{
      opacity: opacity, 
      transition: 'opacity 1s ease-in-out', // Fade effect
    }}
  >
    <video
      src="https://firebasestorage.googleapis.com/v0/b/projects-and-progress.appspot.com/o/test.mp4?alt=media&token=76d79530-4b84-45de-a16d-aee476f62327"
      autoPlay
      loop
      muted
      className="w-full h-full rounded-xl"
      style={{
        width: '50%',  // Adjust the percentage for smaller size
        height: 'auto',  // Maintain aspect ratio
        objectFit: 'cover',
      }}
    />

    {/* Title bubble (near the top, positioned relative to video) */}
    <div 
      className="absolute md:top-[21%] top-[30%] left-1/2 transform -translate-x-1/2 p-2 bg-[#6495ed] text-black text-center rounded-lg border-black w-[90%] md:w-[26%]"
      style={{
        font: 'semibold', // Adjust the width as needed
        borderColor: 'black',
        // borderInlineColor: 'black',
        borderWidth: '2px'
      }}
    >
     <p className="text-sm md:text-lg lg:text-xl border-black">
       <b> Enabled Autonomy </b><br /> Accessibility Technology for Watching Videos
      </p>
    </div>

    {/* Bottom-right feature bubble (positioned relative to video) */}
    <div 
      className="absolute md:bottom-[22%] md:right-[26%] bottom-[12%] p-2 bg-[#6495ed] text-black text-left rounded-lg border-black w-[80%] md:w-[18%]"
      style={{
        font: 'semibold',
        borderColor: 'black',
        // borderInlineColor: 'black',
        borderWidth: '2px'
        // width: '15%', // Adjust the width as needed
        // fontSize: '0.875rem', // Smaller text
      }}
    >
         <p className="text-sm md:text-sm lg:text-base font-bold text-center">
        Featuring:</p>
        <p className="text-sm md:text-sm lg:text-base font-semibold text-left">
        Automated Browsing Experience <br />
        Simple Touch for Selection <br />
        Responsive Visual &  Audio Feedback <br />
        Auto Screen Off if Unused <br />
        Disabled System Menu and Display <br />
        Cloud Synced Videos (No Download Delays)     
      </p>
    </div>
  </div>


     {/* Additional Text bubble */}
   <div 
    style={{
      opacity,
      transition: 'opacity 0.5s ease',
      position: 'absolute',
      top: '40px',  // Minimal margin from the top
      left: '10px',  // Minimal margin from the left
      fontSize: '1rem',
      color: 'black',  // Text color
      backgroundColor: 'rgba(255, 255, 255, 0.9)',  // Semi-transparent white background
      padding: '6px 18px',  // Padding inside the text box
      borderRadius: '10px',  // Rounded corners of the text box
      border: '2px solid black',  // Black border around the text box
      lineHeight: '1.4',  // Reduced space between lines
      minWidth: '240px',  // Minimum width to ensure no wrapping
      maxWidth: '80%',  // Maximum width to prevent excessively wide text box
    }}
  >
    <p>Accessibility Technology</p>
    <p>Systems Engineering</p>
    <p>Data Mining</p>
    <p>Forecasting</p>
  </div>
</section>

      {/* Second section for Plotly graphs */}
      <section ref={plotlyContainerRef} id="projects-header-and-visual" className="flex flex-col justify-center bg-transparent py-0 my-0" style={{ height: '35vh', minHeight: '15vh' }}>
        {featuredData && (
          <WeeklyPlot 
            data={featuredData} 
            featuredSignalId={featuredSignalId}
            featuredSignalLabel={featuredSignalLabel}
            layout={{ autosize: true, width: plotDimensions.width, height: plotDimensions.height }}
            config={{ staticPlot: false }}
            width={plotDimensions.width}
            height={plotDimensions.height}  
            color={selectedColor}
          />
        )}
      </section>

      {/* Projects Swiper */}
      <section id="projects-swiper-container" ref={projectsSectionRef} className="flex flex-col justify-center bg-transparent" style={{ minHeight: '500px' }}
        onMouseEnter={projectsSwiperHover.onEnter} onMouseLeave={projectsSwiperHover.onLeave}>
        <div style={{ flex: '5 1 50%', minHeight: '30vh', alignContent: 'flex-end' }}>
          <Swiper
            onSwiper={(swiper) => {
              projectsSwiperRef.current = swiper; 
            }}
            spaceBetween={0}
            slidesPerView={1.05}
            breakpoints={{
              426: { slidesPerView: 1.1, spaceBetween: 5 },
              640: { slidesPerView: 2.1, spaceBetween: 10 },
              960: { slidesPerView: 2.1, spaceBetween: 40 },
              1280: { slidesPerView: 3.1, spaceBetween: 30 },
              2000: { slidesPerView: 4.2, spaceBetween: 40 },
            }}
            loop={true}
            className="w-full"
            style={projectsSwiperStyle}
          >
            {projects.map((project) => (
              <SwiperSlide key={project.id}>
                <ProjectCard 
                  {...project} 
                  isVisible={isProjectsVisible}  
                  onClick={() => handleProjectSelect(project.id)} 
                  selected={project.id === selectedProjectId}  
                  color={project.color}
                  featuredData={project.featuredData} 
                  featureTableData={project.featuredTableData}
                  featuredSignalId={project.featuredSignalId}
                  featuredSignalLabel={project.featuredSignalLabel}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Progress Swiper */}
      <section id="progress-swiper-container" ref={progressSectionRef} className="flex flex-col justify-center bg-transparent"
        onMouseEnter={progressSwiperHover.onEnter} onMouseLeave={progressSwiperHover.onLeave} style={{ height: '15vh' }}>
        <div>
          <Swiper
            onSwiper={(swiper) => {
              progressSwiperRef.current = swiper;
            }}
            spaceBetween={5}
            slidesPerView={1.1}
            breakpoints={{
              426: { slidesPerView: 1.1, spaceBetween: 5 },
              640: { slidesPerView: 3.2, spaceBetween: 10 },
              960: { slidesPerView: 4.1, spaceBetween: 20 },
              1280: { slidesPerView: 5.5, spaceBetween: 10 },
              1900: { slidesPerView: 6.1, spaceBetween: 10 },
            }}
            className="w-full"
            style={progressSwiperStyle}
          >
            {visibleProgressCards.map((card) => (
              <SwiperSlide key={card.id}>
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

      {/* Progress Details Section */}
      <section className="flex justify-center bg-transparent min-h-screen w-full">
        {selectedProgressCard && (
          <div className="w-19/20 mx-auto p-2">
            <ProgressDetails details={selectedProgressCard} />
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="flex justify-center bg-transparent min-h-screen w-full">
        <AboutSection></AboutSection>
      </section>
    </div>
  );
}
