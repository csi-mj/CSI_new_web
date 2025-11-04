import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700', '800'],
});

export default function ResourcesLayout({ children }) {
  return (
    <div className={poppins.className}>
      {children}
    </div>
  );
}
