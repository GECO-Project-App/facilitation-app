import React from 'react';
import {Checked} from '@/components/icons/checked';

const CheckBox: React.FC<{checked: boolean}> = ({checked}) => {
  return (
    <figure className="mr-4 h-10 w-10 rounded-full border-2 border-black bg-white">
      <figcaption className="-mt-1 ml-1">{checked ? <Checked /> : null}</figcaption>
    </figure>
  );
};

export default CheckBox;
