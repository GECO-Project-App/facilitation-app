import React, {FC} from 'react';
import {Button} from './ui';
import {NavBar} from './NavBar';
type AboutProps = {
  title: string;
  subtitle: string;
  description: string;
  button: () => typeof Button;
};

export const About: FC<AboutProps> = () => {
  return (
    <section className="page-padding flex min-h-screen flex-col justify-between bg-purple">
      <NavBar />
    </section>
  );
};
