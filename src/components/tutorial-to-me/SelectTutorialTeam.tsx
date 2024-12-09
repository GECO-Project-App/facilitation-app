import {TeamSelect} from '@/components';
import {FC} from 'react';
import {Tables} from '../../../database.types';

const SelectTutorialTeam: FC<{selectedTeam: Tables<'teams'>[]; disableCreateOrJoin?: boolean}> = ({
  selectedTeam,
  disableCreateOrJoin = false,
}) => {
  return (
    <div className="w-[68%] mx-auto py-2">
      {selectedTeam && selectedTeam.length > 0 && (
        <TeamSelect disableCreateOrJoin={disableCreateOrJoin} />
      )}
    </div>
  );
};

export default SelectTutorialTeam;
