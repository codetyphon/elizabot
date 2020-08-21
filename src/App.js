import React, { useState, useEffect } from 'react';
import {Launcher} from 'react-chat-window'
import { useDynamicList } from 'ahooks';
import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import elizabot from './elizabot'
import axios from 'axios'
import './App.css';

function App() {
  const [value,setValue]=useState(0)
  const [bot,setBot]=useState("ELIZA")//ELIZA,API
  const { list, remove, getKey, push } = useDynamicList([]);
  const [lastMessageTime,setLastMessageTime]=useState(0)//最后消息的时间
  const [unReadCount,setUnReadCount]=useState(0)//未读消息
  const [isOpen,setIsOpen]=useState(false)//聊天窗体是否打开
  const [isfirst,setIsfirst]=useState(true)

  const _onFilesSelected = files =>{
    console.log(files)
  }

  const _on_botMessage_was_sent_to_user = message=> {
    console.log('user 2 bot')
    push(message)

    const text = message.data[message.type]
    if(bot=='ELIZA'){
      const msg = elizabot.reply(text)
      _bot_sendMessage_to_user(msg)
    }
    if(bot=='API'){
      _request_api(text)
    }
    // setTimeout(() => {
    //   _bot_sendMessage_to_user(`${message.data[message.type]} too`)
    // }, 2000);
  }

  const _request_api=(text)=>{
    axios.get(`http://i.itpk.cn/api.php?question=${text}`).then(res=>{
      console.log(res)
      _bot_sendMessage_to_user(res.data)
    })
  }

  const _bot_sendMessage_to_user = text => {
    console.log('bot 2 user')
    if (text.length > 0) {
      push({
        author: 'them',
        type: 'text',
        data: { text }
      })
      setLastMessageTime(Date.now())
    }
  }

  const _onHandleClick = () => {
    console.log('lanch')
    console.log(isOpen)
    setIsOpen(!isOpen)
  }

  useEffect(()=>{
    console.log(isOpen)
    if(isfirst){
      _bot_sendMessage_to_user(elizabot.start())
      setIsfirst(false)
    }else{
      //不是第一次载入，则机器人不主动聊天。
    }
    setUnReadCount(0)//只要打开了，未读消息就是0
  },[isOpen])

  //用这个进行触发，只有使用useState的set方法，才能让dom更新。
  useEffect(()=>{
    setUnReadCount(unReadCount+1)
  },[lastMessageTime])

  return (
    <div className="App">
      <header className="App-header">
        <Launcher
          isOpen={isOpen}
          agentProfile={{
            teamName: bot,
            imageUrl: '/logo.png'
          }}
          newMessagesCount={unReadCount}
          onFilesSelected={_onFilesSelected}
          onMessageWasSent={_on_botMessage_was_sent_to_user}
          messageList={list}
          handleClick={_onHandleClick}
          showEmoji={false}
        />
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          console.log(newValue)
          setValue(newValue)
          if(newValue==0){
            setBot('ELIZA');
          }
          if(newValue==1){
            setBot('API');
          }
        }}
        showLabels
      >
        <BottomNavigationAction label="ELIZA" />
        <BottomNavigationAction label="API" />
      </BottomNavigation>
      </header>
    </div>
  );
}

export default App;
