import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import MakeDiaryHeader from './MakeDiaryHeader'
import '../../styles/diary/diarydetail.css'
import '../../styles/diary/makediary.css'

function DiaryDetailContainer(props) {
  const { diaryInfo } = props
  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState(false)
  const loginUserInfo = useSelector(state => state.common.loginUserInfo)
  const homePageHostInfo = useSelector(state => state.common.homePageHostInfo)
  const info = {
    title: diaryInfo.title,
    folder: diaryInfo.folderName,
    visible: diaryInfo.visible === 'PRIVATE',
  }
  const [diaryDto, setDiaryDto] = useState({})

  useEffect(() => {
    setDiaryDto({
      category: diaryInfo.category,
      content: diaryInfo.content,
      diaryId: diaryInfo.diaryId,
      folderId: diaryInfo.folderId,
      mediaUrl: diaryInfo.mediaUrl,
      recordDt: diaryInfo.recordDt,
      title: diaryInfo.title,
      visible: diaryInfo.visible,
    })
  }, [diaryInfo.diaryId])

  const setDto = ({ item, value }) => {
    console.log(value)
    const newDto = {
      ...diaryDto,
      [item]: value,
    }
    setDiaryDto(newDto)
  }

  const deleteDiary = diaryId => {
    axios({
      method: 'delete',
      url: `https://the-record.co.kr/api/diary/${diaryId}`,
      headers: {
        'x-auth-token': sessionStorage.getItem('jwt'),
      },
    })
      .then(res => {
        if (res.data === 'success') {
          console.log('삭제 성공')
          navigate('/diary')
        }
      })
      .catch(err => console.log(err))
  }

  const moveUpdate = () => {
    setIsUpdate(true)
  }

  const checkMedia = () => {
    if (diaryInfo.mediaUrl) {
      if (diaryInfo.category === 'PICTURE') {
        return (
          <img
            src={`https://s3.ap-northeast-2.amazonaws.com/the-record.bucket/${diaryInfo.mediaUrl}`}
            alt="일기 내용"
          />
        )
      }
      if (diaryInfo.category === 'VIDEO') {
        return (
          <video
            src={`https://s3.ap-northeast-2.amazonaws.com/the-record.bucket/${diaryInfo.mediaUrl}`}
            alt="일기 내용"
            controls
            className="diaryInfo-video"
          >
            <track kind="captions" />
          </video>
        )
      }
      return (
        <audio
          alt="일기 내용"
          src={`https://s3.ap-northeast-2.amazonaws.com/the-record.bucket/${diaryInfo.mediaUrl}`}
          controls
        >
          <track kind="captions" />
        </audio>
      )
    }
    return <div />
  }

  const updateDiary = () => {
    console.log(diaryDto)
    axios({
      method: 'PUT',
      url: 'https://the-record.co.kr/api/diary',
      data: diaryDto,
      headers: {
        'x-auth-token': sessionStorage.getItem('jwt'),
      },
    })
      .then(res => {
        if (res.data === 'success') {
          console.log('수정 성공')
          console.log(diaryInfo.diaryId)
          setIsUpdate(false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="diarydetail-container">
      {isUpdate ? (
        <MakeDiaryHeader
          info={info}
          sendTitle={e => setDto({ item: 'title', value: e })}
          sendFolder={e => setDto({ item: 'folderId', value: e })}
          sendVisible={e =>
            setDto({
              item: 'visible',
              value: e === false ? 'PUBLIC' : 'PRIVATE',
            })
          }
        />
      ) : (
        <>
          <div className="diaryinfo-header">
            <div>
              <div className="diaryinfo-header-title">{diaryDto.title}</div>
              <div className="diaryinfo-header-date">{diaryInfo.recordDt}</div>
            </div>
            {loginUserInfo.name === homePageHostInfo.name ? (
              <div>
                <button
                  className="diaryinfo-header-btn"
                  type="button"
                  onClick={() => moveUpdate()}
                >
                  수정
                </button>
                <span style={{ color: '#848484' }}>|</span>
                <button
                  className="diaryinfo-header-btn"
                  type="button"
                  onClick={() => deleteDiary(diaryInfo.diaryId)}
                >
                  삭제
                </button>
              </div>
            ) : (
              <div />
            )}
          </div>
          <hr />
          <div className="diaryinfo-category">
            {diaryDto.visible === 'PRIVATE' ? '비공개' : '전체 공개'}
          </div>
        </>
      )}

      {isUpdate ? (
        <div className="diaryinfo-content-update">
          <div className="diaryinfo-media">{checkMedia()}</div>
          <div className="diaryinfo-update-text">
            <textarea
              className="record-text"
              defaultValue={diaryDto.content}
              onChange={e => setDto({ item: 'content', value: e.target.value })}
            />
          </div>
          <button
            className="diaryinfo-update-btn"
            type="button"
            onClick={() => updateDiary()}
          >
            수정완료
          </button>
        </div>
      ) : (
        <div className="diaryinfo-content">
          <div className="diaryinfo-media">{checkMedia()}</div>
          <div className="diaryinfo-text">
            {diaryDto.content
              ? diaryDto.content.split('\n').map(line => {
                  return (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  )
                })
              : ''}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiaryDetailContainer
