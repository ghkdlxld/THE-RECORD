import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import iro from '@jaames/iro'
import '../../styles/photo/album.css'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import enterPhotoBooth from '../../assets/enterPhotoBooth.png'
import callApi from '../../common/api'

function MakeBoothButton() {
  const navigate = useNavigate()
  const [makeBoothDialogOpen, setmakeBoothDialogOpen] = useState(false)
  const [colorDialogOpen, setColorDialogOpen] = useState(false)
  const [peopleNum, setPeopleNum] = useState(4)
  const [numListOpen, setnumListOpen] = useState(false)
  const [colorPicker, setColorPicker] = useState()
  const [backgroundColor, setBackgroundColor] = useState('rgb(194, 225, 255)')
  const loginUserInfo = useSelector(state => state.common.loginUserInfo)

  useEffect(() => {
    if (colorDialogOpen === true) {
      setColorPicker(
        () =>
          new iro.ColorPicker('#background-picker', {
            width: 200,
            color: 'rgb(194, 225, 255)',
          }),
      )
    }
  }, [colorDialogOpen])

  useEffect(() => {
    if (colorPicker) {
      colorPicker.on('color:change', color => {
        const backgroundrgb = `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`
        setBackgroundColor(() => backgroundrgb)
      })
    }
  }, [colorPicker])

  useEffect(() => {
    if (colorDialogOpen === true) {
      const canvas = document.querySelector('#bgcolor-preview')
      canvas.style.backgroundColor = backgroundColor
    }
  }, [backgroundColor])

  const closeMakeDialog = () => {
    setmakeBoothDialogOpen(false)
    setnumListOpen(false)
  }

  const closeColorDialog = () => {
    setColorDialogOpen(false)
    setmakeBoothDialogOpen(false)
  }

  const moveColorDialog = () => {
    setColorDialogOpen(true)
  }

  const movePhotobooth = async () => {
    const isExist = await callApi({
      url: `/api/photobooth/${loginUserInfo.userId}`,
    })
    if (isExist === 'FALSE') {
      axios({
        method: 'put',
        url: 'https://the-record.co.kr/api/photobooth',
        data: {
          userId: loginUserInfo.userId,
          userPk: loginUserInfo.userPk,
        },
        headers: {
          'x-auth-token': sessionStorage.getItem('jwt'),
        },
      })
        .then(res => {
          if (res.data === 'success') {
            setColorDialogOpen(false)
            setPeopleNum(4)
            setmakeBoothDialogOpen(false)
            navigate('/album/photobooth', {
              state: {
                peopleNum,
                backgroundColor,
                loginUserInfo,
              },
            })
          }
        })
        .catch(() => {
          alert('?????? ?????? ???????????? ????????????.')
        })
    } else {
      alert('?????? ?????? ?????????????????????. ??????????????????')
    }
  }

  return (
    <div>
      <button
        type="button"
        className="album-btn"
        onClick={() => setmakeBoothDialogOpen(true)}
      >
        <CameraAltOutlinedIcon className="album-btn-icon" fontSize="small" />
        ???????????? ????????????
      </button>

      {/* ???????????? Dialog */}
      <Dialog
        open={makeBoothDialogOpen}
        onClose={closeMakeDialog}
        id="dialog"
        className="photobooth-dialog"
        aria-labelledby="dialog-container"
        aria-describedby="dialog-description"
        PaperProps={{
          sx: {
            minWidth: 800,
            borderRadius: 2.7,
          },
        }}
      >
        <DialogTitle id="dialog-container" className="dialog-header">
          <div className="dialog-title">
            <p>????????????</p>
          </div>
          <Button
            sx={{
              minWidth: 36,
              height: 49,
            }}
            onClick={() => {
              closeMakeDialog()
            }}
          >
            <CloseRoundedIcon
              sx={{
                fontSize: 29,
              }}
            />
          </Button>
        </DialogTitle>
        <div className="dialog-body-box">
          <div className="dialog-body photobooth-dialog-body">
            <img src={enterPhotoBooth} alt="????????????" />
            <p className="photobooth-dialog-title">???????????? ????????????</p>
            <p>????????? ?????? ?????? ???????????????</p>

            <div className="make-dialog-input-box">
              <button
                type="button"
                onClick={() => setnumListOpen(!numListOpen)}
                className="make-dialog-input"
              >
                <div>
                  <p>{peopleNum}</p>
                </div>
                {numListOpen ? (
                  <ArrowDropUpIcon
                    color="action"
                    className="make-dialog-input-btn"
                  />
                ) : (
                  <ArrowDropDownIcon
                    color="action"
                    className="make-dialog-input-btn"
                  />
                )}
              </button>
              <div className="photobooth-num-list">
                {numListOpen
                  ? [4, 3, 2].map(num => (
                      <button
                        type="button"
                        className="photobooth-num-listitem"
                        key={num}
                        onClick={() => [
                          setPeopleNum(num),
                          setnumListOpen(false),
                        ]}
                      >
                        {num}
                      </button>
                    ))
                  : ''}
              </div>
            </div>
            <button
              type="button"
              className="photobooth-dialog-btn"
              onClick={() => moveColorDialog()}
            >
              ??????
            </button>
          </div>
        </div>
      </Dialog>

      {/* ????????? Dialog */}
      <Dialog
        open={colorDialogOpen}
        onClose={closeColorDialog}
        id="dialog"
        className="photobooth-dialog"
        aria-labelledby="dialog-container"
        aria-describedby="dialog-description"
        PaperProps={{
          sx: {
            minWidth: 800,
            borderRadius: 2.7,
          },
        }}
      >
        <DialogTitle id="dialog-container" className="dialog-header">
          <div className="dialog-title">
            <p>????????????</p>
          </div>
          <Button
            sx={{
              minWidth: 36,
              height: 49,
            }}
            onClick={() => {
              closeColorDialog()
            }}
          >
            <CloseRoundedIcon
              sx={{
                fontSize: 29,
              }}
            />
          </Button>
        </DialogTitle>
        <div className="dialog-body-box">
          <div className="dialog-body background-dialog-body">
            <p>???????????? ???????????????</p>
            <div className="background-color-box">
              <div id="background-picker" />
              <canvas id="bgcolor-preview" />
            </div>
            <button
              type="button"
              className="photobooth-dialog-btn"
              onClick={() => movePhotobooth()}
            >
              ????????????
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default MakeBoothButton
