import {FC} from 'react';
import {NavBar} from './NavBar';
import {RiveAnimation} from './RiveAnimation';

type AboutProps = {
  title: string;
  subtitle: string;
  description: string;
  rive: string;
  button: () => JSX.Element;
};

export const About: FC<AboutProps> = ({title, subtitle, description, rive, button}) => {
  return (
    <section className="page-padding flex min-h-screen flex-col justify-between">
      <NavBar />
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center space-y-6">
        <RiveAnimation src={rive} width={300} />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{title} </h1>
          <p className="text-sm font-light">{subtitle}</p>
          <p>{description}</p>
        </div>
        {button()}
      </div>
    </section>
  );
};
