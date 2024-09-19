import {FC} from 'react';
import {NavBar} from './NavBar';
import {RiveAnimation} from './RiveAnimation';
import Image from 'next/image';

type AboutProps = {
  title: string;
  subtitle: string;
  description: string;
  rive?: string;
  illustration?: string;
  button: () => JSX.Element;
};

export const About: FC<AboutProps> = ({
  title,
  subtitle,
  description,
  rive,
  illustration,
  button,
}) => {
  return (
    <section className="page-padding flex min-h-screen flex-col justify-between">
      <NavBar />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center space-y-6">
        {rive && <RiveAnimation src={rive} width={300} />}
        <div className="relative aspect-video w-full self-start md:w-2/3">
          {illustration && <Image src={illustration} alt={title} fill />}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{title} </h2>
            <p className="text-sm font-light">{subtitle}</p>
          </div>
          <p>{description}</p>
        </div>
      </div>
      <div className="flex justify-center">{button()}</div>
    </section>
  );
};
