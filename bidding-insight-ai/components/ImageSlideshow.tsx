
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tender } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './IconComponents';

interface ImageSlideshowProps {
  tenders: Tender[];
}

export const ImageSlideshow: React.FC<ImageSlideshowProps> = ({ tenders }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo(() => {
    return tenders.filter(tender => tender.imageUrl);
  }, [tenders]);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setTimeout(goToNext, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, slides.length, goToNext]);

  if (slides.length === 0) {
    return null; // Don't render anything if there are no images
  }

  return (
    <div className="w-full h-64 md:h-96 relative m-auto group rounded-lg overflow-hidden shadow-lg">
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].imageUrl})` }}
        className="w-full h-full bg-center bg-cover duration-500"
      >
        {/* Overlay for text */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6 md:p-8">
            <h2 className="text-white text-xl md:text-3xl font-bold leading-tight drop-shadow-md">
                {slides[currentIndex].title}
            </h2>
            <p className="text-gray-200 text-sm md:text-base mt-1 drop-shadow-md">
                {slides[currentIndex].entity}
            </p>
        </div>
      </div>
      {/* Left Arrow */}
      {slides.length > 1 && (
        <>
            <div onClick={goToPrevious} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
                <ChevronLeftIcon className="w-6 h-6" />
            </div>
            {/* Right Arrow */}
            <div onClick={goToNext} className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
                <ChevronRightIcon className="w-6 h-6" />
            </div>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center space-x-2">
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
              currentIndex === slideIndex ? 'bg-white p-1' : 'bg-white/50'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};
