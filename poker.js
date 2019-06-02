/*
德州扑克
牌型示例
Royal flush: ['♦️A','♦️K','♦️Q','♦️J','♦️10']
Straight flush: ['♣️8','♣️7','♣️6','♣️5','♣️4']
Four of a kind: ['♠️J','♥️J','♣️J','♦️J','♣️6']
Three of a kind with a pair:  ['♠️J','♥️J','♣️J','♣️6','♦️6']
Flush: ['♠️2','♠️8','♠️9','♠️10','♠️J']
Straight: ['♥️8','♣️7','♦️6','♠️5','♠️4']
Three of a kind: ['♠️J','♥️J','♣️J','♣️6','♦️5']
Two pair: ['♠️J','♥️J','♣️6','♣️6','♦️5']
One pair: ['♠️J','♥️J','♣️7','♣️6','♦️5']
High Card: ['♦️3','♣️J','♠️8','♥️5','♠️2']
*/

const suit = ['♠️','♥️','♣️','♦️']
const values = [2,3,4,5,6,7,8,9,10,'J','Q','K','A']
const colors = ['♠️♠️♠️♠️♠️','♥️♥️♥️♥️♥️','♣️♣️♣️♣️♣️','♦️♦️♦️♦️♦️']
const map = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  10: "皇家同花顺",
  9: "同花顺",
  8: "四条",
  7: "葫芦",
  6: "同花",
  5: "顺子",
  4: "三条",
  3: "两对",
  2: "一对",
  1: "散牌",
}
const cards = []
function generate52Cards(){
  for(let i=0;i<suit.length;i++){
    for(let j=0;j<values.length;j++){
      let card = suit[i]+" "+values[j]
      cards.push(card)
    }
  }
  return cards
}
generate52Cards() // 生成52张牌

function get5Cards(){  // 随机取5张牌
  let temp =[]
  for(let i=0;i<5;i++){
    const randomIndex =  Math.floor(Math.random()*cards.length)
    const randomValue = cards.splice(randomIndex,1)
    temp.push(...randomValue)
  }
  return temp
}

const player = get5Cards()
const computer =  get5Cards()
const playerInfo = calCardInfo(player)
const computerInfo = calCardInfo(computer)

function calCardInfo(card){
  const color  = card.map(item=>item.slice(0,2)).join('')
  const value  = card.map(item=>item.slice(3))
  const number = value.map(item=>Number(item) || map[item] )  // ['3','3','10','J','J'] => [3,3,10,11,11]
  const obj = {}
  number.forEach(item=>obj[item]? obj[item]++ : obj[item]=1) // {} => {3:2,10:1,11:2}
  /*
  注意：由于示例用的是最佳案例，并没有考虑到特殊情况，譬如：
  const player1 = ['♠️J','♣️J','♣️8','♦️8','♠️8']
  const computer1 = ['♠️10','♥️10','♣️9','♦️9','♠️9']

  const player2 = ['♠️J','♥️8','♣️8','♦️7','♣️6']
  const computer2 = ['♠️10','♥️9','♣️9','♦️6','♣️5']
  所以扑克牌排序不能简单按照从大到小的顺序来排列，必须优先考虑牌型。
  */
  number.sort((a,b)=>{   // 排序部分是整个游戏中最难的部分，对逻辑的缜密性要求极高。
    if(obj[a]==obj[b]){ // 如果数字出现的次数相同，按照数字本身的值从大到小排列
      return b-a
    }else{             // 反之，按照数字出现的次数从大到小排列
      return obj[b]-obj[a] 
    }
  })
  return {color,value,number,obj}
}

function calCardRank(info){
  const {color,value,number,obj} = info
  const rounds = Object.values(obj).sort((a,b)=>b-a).toString()  // {3:2,10:1,11:2} => [2,1,2] => [2,2,1] => '2,2,1' 便于比较
  if(colors.includes(color)){     // 如果是相同花色，证明是同花，继续判断
    if(number[0]-number[4]==4){  // 如果最大数减去最小数等于4，证明是同花顺
      if(number[0]==14){        // 如果最大数为14，证明是皇家同花顺
        return 10 // 皇家同花顺
      }else{
        return 9 // 同花顺
      } 
    }else{
      return 6 // 同花
    }
  }else{  // 如果不是相同花色，证明不是同花，继续判断
    if(rounds=='2,1,1,1'){
      return 2 // 一对
    }
    if(rounds=='2,2,1'){
      return 3 // 两对
    }
    if(rounds=='3,1,1'){
      return 4 // 三条
    }
    if(rounds=='3,2'){
      return 7 // 葫芦
    }
    if(rounds=='4,1'){
      return 8 // 四条
    }
    if(rounds=='1,1,1,1,1'){
      if(number[0]-number[4]==4){   // 如果最大数减去最小数等于4，证明是顺子
        return 5 // 顺子
      }else{
        return 1 // 散牌
      }
    }
  }
}

function compareCardSize(player,computer){
  console.log("你的牌型是 " + map[calCardRank(player)])
  console.log("电脑的牌型是 " + map[calCardRank(computer)])
  if(calCardRank(player)>calCardRank(computer)){
    return console.log('你赢了')
  }else if(calCardRank(player)<calCardRank(computer)){
    return console.log('你输了')
  }else{
    console.log('你和电脑的牌型相同')
    console.log('现在进入最终对决......')
    setTimeout(function(){
      for(let i=0;i<computer.number.length;i++){
        if(player.number[i]>computer.number[i]){
          return console.log('你赢了')
        }else if(player.number[i]<computer.number[i]){
          return console.log('你输了')
        }
      }
      console.log('平局')
    },1000)
  }
}

console.log("你的手牌是 " + player.join(" "))
console.log("电脑的手牌是 " + computer.join(" "))
compareCardSize(playerInfo,computerInfo)
