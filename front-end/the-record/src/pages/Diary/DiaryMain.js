import React from 'react';
import Navigation from '../../components/Navigation';
import '../../styles/diary/diarymain.css';
import DiaryList from './DiaryList';
// import Calendar from './Calendar';

function DiaryMain() {
  return (
    <div id="diarymain">
      <div className="bg-white-left">
        <div className="diary-diarylist">
          <DiaryList />
        </div>
      </div>
      <div className="bg-white-right">
        {/* <Calendar /> */}
        <Navigation />
      </div>
    </div>
  );
}

export default DiaryMain;
