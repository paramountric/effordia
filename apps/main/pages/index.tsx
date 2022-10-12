import type {NextPage} from 'next';
import React from 'react';
import Viewport from '../components/viewport';

const StartPage: NextPage = () => {
  return (
    <div>
      <main>
        <Viewport />
      </main>
    </div>
  );
};

export default StartPage;
