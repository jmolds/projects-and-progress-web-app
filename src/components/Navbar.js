import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 text-white py-2 flex justify-center">
      <div className="flex items-center gap-4 bg-black rounded-lg px-4" style={{ maxWidth: 'fit-content', margin: '0 auto' }}>
        <Link href="/#top" scroll={true} className="text-sm md:text-lg">Justin M. Olds</Link>
        <Link href="/#projects-header-and-visual" scroll={true} className="text-xs md:text-sm">Projects</Link>
        <Link href="/#progress-swiper-container" scroll={true} className="text-xs md:text-sm">Progress</Link>
        <Link href="/#about" scroll={true} className="text-xs md:text-sm">About</Link>
      </div>
    </nav>
  );
};

export default Navbar;
